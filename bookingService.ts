import { SITE_CONFIG } from '../config/siteConfig';

export interface BookingDraft {
  fullName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
  specialRequests: string;
  acceptedTerms: boolean;
}

export interface ContactDraft {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export function getTodayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDaysIsoDate(baseIso: string, days: number): string {
  const parts = baseIso.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    return getTodayIsoDate();
  }
  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculateNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  const diffMs = end.getTime() - start.getTime();
  const nights = Math.round(diffMs / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : 0;
}

export function formatReadableDate(isoDate: string): string {
  if (!isoDate) return 'Not selected';
  const parts = isoDate.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return isoDate;
  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  return date.toLocaleDateString('en-KE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function buildBookingWhatsAppUrl(booking: BookingDraft, nights: number): string {
  const lines = [
    'Hello Small World Country Club,',
    'I would like to submit a reservation request with the following details:',
    '',
    `Guest Name: ${booking.fullName.trim()}`,
    `Email: ${booking.email.trim()}`,
    `Telephone: ${booking.phone.trim()}`,
    `Check-in Date: ${formatReadableDate(booking.checkIn)} (from ${SITE_CONFIG.hours.checkIn})`,
    `Check-out Date: ${formatReadableDate(booking.checkOut)} (by ${SITE_CONFIG.hours.checkOut})`,
    `Duration: ${nights} ${nights === 1 ? 'Night' : 'Nights'}`,
    `Guests: ${booking.adults} ${booking.adults === 1 ? 'Adult' : 'Adults'}${
      booking.children > 0
        ? `, ${booking.children} ${booking.children === 1 ? 'Child' : 'Children'}`
        : ''
    }`,
    `Rooms Requested: ${booking.rooms}`,
    booking.specialRequests.trim()
      ? `Special Requests: ${booking.specialRequests.trim()}`
      : 'Special Requests: None',
    '',
    'Kindly confirm availability and next steps. Thank you.',
  ];
  return `${SITE_CONFIG.contact.whatsappBaseUrl}?text=${encodeURIComponent(lines.join('\n'))}`;
}

export function buildGeneralWhatsAppUrl(customMessage?: string): string {
  const msg =
    customMessage ||
    'Hello Small World Country Club. I would like to make an enquiry about your hotel.';
  return `${SITE_CONFIG.contact.whatsappBaseUrl}?text=${encodeURIComponent(msg)}`;
}

export function buildContactWhatsAppUrl(contact: ContactDraft): string {
  const lines = [
    'Hello Small World Country Club,',
    `Subject: ${contact.subject.trim()}`,
    '',
    `Name: ${contact.fullName.trim()}`,
    `Email: ${contact.email.trim()}`,
    `Phone: ${contact.phone.trim()}`,
    '',
    'Message:',
    contact.message.trim(),
  ];
  return `${SITE_CONFIG.contact.whatsappBaseUrl}?text=${encodeURIComponent(lines.join('\n'))}`;
}

/**
 * Future-ready reservation request submission hook.
 * Currently prepares a client-side request packet for WhatsApp confirmation
 * unless a live backend API endpoint is configured in SITE_CONFIG.integrations.
 */
export async function submitReservationRequest(
  booking: BookingDraft,
  nights: number
): Promise<{
  backendDelivered: boolean;
  whatsappUrl: string;
}> {
  const whatsappUrl = buildBookingWhatsAppUrl(booking, nights);

  if (SITE_CONFIG.integrations.backendBookingApiUrl) {
    const response = await fetch(SITE_CONFIG.integrations.backendBookingApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...booking,
        nights,
        submittedAt: new Date().toISOString(),
      }),
    });
    if (!response.ok) {
      throw new Error('Unable to reach booking server. Please continue via WhatsApp.');
    }
    return { backendDelivered: true, whatsappUrl };
  }

  return { backendDelivered: false, whatsappUrl };
}

/**
 * Future-ready contact enquiry submission hook.
 * Never simulates a false email delivery when no backend is configured.
 */
export async function submitContactEnquiry(contact: ContactDraft): Promise<{
  backendDelivered: boolean;
  whatsappUrl: string;
}> {
  const whatsappUrl = buildContactWhatsAppUrl(contact);

  if (SITE_CONFIG.integrations.backendContactApiUrl) {
    const response = await fetch(SITE_CONFIG.integrations.backendContactApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...contact,
        submittedAt: new Date().toISOString(),
      }),
    });
    if (!response.ok) {
      throw new Error('Unable to send message via email server. Please send via WhatsApp.');
    }
    return { backendDelivered: true, whatsappUrl };
  }

  return { backendDelivered: false, whatsappUrl };
}
