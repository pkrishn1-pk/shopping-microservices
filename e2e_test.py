import unittest
import urllib.request
import urllib.error
import json
import random

# Configuration
CART_SERVICE_URL = "http://localhost:8081"
ORDER_SERVICE_URL = "http://localhost:8082"
INVENTORY_SERVICE_URL = "http://localhost:8083"

def make_request(url, method="GET", data=None):
    """Helper to make HTTP requests using standard library."""
    try:
        req = urllib.request.Request(url, method=method)
        req.add_header('Content-Type', 'application/json')
        
        body = None
        if data is not None:
            body = json.dumps(data).encode('utf-8')
            
        with urllib.request.urlopen(req, data=body) as response:
            resp_body = response.read().decode('utf-8')
            try:
                if resp_body:
                    return json.loads(resp_body), response.status
                return None, response.status
            except json.JSONDecodeError:
                return resp_body, response.status
    except urllib.error.HTTPError as e:
        return e.read().decode('utf-8'), e.code
    except urllib.error.URLError as e:
        print(f"\n[!] Error connecting to {url}: {e.reason}")
        print("    Please ensure the microservices are running (Cart:8081, Order:8082, Inventory:8083).")
        exit(1)

class TestShoppingMicroservices(unittest.TestCase):
    def setUp(self):
        # Generate a unique user ID for this test run to avoid collision
        self.user_id = random.randint(1000, 9999)
        self.item_name = f"TestProduct_{self.user_id}"
        self.item_quantity = 10

    def test_end_to_end_flow(self):
        print(f"\n--- Starting E2E Test for User ID: {self.user_id} ---")

        # 1. Create Inventory Item
        print("1. Creating Inventory Item...")
        inventory_payload = {
            "name": self.item_name,
            "quantity": self.item_quantity
        }
        resp_data, status = make_request(f"{INVENTORY_SERVICE_URL}/inventory", method="POST", data=inventory_payload)
        self.assertEqual(status, 200, f"Failed to add inventory: {resp_data}")
        self.assertIsNotNone(resp_data.get('id'))
        print(f"   => Created Inventory Item: {resp_data}")
        inventory_id = resp_data['id']

        # 2. Verify Inventory Item Exists
        print("2. Verifying Inventory Item...")
        resp_data, status = make_request(f"{INVENTORY_SERVICE_URL}/inventory")
        self.assertEqual(status, 200)
        found_item = next((item for item in resp_data if item['id'] == inventory_id), None)
        self.assertIsNotNone(found_item, "Inventory item not found in list")
        self.assertEqual(found_item['name'], self.item_name)
        print("   => Inventory verified.")

        # 3. Add Item to Cart
        print("3. Adding Item to Cart...")
        cart_payload = {
            "userId": self.user_id,
            "productName": self.item_name,
            "quantity": 2
        }
        # Note: API is POST /cart/{userId}
        resp_data, status = make_request(f"{CART_SERVICE_URL}/cart/{self.user_id}", method="POST", data=cart_payload)
        self.assertEqual(status, 200, f"Failed to add to cart: {resp_data}")
        print(f"   => Added to Cart: {resp_data}")

        # 4. Verify Cart Items
        print("4. Verifying Cart...")
        resp_data, status = make_request(f"{CART_SERVICE_URL}/cart/{self.user_id}")
        self.assertEqual(status, 200)
        self.assertGreater(len(resp_data), 0, "Cart should not be empty")
        self.assertEqual(resp_data[0]['productName'], self.item_name)
        print(f"   => Cart verified. Items: {len(resp_data)}")

        # 5. Place Order
        print("5. Placing Order...")
        order_payload = {
            "userId": self.user_id,
            "status": "PENDING"
        }
        resp_data, status = make_request(f"{ORDER_SERVICE_URL}/order", method="POST", data=order_payload)
        self.assertEqual(status, 200, f"Failed to place order: {resp_data}")
        self.assertIsNotNone(resp_data.get('id'))
        self.assertEqual(resp_data['status'], "PLACED")
        print(f"   => Order Placed: {resp_data}")
        order_id = resp_data['id']

        # 6. Verify Order History
        print("6. Verifying Order History...")
        resp_data, status = make_request(f"{ORDER_SERVICE_URL}/order/{self.user_id}")
        self.assertEqual(status, 200)
        found_order = next((o for o in resp_data if o['id'] == order_id), None)
        self.assertIsNotNone(found_order, "Order not found in history")
        print("   => Order history verified.")

        # 7. Cancel Order (DELETE /order/{id})
        print("7. Cancelling Order...")
        resp_data, status = make_request(f"{ORDER_SERVICE_URL}/order/{order_id}", method="DELETE")
        self.assertEqual(status, 200, "Failed to cancel order")
        print("   => Order cancelled.")

        # 8. Verify Order Cancelled
        print("8. Verifying Order Cancelled...")
        resp_data, status = make_request(f"{ORDER_SERVICE_URL}/order/{self.user_id}")
        self.assertEqual(status, 200)
        found_order = next((o for o in resp_data if o['id'] == order_id), None)
        self.assertIsNone(found_order, "Order should have been removed")
        print("   => Order cancellation verified.")

        # 9. Remove Item from Cart (DELETE /cart/{itemId})
        # Note: We need the cart item ID. In step 3, we got `cart_item` but didn't save ID properly in the script if it returns list or object.
        # Let's clean up the cart by getting the item ID first.
        print("9. Removing Item from Cart...")
        resp_data, status = make_request(f"{CART_SERVICE_URL}/cart/{self.user_id}")
        if len(resp_data) > 0:
            cart_item_id = resp_data[0]['id']
            resp_data, status = make_request(f"{CART_SERVICE_URL}/cart/{cart_item_id}", method="DELETE")
            self.assertEqual(status, 200, "Failed to remove item from cart")
            print(f"   => Removed item {cart_item_id} from cart.")
        else:
            print("   => Cart was already empty (unexpected).")

        # 10. Verify Cart Empty
        print("10. Verifying Cart Empty...")
        resp_data, status = make_request(f"{CART_SERVICE_URL}/cart/{self.user_id}")
        self.assertEqual(len(resp_data), 0, "Cart should be empty")
        print("   => Cart verified empty.")

        # 11. Delete Inventory Item (DELETE /inventory/{id})
        print("11. Deleting Inventory Item...")
        resp_data, status = make_request(f"{INVENTORY_SERVICE_URL}/inventory/{inventory_id}", method="DELETE")
        self.assertEqual(status, 200, "Failed to delete inventory item")
        print(f"   => Deleted inventory item {inventory_id}.")

        # 12. Verify Inventory Item Deleted
        print("12. Verifying Inventory Item Deleted...")
        resp_data, status = make_request(f"{INVENTORY_SERVICE_URL}/inventory")
        found_item = next((item for item in resp_data if item['id'] == inventory_id), None)
        self.assertIsNone(found_item, "Inventory item should have been removed")
        print("   => Inventory deletion verified.")
        
        print("\n--- E2E Test Successfully Completed ---")

if __name__ == '__main__':
    unittest.main()
