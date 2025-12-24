import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Orders from './pages/Orders';

function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1, paddingBottom: '2rem' }}>
          <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </main>
        <footer className="text-center" style={{ padding: '1rem', color: 'var(--text-light)', borderTop: '1px solid var(--border)' }}>
          Shopping Microservices Demo
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
