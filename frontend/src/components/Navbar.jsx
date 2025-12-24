import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav style={{ background: 'var(--surface)', boxShadow: 'var(--shadow)', padding: '1rem 0', position: 'sticky', top: 0, zIndex: 10 }}>
            <div className="container flex justify-between items-center">
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                    ShopMicro
                </Link>
                <div className="flex gap-4">
                    <Link to="/" className="btn btn-outline" style={{ border: 'none' }}>Products</Link>
                    <Link to="/cart" className="btn btn-outline" style={{ border: 'none' }}>Cart</Link>
                    <Link to="/orders" className="btn btn-outline" style={{ border: 'none' }}>Orders</Link>
                </div>
            </div>
        </nav>
    );
}
