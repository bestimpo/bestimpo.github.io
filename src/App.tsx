import { Route, Routes } from 'react-router-dom'
import { CartDrawer } from '@/components/CartDrawer'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { ScrollToTop } from '@/components/ScrollToTop'
import { CartProvider } from '@/context/CartContext'
import { LanguageProvider, useLanguage } from '@/i18n/LanguageContext'
import { About } from '@/pages/About'
import { Checkout } from '@/pages/Checkout'
import { Contact } from '@/pages/Contact'
import { Home } from '@/pages/Home'
import { NotFound } from '@/pages/NotFound'
import { ProductDetail } from '@/pages/ProductDetail'
import { Shop } from '@/pages/Shop'

function Shell() {
  const { t } = useLanguage()

  return (
    <>
      <ScrollToTop />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:rounded-lg focus:bg-brand-500 focus:px-4 focus:py-2 focus:font-semibold focus:text-brand-950"
      >
        {t('nav.skipToContent')}
      </a>
      <div className="flex min-h-dvh flex-col">
        <Navbar />
        <main id="main" className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <CartDrawer />
    </>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <Shell />
      </CartProvider>
    </LanguageProvider>
  )
}
