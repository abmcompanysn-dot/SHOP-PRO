import { useEffect } from "react";
import { HashRouter, Link, Route, Routes, useLocation } from "react-router-dom";
import { StoreProvider, useStore } from "./context/StoreContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import { IconWhatsApp } from "./components/Icons";
import { CONTACT } from "./data/catalog";
import Home from "./pages/Home";
import Catalogue from "./pages/Catalogue";
import ProductDetail from "./pages/ProductDetail";
import Commander from "./pages/Commander";
import CommandeGroupee from "./pages/CommandeGroupee";
import CommentCommander from "./pages/CommentCommander";
import APropos from "./pages/APropos";
import Contact from "./pages/Contact";
import Galerie from "./pages/Galerie";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

function Toasts() {
  const { toasts } = useStore();
  return (
    <div className="pointer-events-none fixed bottom-6 left-5 z-[95] flex flex-col gap-3">
      {toasts.map((t) => (
        <p
          key={t.id}
          className="toast-in border-l-2 border-volt-500 bg-navy-900 px-5 py-4 text-sm text-ice-100 shadow-[0_18px_44px_-16px_rgba(9,28,61,0.8)]"
        >
          {t.msg}
        </p>
      ))}
    </div>
  );
}

/**
 * Bouton WhatsApp flottant, visible sur toutes les pages — même pattern que
 * le bouton vert flottant du site frère HANNIFA (voir
 * C:\Users\Admin\HANNIFA\src\App.tsx). Numéro réel de M. NDAO (77 366 97 21),
 * au format international pour le lien wa.me.
 */
function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${CONTACT.whatsappNumber}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Discuter avec SHOP PRO sur WhatsApp"
      title="WhatsApp"
      className="pulse-dot fixed right-5 bottom-6 z-[75] grid h-14 w-14 place-items-center rounded-full bg-[#1f8f52] text-ice-50 shadow-[0_16px_38px_-10px_rgba(31,143,82,0.75)] transition-transform duration-300 hover:scale-110"
    >
      <IconWhatsApp size={26} />
    </a>
  );
}

function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-32 text-center">
      <p className="eyebrow">Page introuvable</p>
      <p className="font-display mt-4 text-6xl font-bold text-navy-900">Perdu en chemin…</p>
      <p className="mt-4 text-navy-500">Cette page n'existe pas, mais notre catalogue vous attend.</p>
      <Link to="/" className="btn-primary mt-8">Retour à l'accueil</Link>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <ScrollToTop />
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalogue" element={<Catalogue />} />
              <Route path="/produits/:id" element={<ProductDetail />} />
              <Route path="/commander" element={<Commander />} />
              <Route path="/commande-groupee" element={<CommandeGroupee />} />
              <Route path="/comment-commander" element={<CommentCommander />} />
              <Route path="/a-propos" element={<APropos />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/galerie" element={<Galerie />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <CartDrawer />
        <Toasts />
        <WhatsAppFloat />
        <div className="noise-layer" aria-hidden />
      </HashRouter>
    </StoreProvider>
  );
}
