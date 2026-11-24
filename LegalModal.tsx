import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

export type LegalModalType = 'privacy' | 'terms' | null;

interface LegalModalProps {
  type: LegalModalType;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  useEffect(() => {
    if (!type) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [type, onClose]);

  if (!type) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#252925]/70 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-[#F8F6F0] text-[#252925] max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-sm border border-[#252925]/15 shadow-xl p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#252925]/10">
          <div>
            <p className="text-xs tracking-widest uppercase text-[#354A36] font-medium">
              Small World Country Club
            </p>
            <h2 id="legal-modal-title" className="font-display text-2xl text-[#183D32] mt-1">
              {type === 'privacy' ? 'Privacy Policy' : 'Booking Terms & Conditions'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-10 h-10 flex items-center justify-center rounded-sm border border-[#252925]/15 text-[#252925] hover:bg-[#E6DCCB]/50 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 space-y-4 text-sm leading-relaxed text-[#252925]/85">
          {type === 'privacy' ? (
            <>
              <p>
                Small World Country Club respects your privacy. Information submitted through our
                booking request and contact forms—such as your full name, email address, telephone
                number, stay dates, and special requests—is used solely to respond to your enquiry
                and coordinate your reservation request.
              </p>
              <p>
                When you choose to continue a booking request or enquiry via WhatsApp (
                {SITE_CONFIG.contact.phoneDisplay}), your details are transmitted directly to the
                hotel’s official WhatsApp hospitality desk.
              </p>
              <p>
                Our interactive location map integrates Google Maps features and content. Use of
                embedded Google Maps is subject to the{' '}
                <a
                  href="https://maps.google.com/help/terms_maps/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-[#183D32] font-medium"
                >
                  Google Maps / Google Earth Additional Terms of Service
                </a>{' '}
                and the{' '}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-[#183D32] font-medium"
                >
                  Google Privacy Policy
                </a>
                .
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>1. Reservation Requests & Confirmation:</strong> Submitting a booking
                form on this website initiates a reservation request. Availability and final booking
                confirmation are provided directly by the Small World Country Club reservations team
                via telephone ({SITE_CONFIG.contact.phoneDisplay}) or WhatsApp.
              </p>
              <p>
                <strong>2. Check-in & Check-out Hours:</strong> Standard check-in begins at{' '}
                {SITE_CONFIG.hours.checkIn}, and standard check-out is at{' '}
                {SITE_CONFIG.hours.checkOut}. Guests requiring special arrival or departure
                arrangements are welcome to contact the hotel directly in advance.
              </p>
              <p>
                <strong>3. Rates & Special Requests:</strong> Applicable rates and any special
                accommodation arrangements are confirmed directly with you by our team prior to
                finalizing your stay.
              </p>
              <p>
                <strong>4. Location & Directions:</strong> Small World Country Club is located along{' '}
                {SITE_CONFIG.location.addressLine} (Google Maps Plus Code:{' '}
                {SITE_CONFIG.location.plusCode}).
              </p>
            </>
          )}
        </div>

        <div className="mt-8 pt-4 border-t border-[#252925]/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-[#183D32] text-[#F8F6F0] text-xs font-medium tracking-wider uppercase rounded-sm hover:bg-[#354A36] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
