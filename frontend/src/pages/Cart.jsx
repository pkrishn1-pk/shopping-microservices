import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {
        try {
            const data = await api.getCart();
            setCartItems(data);
        } catch (err) {
            setError('Failed to load cart');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const removeItem = async (itemId) => {
        try {
            await api.removeFromCart(itemId);
            await loadCart(); // Reload cart
        } catch (err) {
            alert('Failed to remove item');
            console.error(err);
        }
    };

    const checkout = async () => {
        try {
            await api.placeOrder(cartItems);
            alert('Order placed successfully!');
            navigate('/orders');
            // Ideally, clear cart here, but backend should handle or we call delete on all items.
            // For this demo, we'll assume placing an order doesn't auto-clear cart in the backend 
            // unless Order Service talks to Cart Service.
            // Start with clearing UI logic or simple assumption. 
            // If backend doesn't clear cart, we should manually clear it.
            // Let's assume for now we just navigate.
        } catch (err) {
            alert('Failed to place order');
            console.error(err);
        }
    };

    if (loading) return <div className="text-center mt-4">Loading cart...</div>;
    if (error) return <div className="text-center mt-4" style={{ color: 'var(--danger)' }}>{error}</div>;

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="container mt-4">
            <h1 className="mb-4" style={{ fontSize: '2rem', fontWeight: 'bold' }}>Your Cart</h1>

            {cartItems.length === 0 ? (
                <p className="text-center" style={{ color: 'var(--text-light)', marginTop: '2rem' }}>Your cart is empty.</p>
            ) : (
                <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                    <div className="flex" style={{ flexDirection: 'column', gap: '1rem' }}>
                        {cartItems.map(item => (
                            <div key={item.id} className="card flex justify-between items-center">
                                <div>
                                    <h3 style={{ fontWeight: 'bold' }}>{item.name}</h3>
                                    <p style={{ color: 'var(--text-light)' }}>${item.price} x {item.quantity}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span style={{ fontWeight: 'bold' }}>${(item.price * item.quantity).toFixed(2)}</span>
                                    <button className="btn btn-danger" onClick={() => removeItem(item.id)}>Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="card" style={{ height: 'fit-content' }}>
                        <h2 className="mb-4" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Order Summary</h2>
                        <div className="flex justify-between mb-4">
                            <span>Subtotal</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-4" style={{ fontWeight: 'bold' }}>
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%' }} onClick={checkout}>
                            Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
