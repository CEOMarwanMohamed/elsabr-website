import { Route, Routes, useLocation } from 'react-router-dom';
import { CartProvider } from './cart/CartContext';
import { CartFab } from './components/CartButton';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { FooterSlim } from './components/FooterSlim';
import { Header } from './components/Header';
import { ScrollToHash } from './components/ScrollToHash';
import Catalog from './pages/Catalog';
import Home from './pages/Home';

function Shell() {
  const { pathname } = useLocation();
  const onCatalog = pathname === '/catalog';

  return (
    <>
      <ScrollToHash />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      {onCatalog ? <FooterSlim /> : <Footer />}
      <CartDrawer />
      <CartFab />
    </>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Shell />
    </CartProvider>
  );
}
