import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { PageRoute, SITE_CONFIG } from '../config/siteConfig';

interface NavbarProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
}

const NAV_ITEMS: { label: string; route: PageRoute }[] = [
  { label: 'Home', route: '/' },
  { label: 'About', route: '/about' },
  { label: 'Booking', route: '/booking' },
  { label: 'Contact', route: '/contact' },
];

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 36);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentRoute]);

  const isHomeHeroTop = currentRoute === '/' && !isScrolled && !mobileMenuOpen;

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, route: PageRoute) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigate(route);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isHomeHeroTop
          ? 'bg-gradient-to-b from-[#183D32]/75 via-[#183D32]/35 to-transparent text-[#FFFFFF]'
          : 'bg-[#F8F6F0]/95 backdrop-blur-md text-[#183D32] border-b border-[#252925]/10 shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-16 md:h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark + Minimal Natural Botanical Mark */}
        <a
          href="/"
          onClick={(e) => handleNavClick(e, '/')}
          className="flex items-center gap-3 whitespace-nowrap shrink-0 group focus-visible:outline-none"
          aria-label="Small World Country Club Home"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className={`transition-colors duration-200 ${
              isHomeHeroTop ? 'text-[#C5A46D]' : 'text-[#183D32]'
            }`}
          >
            <path
              d="M16 26V14M16 14C11 14 7 11.5 5 9C9.5 8 13.5 9.5 16 13.5M16 14C21 14 25 11.5 27 9C22.5 8 18.5 9.5 16 13.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 26H22"
              stroke="#C5A46D"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <circle cx="16" cy="6.5" r="1.3" fill="#C5A46D" />
          </svg>
          <span className="flex flex-col leading-none">
            <span className="font-display text-sm sm:text-base tracking-[0.18em] font-semibold">
              {SITE_CONFIG.shortName}
            </span>
            <span
              className={`text-[9px] tracking-[0.28em] font-medium mt-1 ${
                isHomeHeroTop ? 'text-[#E6DCCB]' : 'text-[#354A36]'
              }`}
            >
              {SITE_CONFIG.subName}
            </span>
          </span>
        </a>

        {/* Zone 2: Clean Single-Line Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 lg:gap-9"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = currentRoute === item.route;
            return (
              <a
                key={item.route}
                href={item.route}
                onClick={(e) => handleNavClick(e, item.route)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative py-1.5 text-xs font-medium tracking-[0.16em] uppercase whitespace-nowrap shrink-0 transition-colors duration-200 ${
                  isHomeHeroTop
                    ? isActive
                      ? 'text-[#FFFFFF]'
                      : 'text-[#F8F6F0]/85 hover:text-[#FFFFFF]'
                    : isActive
                    ? 'text-[#183D32] font-semibold'
                    : 'text-[#252925]/75 hover:text-[#183D32]'
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 right-0 -bottom-0.5 h-[1.5px] transition-transform duration-200 origin-left ${
                    isHomeHeroTop ? 'bg-[#C5A46D]' : 'bg-[#183D32]'
                  } ${isActive ? 'scale-x-100' : 'scale-x-0'}`}
                />
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Hamburger */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/booking"
            onClick={(e) => handleNavClick(e, '/booking')}
            className={`hidden md:inline-flex items-center justify-center px-5 py-2.5 text-xs font-medium tracking-[0.14em] uppercase rounded-sm whitespace-nowrap shrink-0 transition-colors duration-200 ${
              isHomeHeroTop
                ? 'bg-[#C5A46D] text-[#183D32] hover:bg-[#E6DCCB]'
                : 'bg-[#183D32] text-[#F8F6F0] hover:bg-[#354A36]'
            }`}
          >
            Book Your Stay
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className={`md:hidden w-11 h-11 flex items-center justify-center rounded-sm transition-colors cursor-pointer ${
              isHomeHeroTop
                ? 'text-[#FFFFFF] hover:bg-[#FFFFFF]/10'
                : 'text-[#183D32] hover:bg-[#E6DCCB]/50'
            }`}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="md:hidden bg-[#F8F6F0] text-[#183D32] border-b border-[#252925]/10 px-6 py-6 shadow-lg"
        >
          <nav aria-label="Mobile Navigation" className="flex flex-col space-y-2">
            {NAV_ITEMS.map((item) => {
              const isActive = currentRoute === item.route;
              return (
                <a
                  key={item.route}
                  href={item.route}
                  onClick={(e) => handleNavClick(e, item.route)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`py-3 px-2 text-sm tracking-[0.15em] uppercase border-b border-[#252925]/10 flex items-center justify-between ${
                    isActive ? 'font-semibold text-[#183D32]' : 'text-[#252925]/80'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="text-[11px] tracking-wider text-[#C5A46D] font-medium">
                      Current
                    </span>
                  )}
                </a>
              );
            })}
            <div className="pt-4">
              <a
                href="/booking"
                onClick={(e) => handleNavClick(e, '/booking')}
                className="w-full inline-flex items-center justify-center px-6 py-3.5 bg-[#183D32] text-[#F8F6F0] text-xs font-medium tracking-[0.16em] uppercase rounded-sm hover:bg-[#354A36] transition-colors"
              >
                Reserve Your Stay
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
