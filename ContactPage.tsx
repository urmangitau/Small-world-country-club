import React, { useState } from 'react';
import {
  ChevronDown,
  Clock,
  Compass,
  Copy,
  ExternalLink,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react';
import { FAQS, HOTEL_MEDIA, SITE_CONFIG } from '../config/siteConfig';
import {
  ContactDraft,
  buildGeneralWhatsAppUrl,
  submitContactEnquiry,
} from '../services/bookingService';
import { LocationMap } from '../components/LocationMap';
import { ResilientImage } from '../components/ResilientImage';

interface ContactPageProps {
  quotaExceeded: boolean;
}

interface ContactErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

export const ContactPage: React.FC<ContactPageProps> = ({ quotaExceeded }) => {
  const [form, setForm] = useState<ContactDraft>({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preparedResult, setPreparedResult] = useState<{
    backendDelivered: boolean;
    whatsappUrl: string;
  } | null>(null);
  const [submitError, setSubmitError] = useState('');
  const [copied, setCopied] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const updateField = <K extends keyof ContactDraft>(key: K, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setSubmitError('');
  };

  const validate = (): ContactErrors => {
    const next: ContactErrors = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      next.fullName = 'Please enter your full name.';
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim() || !emailPattern.test(form.email.trim())) {
      next.email = 'Please enter a valid email address.';
    }
    const phoneDigits = form.phone.replace(/[^\d+]/g, '');
    if (!phoneDigits || phoneDigits.length < 7) {
      next.phone = 'Please enter a valid phone number.';
    }
    if (!form.subject.trim()) {
      next.subject = 'Please enter a subject for your message.';
    }
    if (!form.message.trim() || form.message.trim().length < 8) {
      next.message = 'Please enter your message (at least 8 characters).';
    }
    return next;
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
      const result = await submitContactEnquiry(form);
      setPreparedResult(result);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Unable to reach email service. Please send your message via WhatsApp.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyMessage = async () => {
    const text = [
      `Subject: ${form.subject}`,
      `From: ${form.fullName} (${form.email} / ${form.phone})`,
      '',
      form.message,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Ignore if clipboard API restricted
    }
  };

  return (
    <div className="pt-20 pb-24">
      {/* Header Banner */}
      <section className="bg-[#183D32] bg-texture-botanical-dark text-[#F8F6F0] py-16 md:py-22">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <p className="text-xs font-medium tracking-[0.24em] uppercase text-[#C5A46D]">
            Get In Touch
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-[#FFFFFF] leading-tight mt-4">
            We’d Love to Hear From You
          </h1>
          <div aria-hidden="true" className="w-14 h-[1.5px] bg-[#C5A46D] my-5" />
          <p className="font-serif-editorial italic text-xl text-[#E6DCCB] max-w-2xl">
            Whether you’re planning a relaxing getaway or have a question about your stay, we’re
            here to help.
          </p>
        </div>
      </section>

      {/* Contact Information Cards & WhatsApp CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-[#FFFFFF] border border-[#252925]/10 rounded-sm p-7">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-[#C5A46D]">
              <Phone className="w-4 h-4" aria-hidden="true" />
              <span>Phone</span>
            </div>
            <a
              href={SITE_CONFIG.contact.phoneHref}
              className="block font-display text-xl text-[#183D32] mt-4 hover:text-[#354A36] tabular-nums"
            >
              {SITE_CONFIG.contact.phoneDisplay}
            </a>
            <p className="text-xs text-[#252925]/65 mt-2">Direct reservations &amp; enquiries</p>
          </div>

          <div className="bg-[#FFFFFF] border border-[#252925]/10 rounded-sm p-7">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-[#C5A46D]">
              <MapPin className="w-4 h-4" aria-hidden="true" />
              <span>Location</span>
            </div>
            <p className="font-display text-lg text-[#183D32] mt-4 leading-snug">
              {SITE_CONFIG.location.addressLine}
            </p>
            <p className="text-xs text-[#252925]/65 mt-2">Nairobi / Athi River corridor</p>
          </div>

          <div className="bg-[#FFFFFF] border border-[#252925]/10 rounded-sm p-7">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-[#C5A46D]">
              <Compass className="w-4 h-4" aria-hidden="true" />
              <span>Google Maps</span>
            </div>
            <p className="font-display text-lg text-[#183D32] mt-4">
              {SITE_CONFIG.location.plusCode}
            </p>
            <a
              href={SITE_CONFIG.location.googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#354A36] underline mt-2"
            >
              <span>Open Directions</span>
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
          </div>

          <div className="bg-[#FFFFFF] border border-[#252925]/10 rounded-sm p-7">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-[#C5A46D]">
              <Clock className="w-4 h-4" aria-hidden="true" />
              <span>Check-in &amp; Check-out</span>
            </div>
            <p className="font-display text-lg text-[#183D32] mt-4">
              {SITE_CONFIG.hours.checkIn} / {SITE_CONFIG.hours.checkOut}
            </p>
            <p className="text-xs text-[#252925]/65 mt-2">Check-in 2:00 PM · Check-out 10:00 AM</p>
          </div>
        </div>

        {/* Contact Form + WhatsApp & Property Image */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-7">
            {preparedResult ? (
              <div
                role="status"
                className="bg-[#FFFFFF] border border-[#183D32]/20 rounded-sm p-8 md:p-10 shadow-sm"
              >
                <h2 className="font-display text-2xl sm:text-3xl text-[#183D32]">
                  {preparedResult.backendDelivered
                    ? 'Message Sent'
                    : 'Ready to Send via WhatsApp'}
                </h2>
                <p className="text-sm sm:text-base text-[#252925]/80 mt-3 leading-relaxed">
                  {preparedResult.backendDelivered
                    ? 'Thank you for contacting Small World Country Club. Your enquiry has been delivered to our team.'
                    : 'Automated webmail delivery is not yet connected to a backend email server. To ensure our team receives your enquiry immediately without delay, please send your prefilled message directly on WhatsApp.'}
                </p>

                <div className="mt-7 flex flex-col sm:flex-row flex-wrap gap-3">
                  <a
                    href={preparedResult.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#128C7E] text-[#FFFFFF] text-xs font-semibold tracking-[0.14em] uppercase rounded-sm hover:bg-[#0f7368] transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    <span>Send Message via WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 border border-[#183D32]/25 text-[#183D32] text-xs font-medium tracking-[0.14em] uppercase rounded-sm hover:bg-[#E6DCCB]/40 transition-colors cursor-pointer"
                  >
                    <Copy className="w-4 h-4" aria-hidden="true" />
                    <span>{copied ? 'Copied' : 'Copy Message'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreparedResult(null)}
                    className="px-4 py-3.5 text-xs font-medium uppercase tracking-wider text-[#354A36] underline underline-offset-4 cursor-pointer"
                  >
                    Edit Message
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="bg-[#FFFFFF] border border-[#252925]/10 rounded-sm p-6 sm:p-8 md:p-10 shadow-sm space-y-5"
              >
                <div className="pb-6 mb-2 border-b border-[#252925]/10">
                  <h2 className="font-display text-2xl text-[#183D32]">Send Us an Enquiry</h2>
                  <p className="text-xs text-[#252925]/65 mt-2.5 leading-relaxed">
                    Complete the form below to prepare your message for our hospitality team.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="contact-fullname"
                      className="block text-xs font-medium tracking-[0.12em] uppercase text-[#354A36] mb-1.5"
                    >
                      Full Name *
                    </label>
                    <input
                      id="contact-fullname"
                      type="text"
                      value={form.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                      placeholder="Your full name"
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
                      htmlFor="contact-email"
                      className="block text-xs font-medium tracking-[0.12em] uppercase text-[#354A36] mb-1.5"
                    >
                      Email *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="you@example.com"
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
                      htmlFor="contact-phone"
                      className="block text-xs font-medium tracking-[0.12em] uppercase text-[#354A36] mb-1.5"
                    >
                      Phone Number *
                    </label>
                    <input
                      id="contact-phone"
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

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-xs font-medium tracking-[0.12em] uppercase text-[#354A36] mb-1.5"
                  >
                    Subject *
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={form.subject}
                    onChange={(e) => updateField('subject', e.target.value)}
                    placeholder="e.g. Weekend stay availability enquiry"
                    required
                    aria-invalid={Boolean(errors.subject)}
                    className="w-full h-11 px-3.5 bg-[#F8F6F0] border border-[#252925]/15 rounded-sm text-sm text-[#252925] focus:border-[#183D32] focus:outline-none"
                  />
                  {errors.subject && (
                    <p role="alert" className="text-xs text-red-700 mt-1.5">
                      {errors.subject}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-medium tracking-[0.12em] uppercase text-[#354A36] mb-1.5"
                  >
                    Message *
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={form.message}
                    onChange={(e) => updateField('message', e.target.value)}
                    placeholder="How can our team assist you?"
                    required
                    aria-invalid={Boolean(errors.message)}
                    className="w-full p-3.5 bg-[#F8F6F0] border border-[#252925]/15 rounded-sm text-sm text-[#252925] focus:border-[#183D32] focus:outline-none"
                  />
                  {errors.message && (
                    <p role="alert" className="text-xs text-red-700 mt-1.5">
                      {errors.message}
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
                    className="w-full sm:w-auto px-8 py-4 bg-[#183D32] text-[#F8F6F0] text-xs font-semibold tracking-[0.16em] uppercase rounded-sm hover:bg-[#354A36] transition-colors cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? 'Preparing Message...' : 'Send Message'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Prominent WhatsApp Button + Smaller Garden Image */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#FFFFFF] border border-[#252925]/10 rounded-sm p-7 sm:p-8 shadow-sm">
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#354A36]">
                Instant Hospitality Support
              </p>
              <h2 className="font-display text-2xl text-[#183D32] mt-3 pb-4 border-b border-[#252925]/10">
                Speak Directly With Our Team
              </h2>
              <p className="text-sm text-[#252925]/75 mt-4 leading-relaxed">
                Prefer a direct conversation? Message Small World Country Club on WhatsApp for fast
                answers on directions, availability, and check-in arrangements.
              </p>
              <a
                href={buildGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-[#25D366] text-[#183D32] text-xs font-bold tracking-[0.15em] uppercase rounded-sm hover:bg-[#20bd5a] transition-colors shadow-xs"
              >
                <MessageCircle className="w-5 h-5 fill-current" aria-hidden="true" />
                <span>Chat With Our Team</span>
              </a>
            </div>

            <ResilientImage
              src={HOTEL_MEDIA.acaciaGardens}
              alt="Tree-lined grounds and entrance promenade at Small World Country Club"
              containerClassName="aspect-[4/3] rounded-sm shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* Interactive Google Map */}
      <section className="bg-[#E6DCCB]/25 bg-texture-botanical-light border-y border-[#252925]/10 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-[#252925]/10">
            <div>
              <p className="text-xs font-medium tracking-[0.22em] uppercase text-[#C5A46D]">
                Directions &amp; Map
              </p>
              <h2 className="font-display text-3xl text-[#183D32] mt-3">
                {SITE_CONFIG.location.addressLine}
              </h2>
              <p className="text-sm text-[#252925]/75 mt-2.5">
                Google Maps Plus Code: <strong>{SITE_CONFIG.location.plusCode}</strong>
              </p>
            </div>
            <a
              href={SITE_CONFIG.location.googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#183D32] text-[#F8F6F0] text-xs font-medium tracking-[0.16em] uppercase rounded-sm hover:bg-[#354A36] transition-colors self-start md:self-auto"
            >
              <Compass className="w-4 h-4" aria-hidden="true" />
              <span>Get Directions</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>

          <LocationMap quotaExceeded={quotaExceeded} />
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 mt-20">
        <div className="text-center mb-12">
          <p className="text-xs font-medium tracking-[0.22em] uppercase text-[#C5A46D]">
            Helpful Details
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-[#183D32] mt-3">
            Frequently Asked Questions
          </h2>
          <div aria-hidden="true" className="w-14 h-[1.5px] bg-[#C5A46D] mx-auto mt-5" />
        </div>

        <div className="divide-y divide-[#252925]/10 border-y border-[#252925]/10 bg-[#FFFFFF] rounded-sm">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={faq.question}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full px-7 py-6 flex items-center justify-between gap-4 text-left hover:bg-[#F8F6F0]/60 transition-colors cursor-pointer"
                >
                  <span className="font-display text-lg text-[#183D32]">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#C5A46D] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div className="px-7 pb-6 pt-1 text-sm text-[#252925]/80 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
