import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Copy,
  MessageCircle,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { HOTEL_MEDIA, SITE_CONFIG } from '../config/siteConfig';
import {
  BookingDraft,
  addDaysIsoDate,
  calculateNights,
  formatReadableDate,
  getTodayIsoDate,
  submitReservationRequest,
} from '../services/bookingService';
import { LegalModalType } from '../components/LegalModal';
import { QuickBookingPrefill } from './HomePage';
import { ResilientImage } from '../components/ResilientImage';

interface BookingPageProps {
  prefill: QuickBookingPrefill | null;
  onOpenLegal: (type: LegalModalType) => void;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  checkIn?: string;
  checkOut?: string;
  acceptedTerms?: string;
}

export const BookingPage: React.FC<BookingPageProps> = ({ prefill, onOpenLegal }) => {
  const today = useMemo(() => getTodayIsoDate(), []);
  const defaultCheckIn = useMemo(() => addDaysIsoDate(today, 1), [today]);
  const defaultCheckOut = useMemo(() => addDaysIsoDate(today, 3), [today]);

  const [form, setForm] = useState<BookingDraft>({
    fullName: '',
    email: '',
    phone: '',
    checkIn: prefill?.checkIn || defaultCheckIn,
    checkOut: prefill?.checkOut || defaultCheckOut,
    adults: prefill?.adults ?? 2,
    children: prefill?.children ?? 0,
    rooms: prefill?.rooms ?? 1,
    specialRequests: '',
    acceptedTerms: false,
  });

  useEffect(() => {
    if (prefill) {
      setForm((prev) => ({
        ...prev,
        checkIn: prefill.checkIn,
        checkOut: prefill.checkOut,
        adults: prefill.adults,
        children: prefill.children,
        rooms: prefill.rooms,
      }));
    }
  }, [prefill]);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    backendDelivered: boolean;
    whatsappUrl: string;
  } | null>(null);
  const [submitError, setSubmitError] = useState('');
  const [copied, setCopied] = useState(false);

  const nights = useMemo(
    () => calculateNights(form.checkIn, form.checkOut),
    [form.checkIn, form.checkOut]
  );

  const updateField = <K extends keyof BookingDraft>(key: K, value: BookingDraft[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'checkIn' && typeof value === 'string') {
        if (next.checkOut <= value) {
          next.checkOut = addDaysIsoDate(value, 1);
        }
      }
      return next;
    });
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setSubmitError('');
  };

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      nextErrors.fullName = 'Please enter your full name.';
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim() || !emailPattern.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    const phoneDigits = form.phone.replace(/[^\d+]/g, '');
    if (!phoneDigits || phoneDigits.length < 7) {
      nextErrors.phone = 'Please enter a valid telephone number.';
    }
    if (!form.checkIn) {
      nextErrors.checkIn = 'Please select an arrival date.';
    } else if (form.checkIn < today) {
      nextErrors.checkIn = 'Arrival date cannot be in the past.';
    }
    if (!form.checkOut) {
      nextErrors.checkOut = 'Please select a departure date.';
    } else if (form.checkOut <= form.checkIn) {
      nextErrors.checkOut = 'Departure date must be later than the arrival date.';
    }
    if (!form.acceptedTerms) {
      nextErrors.acceptedTerms =
        'Please agree to the booking terms and privacy policy to continue.';
    }
    return nextErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    try {
      const result = await submitReservationRequest(form, nights);
      setSubmitResult(result);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Unable to prepare reservation request. Please try WhatsApp directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopySummary = async () => {
    const summaryText = [
      'Small World Country Club — Reservation Request',
      `Guest: ${form.fullName}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      `Check-in: ${formatReadableDate(form.checkIn)} (${SITE_CONFIG.hours.checkIn})`,
      `Check-out: ${formatReadableDate(form.checkOut)} (${SITE_CONFIG.hours.checkOut})`,
      `Nights: ${nights}`,
      `Guests: ${form.adults} Adults, ${form.children} Children`,
      `Rooms: ${form.rooms}`,
      `Special Requests: ${form.specialRequests || 'None'}`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard blocked in restricted frames; ignore gracefully
    }
  };

  return (
    <div className="pt-20 pb-24">
      {/* Header Banner */}
      <section className="bg-[#183D32] bg-texture-botanical-dark text-[#F8F6F0] py-16 md:py-22">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <p className="text-xs font-medium tracking-[0.24em] uppercase text-[#C5A46D]">
            Reservations
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-[#FFFFFF] leading-tight mt-4">
            Reserve Your Stay
          </h1>
          <div aria-hidden="true" className="w-14 h-[1.5px] bg-[#C5A46D] my-5" />
          <p className="font-serif-editorial italic text-xl text-[#E6DCCB] max-w-2xl">
            Your next memorable experience is just a few steps away.
          </p>
        </div>
      </section>

      {/* Main Two-Column Booking Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Booking Request Form or Prepared Confirmation */}
          <div className="lg:col-span-7">
            {submitResult ? (
              <div
                role="status"
                className="bg-[#FFFFFF] border border-[#183D32]/20 rounded-sm p-8 md:p-10 shadow-sm"
              >
                <div className="w-12 h-12 rounded-sm bg-[#183D32] text-[#C5A46D] flex items-center justify-center mb-5">
                  <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
                </div>
                <h2 className="font-display text-2xl sm:text-3xl text-[#183D32]">
                  Reservation Request Prepared
                </h2>
                <p className="text-sm sm:text-base text-[#252925]/85 mt-4 leading-relaxed">
                  Thank you for choosing Small World Country Club. Your reservation request has been
                  received. Our team will contact you to confirm availability and finalize your
                  booking.
                </p>

                <div className="mt-6 p-5 bg-[#F8F6F0] border border-[#252925]/10 rounded-sm text-xs text-[#252925]/80 space-y-1.5">
                  <p className="font-semibold text-[#183D32] uppercase tracking-wider">
                    Next Step: Direct Confirmation
                  </p>
                  <p>
                    {submitResult.backendDelivered
                      ? 'Your request has been logged with our reservations desk. For faster response, you may also send the prefilled summary on WhatsApp.'
                      : 'Send your prefilled reservation packet directly to our WhatsApp reservations desk (+254 700 500 616) so our team can confirm room availability right away.'}
                  </p>
                </div>

                <div className="mt-7 flex flex-col sm:flex-row flex-wrap gap-3">
                  <a
                    href={submitResult.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#128C7E] text-[#FFFFFF] text-xs font-semibold tracking-[0.14em] uppercase rounded-sm hover:bg-[#0f7368] transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    <span>Send Request via WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 border border-[#183D32]/25 text-[#183D32] text-xs font-medium tracking-[0.14em] uppercase rounded-sm hover:bg-[#E6DCCB]/40 transition-colors cursor-pointer"
                  >
                    <Copy className="w-4 h-4" aria-hidden="true" />
                    <span>{copied ? 'Summary Copied' : 'Copy Summary'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSubmitResult(null)}
                    className="inline-flex items-center justify-center px-5 py-3.5 text-xs font-medium tracking-[0.12em] uppercase text-[#354A36] hover:text-[#183D32] underline underline-offset-4 cursor-pointer"
                  >
                    Edit Details
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="bg-[#FFFFFF] border border-[#252925]/10 rounded-sm p-6 sm:p-8 md:p-10 shadow-sm space-y-6"
              >
                <div className="pb-6 mb-2 border-b border-[#252925]/10">
                  <h2 className="font-display text-2xl text-[#183D32]">Guest &amp; Stay Details</h2>
                  <p className="text-xs text-[#252925]/70 mt-2.5 leading-relaxed">
                    All fields marked with * are required to prepare your reservation request.
                  </p>
                </div>

                {/* Guest Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="booking-fullname"
                      className="block text-xs font-medium tracking-[0.12em] uppercase text-[#354A36] mb-1.5"
                    >
                      Full Name *
                    </label>
                    <input
                      id="booking-fullname"
                      type="text"
                      value={form.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                      placeholder="e.g. Grace Wanjiku"
                      required
                      aria-invalid={Boolean(errors.fullName)}
                      className="w-full h-11 px-3.5 bg-[#F8F6F0] border border-[#252925]/15 rounded-sm text-sm text-[#252925] focus:border-[#183D32] focus:outline-none"
                    />
                    {errors.fullName && (
                      <p role="alert" className="text-xs text-red-700 mt-1.5">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="booking-email"
                      className="block text-xs font-medium tracking-[0.12em] uppercase text-[#354A36] mb-1.5"
                    >
                      Email Address *
                    </label>
                    <input
                      id="booking-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="guest@example.com"
                      required
                      aria-invalid={Boolean(errors.email)}
                      className="w-full h-11 px-3.5 bg-[#F8F6F0] border border-[#252925]/15 rounded-sm text-sm text-[#252925] focus:border-[#183D32] focus:outline-none"
                    />
                    {errors.email && (
                      <p role="alert" className="text-xs text-red-700 mt-1.5">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="booking-phone"
                      className="block text-xs font-medium tracking-[0.12em] uppercase text-[#354A36] mb-1.5"
                    >
                      Telephone Number *
                    </label>
                    <input
                      id="booking-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="+254 700 000 000"
                      required
                      aria-invalid={Boolean(errors.phone)}
                      className="w-full h-11 px-3.5 bg-[#F8F6F0] border border-[#252925]/15 rounded-sm text-sm text-[#252925] tabular-nums focus:border-[#183D32] focus:outline-none"
                    />
                    {errors.phone && (
                      <p role="alert" className="text-xs text-red-700 mt-1.5">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="booking-checkin"
                      className="block text-xs font-medium tracking-[0.12em] uppercase text-[#354A36] mb-1.5"
                    >
                      Check-in Date *
                    </label>
                    <input
                      id="booking-checkin"
                      type="date"
                      min={today}
                      value={form.checkIn}
                      onChange={(e) => updateField('checkIn', e.target.value)}
                      required
                      aria-invalid={Boolean(errors.checkIn)}
                      className="w-full h-11 px-3.5 bg-[#F8F6F0] border border-[#252925]/15 rounded-sm text-sm text-[#252925] tabular-nums focus:border-[#183D32] focus:outline-none"
                    />
                    {errors.checkIn && (
                      <p role="alert" className="text-xs text-red-700 mt-1.5">
                        {errors.checkIn}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="booking-checkout"
                      className="block text-xs font-medium tracking-[0.12em] uppercase text-[#354A36] mb-1.5"
                    >
                      Check-out Date *
                    </label>
                    <input
                      id="booking-checkout"
                      type="date"
                      min={form.checkIn ? addDaysIsoDate(form.checkIn, 1) : addDaysIsoDate(today, 1)}
                      value={form.checkOut}
                      onChange={(e) => updateField('checkOut', e.target.value)}
                      required
                      aria-invalid={Boolean(errors.checkOut)}
                      className="w-full h-11 px-3.5 bg-[#F8F6F0] border border-[#252925]/15 rounded-sm text-sm text-[#252925] tabular-nums focus:border-[#183D32] focus:outline-none"
                    />
                    {errors.checkOut && (
                      <p role="alert" className="text-xs text-red-700 mt-1.5">
                        {errors.checkOut}
                      </p>
                    )}
                  </div>
                </div>

                {/* Guests & Rooms */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label
                      htmlFor="booking-adults"
                      className="block text-xs font-medium tracking-[0.12em] uppercase text-[#354A36] mb-1.5"
                    >
                      Adults
                    </label>
                    <select
                      id="booking-adults"
                      value={form.adults}
                      onChange={(e) => updateField('adults', Number(e.target.value))}
                      className="w-full h-11 px-3.5 bg-[#F8F6F0] border border-[#252925]/15 rounded-sm text-sm text-[#252925] tabular-nums focus:border-[#183D32] focus:outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'Adult' : 'Adults'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="booking-children"
                      className="block text-xs font-medium tracking-[0.12em] uppercase text-[#354A36] mb-1.5"
                    >
                      Children
                    </label>
                    <select
                      id="booking-children"
                      value={form.children}
                      onChange={(e) => updateField('children', Number(e.target.value))}
                      className="w-full h-11 px-3.5 bg-[#F8F6F0] border border-[#252925]/15 rounded-sm text-sm text-[#252925] tabular-nums focus:border-[#183D32] focus:outline-none"
                    >
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'Child' : 'Children'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="booking-rooms"
                      className="block text-xs font-medium tracking-[0.12em] uppercase text-[#354A36] mb-1.5"
                    >
                      Rooms
                    </label>
                    <select
                      id="booking-rooms"
                      value={form.rooms}
                      onChange={(e) => updateField('rooms', Number(e.target.value))}
                      className="w-full h-11 px-3.5 bg-[#F8F6F0] border border-[#252925]/15 rounded-sm text-sm text-[#252925] tabular-nums focus:border-[#183D32] focus:outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'Room' : 'Rooms'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label
                    htmlFor="booking-requests"
                    className="block text-xs font-medium tracking-[0.12em] uppercase text-[#354A36] mb-1.5"
                  >
                    Special Requests (Optional)
                  </label>
                  <textarea
                    id="booking-requests"
                    rows={3}
                    value={form.specialRequests}
                    onChange={(e) => updateField('specialRequests', e.target.value)}
                    placeholder="Share any arrival timing notes, family preferences, or special arrangements..."
                    className="w-full p-3.5 bg-[#F8F6F0] border border-[#252925]/15 rounded-sm text-sm text-[#252925] focus:border-[#183D32] focus:outline-none"
                  />
                </div>

                {/* Terms & Privacy Checkbox */}
                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.acceptedTerms}
                      onChange={(e) => updateField('acceptedTerms', e.target.checked)}
                      className="mt-1 w-4 h-4 accent-[#183D32] cursor-pointer"
                    />
                    <span className="text-xs text-[#252925]/80 leading-relaxed">
                      I agree to the{' '}
                      <button
                        type="button"
                        onClick={() => onOpenLegal('terms')}
                        className="underline text-[#183D32] font-medium cursor-pointer"
                      >
                        booking terms
                      </button>{' '}
                      and{' '}
                      <button
                        type="button"
                        onClick={() => onOpenLegal('privacy')}
                        className="underline text-[#183D32] font-medium cursor-pointer"
                      >
                        privacy policy
                      </button>
                      . I understand this submits a reservation request subject to availability
                      confirmation by Small World Country Club.
                    </span>
                  </label>
                  {errors.acceptedTerms && (
                    <p role="alert" className="text-xs text-red-700 mt-1.5">
                      {errors.acceptedTerms}
                    </p>
                  )}
                </div>

                {submitError && (
                  <p role="alert" className="text-xs text-red-700 font-medium">
                    {submitError}
                  </p>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-9 py-4 bg-[#183D32] text-[#F8F6F0] text-xs font-semibold tracking-[0.16em] uppercase rounded-sm hover:bg-[#354A36] transition-colors cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? 'Preparing Request...' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Photograph, Live Summary & Booking Information */}
          <aside className="lg:col-span-5 space-y-6">
            <ResilientImage
              src={HOTEL_MEDIA.guestSuite}
              alt="Stone cottage and illuminated veranda at Small World Country Club"
              containerClassName="aspect-[4/3] rounded-sm shadow-sm"
            />

            {/* Live Booking Summary */}
            <div className="bg-[#FFFFFF] border border-[#252925]/10 rounded-sm p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between pb-5 mb-2 border-b border-[#252925]/10">
                <h2 className="font-display text-xl text-[#183D32]">Booking Summary</h2>
                <span className="text-xs font-medium tracking-wider uppercase text-[#C5A46D]">
                  Live Preview
                </span>
              </div>

              <dl className="mt-6 space-y-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-[#252925]/65">Guest Name</dt>
                  <dd className="font-medium text-[#183D32] text-right">
                    {form.fullName.trim() || 'Not entered yet'}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-[#252925]/65">Arrival Date</dt>
                  <dd className="font-medium text-[#252925] tabular-nums text-right">
                    {formatReadableDate(form.checkIn)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-[#252925]/65">Departure Date</dt>
                  <dd className="font-medium text-[#252925] tabular-nums text-right">
                    {formatReadableDate(form.checkOut)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-[#252925]/65">Number of Nights</dt>
                  <dd className="font-semibold text-[#183D32] tabular-nums text-right">
                    {nights > 0 ? `${nights} ${nights === 1 ? 'Night' : 'Nights'}` : 'Invalid dates'}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-[#252925]/65">Guests</dt>
                  <dd className="font-medium text-[#252925] tabular-nums text-right">
                    {form.adults} {form.adults === 1 ? 'Adult' : 'Adults'}
                    {form.children > 0
                      ? `, ${form.children} ${form.children === 1 ? 'Child' : 'Children'}`
                      : ''}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-[#252925]/65">Rooms Requested</dt>
                  <dd className="font-medium text-[#252925] tabular-nums text-right">
                    {form.rooms} {form.rooms === 1 ? 'Room' : 'Rooms'}
                  </dd>
                </div>
                <div className="pt-4 mt-4 border-t border-[#252925]/10">
                  <dt className="text-xs uppercase tracking-wider text-[#252925]/60 mb-1.5">
                    Special Requests
                  </dt>
                  <dd className="text-xs text-[#252925]/85 leading-relaxed">
                    {form.specialRequests.trim() || 'None specified'}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Booking Information */}
            <div className="bg-[#E6DCCB]/45 bg-texture-botanical-light border border-[#252925]/10 rounded-sm p-6 sm:p-7 space-y-5">
              <div className="flex items-center gap-2 pb-4 border-b border-[#252925]/10 text-xs font-semibold tracking-[0.16em] uppercase text-[#183D32]">
                <ShieldCheck className="w-4 h-4 text-[#C5A46D]" aria-hidden="true" />
                <span>Booking Information</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#354A36] shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-[#252925]/65">Check-in</p>
                    <p className="font-semibold text-[#183D32]">{SITE_CONFIG.hours.checkIn}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#354A36] shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-[#252925]/65">Check-out</p>
                    <p className="font-semibold text-[#183D32]">{SITE_CONFIG.hours.checkOut}</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#252925]/75 leading-relaxed">
                For special arrangements, group stays, or availability inquiries, please contact
                Small World Country Club directly:
              </p>
              <a
                href={SITE_CONFIG.contact.phoneHref}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#183D32] hover:text-[#354A36] tabular-nums"
              >
                <Phone className="w-4 h-4 text-[#C5A46D]" aria-hidden="true" />
                <span>{SITE_CONFIG.contact.phoneDisplay}</span>
              </a>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};
