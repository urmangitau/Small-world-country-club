import { useCallback, useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { Footer } from './components/Footer';
import { LegalModal, LegalModalType } from './components/LegalModal';
import { Lightbox } from './components/Lightbox';
import { Navbar } from './components/Navbar';
import { GALLERY_ITEMS, PageRoute } from './config/siteConfig';
import { AboutPage } from './pages/AboutPage';
import { BookingPage } from './pages/BookingPage';
import { ContactPage } from './pages/ContactPage';
import { HomePage, QuickBookingPrefill } from './pages/HomePage';

function resolveRoute(pathname: string): PageRoute {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/booking' || clean === '/booking.html') return '/booking';
  if (clean === '/contact' || clean === '/contact.html') return '/contact';
  if (clean === '/about' || clean === '/about.html') return '/about';
  return '/';
}

const ROUTE_TITLES: Record<PageRoute, string> = {
  '/': 'Small World Country Club | Peaceful Retreat in Athi River, Kenya',
  '/booking': 'Reserve Your Stay | Small World Country Club',
  '/contact': 'Contact Us | Small World Country Club, Athi River',
  '/about': 'About Us | Small World Country Club, Mombasa Road',
};

export default function App() {
  const [route, setRoute] = useState<PageRoute>(() => resolveRoute(window.location.pathname));
  const [quickBookingPrefill, setQuickBookingPrefill] = useState<QuickBookingPrefill | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [legalModal, setLegalModal] = useState<LegalModalType>(null);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(resolveRoute(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    document.title = ROUTE_TITLES[route];
  }, [route]);

  useEffect(() => {
    const handleQuotaExceeded = () => {
      setQuotaExceeded(true);
    };
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 450);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navigate = useCallback((nextRoute: PageRoute) => {
    if (window.location.pathname !== nextRoute) {
      window.history.pushState({}, '', nextRoute);
    }
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleQuickBook = useCallback(
    (prefill: QuickBookingPrefill) => {
      setQuickBookingPrefill(prefill);
      navigate('/booking');
    },
    [navigate]
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F0] bg-texture-linen text-[#252925]">
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      <Navbar currentRoute={route} onNavigate={navigate} />

      <main className="flex-1">
        {route === '/' && (
          <HomePage
            onNavigate={navigate}
            onQuickBook={handleQuickBook}
            onOpenLightbox={setLightboxIndex}
            quotaExceeded={quotaExceeded}
          />
        )}
        {route === '/booking' && (
          <BookingPage prefill={quickBookingPrefill} onOpenLegal={setLegalModal} />
        )}
        {route === '/contact' && <ContactPage quotaExceeded={quotaExceeded} />}
        {route === '/about' && (
          <AboutPage onNavigate={navigate} onOpenLightbox={setLightboxIndex} />
        )}
      </main>

      <Footer onNavigate={navigate} onOpenLegal={setLegalModal} />

      <Lightbox
        items={GALLERY_ITEMS}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onSelectIndex={setLightboxIndex}
      />

      <LegalModal type={legalModal} onClose={() => setLegalModal(null)} />

      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-30 w-11 h-11 rounded-sm bg-[#183D32] text-[#F8F6F0] border border-[#C5A46D]/40 shadow-lg flex items-center justify-center hover:bg-[#354A36] transition-colors cursor-pointer"
        >
          <ArrowUp className="w-5 h-5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
