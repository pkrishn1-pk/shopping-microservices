import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await api.getOrders();
            setOrders(data);
        } catch (err) {
            setError('Failed to load orders');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center mt-4">Loading orders...</div>;
    if (error) return <div className="text-center mt-4" style={{ color: 'var(--danger)' }}>{error}</div>;

    return (
        <div className="container mt-4">
            <h1 className="mb-4" style={{ fontSize: '2rem', fontWeight: 'bold' }}>Your Orders</h1>
            {orders.length === 0 ? (
                <p className="text-center" style={{ color: 'var(--text-light)', marginTop: '2rem' }}>No orders found.</p>
            ) : (
                <div className="flex" style={{ flexDirection: 'column', gap: '1rem' }}>
                    {orders.map(order => (
                        <div key={order.id} className="card">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 style={{ fontWeight: 'bold' }}>Order #{order.id}</h3>
                                    <p style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Status: {order.status}</p>
                                </div>
                                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>${order.totalAmount}</span>
                            </div>
                            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                                <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Items:</h4>
                                <ul style={{ listStyle: 'none' }}>
                                    {order.items && order.items.map((item, idx) => (
                                        <li key={idx} className="flex justify-between" style={{ color: 'var(--text-light)', marginBottom: '0.25rem' }}>
                                            <span>Product #{item.productId} (x{item.quantity})</span>
                                            <span>${item.price}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
