import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await api.getProducts();
            setProducts(data);
        } catch (err) {
            setError('Failed to load products. Is the Inventory Service running?');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (product) => {
        try {
            await api.addToCart(product);
            alert(`Added ${product.name} to cart!`);
        } catch (err) {
            alert('Failed to add to cart');
            console.error(err);
        }
    };

    if (loading) return <div className="text-center mt-4">Loading products...</div>;
    if (error) return <div className="text-center mt-4" style={{ color: 'var(--danger)' }}>{error}</div>;

    return (
        <div className="container mt-4">
            <h1 className="mb-4" style={{ fontSize: '2rem', fontWeight: 'bold' }}>Products</h1>
            <div className="grid grid-cols-3" style={{ gap: '2rem' }}>
                {products.map(product => (
                    <div key={product.id} className="card flex" style={{ flexDirection: 'column', height: '100%' }}>
                        <div style={{ flex: 1 }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{product.name}</h2>
                            <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>{product.description || 'No description available'}</p>
                            <div className="flex justify-between items-center mb-4">
                                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>${product.price}</span>
                                <span style={{
                                    background: product.quantity > 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    color: product.quantity > 0 ? 'var(--success)' : 'var(--danger)',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '1rem',
                                    fontSize: '0.875rem',
                                    fontWeight: '500'
                                }}>
                                    {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of Stock'}
                                </span>
                            </div>
                        </div>
                        <button
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                            onClick={() => addToCart(product)}
                            disabled={product.quantity <= 0}
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
