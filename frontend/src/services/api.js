const USER_ID = 1;

export const api = {
    // Inventory Service
    getProducts: async () => {
        const res = await fetch('/inventory');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        return data.map(p => ({
            ...p,
            price: p.price || parseFloat((p.id * 10 + 5.99).toFixed(2))
        }));
    },

    // Cart Service
    getCart: async () => {
        const res = await fetch(`/cart/${USER_ID}`);
        if (!res.ok) throw new Error('Failed to fetch cart');
        return res.json();
    },

    addToCart: async (product) => {
        // InventoryItem has 'id', but CartItem expects 'itemId'
        const payload = {
            itemId: product.id,
            name: product.name,
            price: product.price,
            productName: product.name, // CartItem expects 'productName'
            quantity: 1 // Default to 1
        };

        const res = await fetch(`/cart/${USER_ID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Failed to add to cart');
        return res.json();
    },

    removeFromCart: async (cartItemId) => {
        const res = await fetch(`/cart/${cartItemId}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('Failed to remove item');
    },

    // Order Service
    getOrders: async () => {
        const res = await fetch(`/order/${USER_ID}`);
        if (!res.ok) throw new Error('Failed to fetch orders');
        return res.json();
    },

    placeOrder: async (cartItems) => {
        // Calculate total
        const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const orderItems = cartItems.map(item => ({
            productId: item.itemId,
            quantity: item.quantity,
            price: item.price
        }));

        const itemsDescription = cartItems.map(item => `${item.name} x${item.quantity}`).join(', ');

        const payload = {
            userId: USER_ID,
            totalAmount: totalAmount,
            itemsDescription: itemsDescription,
            status: "CREATED" // Match enum in Order Service
        };

        const res = await fetch('/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error('Failed to place order');
        return res.json();
    }
};
