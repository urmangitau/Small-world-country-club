import React from 'react';
import { Clock, ExternalLink, MapPin, MessageCircle, Phone } from 'lucide-react';
import { PageRoute, SITE_CONFIG } from '../config/siteConfig';
import { buildGeneralWhatsAppUrl } from '../services/bookingService';
import { LegalModalType } from './LegalModal';

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
  onOpenLegal: (type: LegalModalType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenLegal }) => {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, route: PageRoute) => {
    e.preventDefault();
    onNavigate(route);
  };

  const configuredSocials = [
    { label: 'Facebook', url: SITE_CONFIG.socialLinks.facebook },
    { label: 'Instagram', url: SITE_CONFIG.socialLinks.instagram },
    { label: 'TikTok', url: SITE_CONFIG.socialLinks.tiktok },
  ].filter((item) => Boolean(item.url));

  return (
    <footer className="bg-[#183D32] text-[#F8F6F0] border-t border-[#C5A46D]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-14 border-b border-[#F8F6F0]/15">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <p className="font-display text-lg tracking-[0.16em] text-[#FFFFFF]">
              SMALL WORLD COUNTRY CLUB
            </p>
            <p className="font-serif-editorial italic text-xl text-[#C5A46D] mt-4">
              “{SITE_CONFIG.tagline}”
            </p>
            <p className="text-xs leading-relaxed text-[#E6DCCB]/85 mt-5">
              {SITE_CONFIG.positioning}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C5A46D] pb-3 mb-5 border-b border-[#F8F6F0]/10">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Home', route: '/' as PageRoute },
                { label: 'About', route: '/about' as PageRoute },
                { label: 'Booking', route: '/booking' as PageRoute },
                { label: 'Contact', route: '/contact' as PageRoute },
              ].map((link) => (
                <li key={link.route}>
                  <a
                    href={link.route}
                    onClick={(e) => handleLinkClick(e, link.route)}
                    className="text-[#F8F6F0]/85 hover:text-[#C5A46D] transition-colors inline-block py-0.5"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Location */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C5A46D] pb-3 mb-5 border-b border-[#F8F6F0]/10">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-[#F8F6F0]/85">
              <li>
                <a
                  href={SITE_CONFIG.contact.phoneHref}
                  className="inline-flex items-center gap-2.5 hover:text-[#C5A46D] transition-colors tabular-nums"
                >
                  <Phone className="w-4 h-4 text-[#C5A46D] shrink-0" aria-hidden="true" />
                  <span>{SITE_CONFIG.contact.phoneDisplay}</span>
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A46D] shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  {SITE_CONFIG.location.addressLine}
                  <span className="block text-xs text-[#E6DCCB]/75 mt-0.5">
                    Plus Code: {SITE_CONFIG.location.plusCode}
                  </span>
                </span>
              </li>
              <li>
                <a
                  href={buildGeneralWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-[#E6DCCB] hover:text-[#FFFFFF] transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#C5A46D] shrink-0" aria-hidden="true" />
                  <span>WhatsApp Reservations Desk</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Check-in / Check-out & Channels */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C5A46D] pb-3 mb-5 border-b border-[#F8F6F0]/10">
              Guest Hours &amp; Channels
            </h3>
            <div className="space-y-2.5 text-sm text-[#F8F6F0]/85">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#C5A46D] shrink-0" aria-hidden="true" />
                <span>
                  Check-in: <strong className="font-medium text-[#FFFFFF]">{SITE_CONFIG.hours.checkIn}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#C5A46D] shrink-0" aria-hidden="true" />
                <span>
                  Check-out: <strong className="font-medium text-[#FFFFFF]">{SITE_CONFIG.hours.checkOut}</strong>
                </span>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-[11px] tracking-[0.18em] uppercase text-[#E6DCCB]/75 mb-2">
                Social & Listings
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                <a
                  href={SITE_CONFIG.location.googleMapsListingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#F8F6F0]/90 hover:text-[#C5A46D] transition-colors"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
                <a
                  href={SITE_CONFIG.location.tripadvisorSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#F8F6F0]/90 hover:text-[#C5A46D] transition-colors"
                >
                  <span>Tripadvisor</span>
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
                {configuredSocials.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#F8F6F0]/90 hover:text-[#C5A46D] transition-colors"
                  >
                    <span>{social.label}</span>
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>
                ))}
              </div>
              {configuredSocials.length === 0 && (
                <p className="text-[11px] text-[#E6DCCB]/65 mt-2">
                  Facebook, Instagram &amp; TikTok links ready for configuration in site settings.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Legal Bar */}
        <div className="pt-9 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E6DCCB]/75">
          <p>© 2026 Small World Country Club. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => onOpenLegal('privacy')}
              className="hover:text-[#FFFFFF] underline underline-offset-4 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => onOpenLegal('terms')}
              className="hover:text-[#FFFFFF] underline underline-offset-4 transition-colors cursor-pointer"
            >
              Terms &amp; Conditions
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
