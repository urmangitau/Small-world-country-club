import React, { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  Calendar,
  Car,
  Compass,
  ExternalLink,
  Shirt,
  Star,
  Users,
  Waves,
  Wifi,
  Wind,
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  GALLERY_ITEMS,
  HOTEL_MEDIA,
  PageRoute,
  SITE_CONFIG,
} from '../config/siteConfig';
import { addDaysIsoDate, getTodayIsoDate } from '../services/bookingService';
import { LocationMap } from '../components/LocationMap';
import { ResilientImage } from '../components/ResilientImage';

export interface QuickBookingPrefill {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
}

interface HomePageProps {
  onNavigate: (route: PageRoute) => void;
  onQuickBook: (prefill: QuickBookingPrefill) => void;
  onOpenLightbox: (index: number) => void;
  quotaExceeded: boolean;
}

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  pool: <Waves className="w-5 h-5" aria-hidden="true" />,
  wifi: <Wifi className="w-5 h-5" aria-hidden="true" />,
  parking: <Car className="w-5 h-5" aria-hidden="true" />,
  ac: <Wind className="w-5 h-5" aria-hidden="true" />,
  laundry: <Shirt className="w-5 h-5" aria-hidden="true" />,
  family: <Users className="w-5 h-5" aria-hidden="true" />,
};

const EXPERIENCE_CARDS = [
  {
    title: 'Relax and Unwind',
    subtitle: 'Outdoor Swimming Pool & Tranquil Grounds',
    description:
      'Spend unhurried afternoons beside our outdoor swimming pool, surrounded by dappled acacia shade and calm countryside air.',
    image: HOTEL_MEDIA.poolTwilight,
    alt: 'Evening swimming pool framed by the arched pavilion and thatched poolside gazebo at Small World Country Club',
  },
  {
    title: 'Comfortable Stays',
    subtitle: 'Restful Air-Conditioned Spaces',
    description:
      'Enjoy quiet, welcoming accommodation designed for peaceful rest after travel along Mombasa Road or a weekend away from the city.',
    image: HOTEL_MEDIA.guestSuite,
    alt: 'Stone guest villa with warm veranda lighting and landscaped gardens at Small World Country Club',
  },
  {
    title: 'Nature and Serenity',
    subtitle: 'Athi River Landscape & Gardens',
    description:
      'Breathe in open countryside views and stroll along tree-lined avenues framed by greenery away from urban noise.',
    image: HOTEL_MEDIA.acaciaGardens,
    alt: 'Tree-lined entrance promenade and manicured green grounds at Small World Country Club',
  },
  {
    title: 'Family Moments',
    subtitle: 'Welcoming Hospitality for Every Generation',
    description:
      'Gather with loved ones in a family-friendly setting built for shared meals, celebrations, and memorable weekend retreats.',
    image: HOTEL_MEDIA.familyLawn,
    alt: 'Aerial view of Small World Country Club cottages, green lawns, and swimming pool',
  },
];

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onQuickBook,
  onOpenLightbox,
  quotaExceeded,
}) => {
  const today = useMemo(() => getTodayIsoDate(), []);
  const defaultCheckIn = useMemo(() => addDaysIsoDate(today, 1), [today]);
  const defaultCheckOut = useMemo(() => addDaysIsoDate(today, 3), [today]);

  const [checkIn, setCheckIn] = useState(defaultCheckIn);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [quickError, setQuickError] = useState('');
  const [galleryFilter, setGalleryFilter] = useState<string>('All');

  const galleryCategories = useMemo(
    () => ['All', ...Array.from(new Set(GALLERY_ITEMS.map((item) => item.category)))],
    []
  );

  const filteredGallery = useMemo(() => {
    if (galleryFilter === 'All') return GALLERY_ITEMS;
    return GALLERY_ITEMS.filter((item) => item.category === galleryFilter);
  }, [galleryFilter]);

  const handleCheckInChange = (val: string) => {
    setCheckIn(val);
    setQuickError('');
    if (val && checkOut <= val) {
      setCheckOut(addDaysIsoDate(val, 1));
    }
  };

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      setQuickError('Please select both check-in and check-out dates.');
      return;
    }
    if (checkIn < today) {
      setQuickError('Check-in date cannot be in the past.');
      return;
    }
    if (checkOut <= checkIn) {
      setQuickError('Check-out date must be after check-in date.');
      return;
    }
    onQuickBook({ checkIn, checkOut, adults, children, rooms });
  };

  return (
    <div>
      {/* A. Cinematic Full-Screen Hero */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden bg-[#183D32]">
        <img
          src={HOTEL_MEDIA.heroExterior}
          alt="Small World Country Club main clubhouse exterior overlooking the sunlit swimming pool and loungers"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#183D32]/90 via-[#183D32]/50 to-[#183D32]/55"
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center pt-24 pb-28">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-xs sm:text-sm tracking-[0.28em] uppercase text-[#E6DCCB] font-medium">
              SMALL WORLD COUNTRY CLUB
            </p>
            <p className="text-xs tracking-[0.18em] text-[#C5A46D] mt-3">
              Mombasa Road · Athi River, Kenya
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#FFFFFF] leading-[1.14] tracking-tight mt-6">
              Escape the Ordinary. Embrace the Extraordinary.
            </h1>
            <div aria-hidden="true" className="w-16 h-[1.5px] bg-[#C5A46D]/80 mx-auto my-7" />
            <p className="text-base sm:text-lg text-[#F8F6F0]/90 max-w-2xl mx-auto leading-relaxed font-light">
              Discover a peaceful retreat where nature, relaxation and exceptional hospitality come
              together. Your next memorable getaway begins here.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate('/about')}
                className="w-full sm:w-auto px-7 py-3.5 border border-[#F8F6F0]/60 text-[#FFFFFF] text-xs font-medium tracking-[0.16em] uppercase rounded-sm hover:bg-[#FFFFFF]/10 transition-colors cursor-pointer whitespace-nowrap"
              >
                Explore Our Hotel
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/booking')}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#C5A46D] text-[#183D32] text-xs font-semibold tracking-[0.16em] uppercase rounded-sm hover:bg-[#E6DCCB] transition-colors cursor-pointer whitespace-nowrap"
              >
                Book Your Stay
              </button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <a
          href="#quick-booking"
          aria-label="Scroll to quick booking widget"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-[#E6DCCB]/85 hover:text-[#FFFFFF] transition-colors"
        >
          <span className="text-[10px] tracking-[0.25em] uppercase">Scroll</span>
          <ArrowDown className="w-4 h-4 animate-bounce" aria-hidden="true" />
        </a>
      </section>

      {/* B. Quick Booking Bar */}
      <section
        id="quick-booking"
        aria-label="Quick Reservation Availability Check"
        className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 -mt-12"
      >
        <form
          onSubmit={handleQuickSubmit}
          className="bg-[#FFFFFF] border border-[#252925]/10 shadow-lg rounded-sm p-6 md:p-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 mb-6 border-b border-[#252925]/10">
            <div className="flex items-center gap-2 text-xs font-medium tracking-[0.16em] uppercase text-[#183D32]">
              <Calendar className="w-4 h-4 text-[#C5A46D]" aria-hidden="true" />
              <span>Plan Your Getaway</span>
            </div>
            <p className="text-xs text-[#252925]/65">
              Check-in {SITE_CONFIG.hours.checkIn} · Check-out {SITE_CONFIG.hours.checkOut} · Availability confirmed by our team
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
            <div>
              <label
                htmlFor="quick-checkin"
                className="block text-[11px] font-medium tracking-[0.14em] uppercase text-[#354A36] mb-1.5"
              >
                Check-in
              </label>
              <input
                id="quick-checkin"
                type="date"
                min={today}
                value={checkIn}
                onChange={(e) => handleCheckInChange(e.target.value)}
                required
                className="w-full h-11 px-3 bg-[#F8F6F0] border border-[#252925]/15 rounded-sm text-sm text-[#252925] tabular-nums focus:border-[#183D32] focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="quick-checkout"
                className="block text-[11px] font-medium tracking-[0.14em] uppercase text-[#354A36] mb-1.5"
              >
                Check-out
              </label>
              <input
                id="quick-checkout"
                type="date"
                min={checkIn ? addDaysIsoDate(checkIn, 1) : addDaysIsoDate(today, 1)}
                value={checkOut}
                onChange={(e) => {
                  setCheckOut(e.target.value);
                  setQuickError('');
                }}
                required
                className="w-full h-11 px-3 bg-[#F8F6F0] border border-[#252925]/15 rounded-sm text-sm text-[#252925] tabular-nums focus:border-[#183D32] focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="quick-adults"
                className="block text-[11px] font-medium tracking-[0.14em] uppercase text-[#354A36] mb-1.5"
              >
                Adults
              </label>
              <select
                id="quick-adults"
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                className="w-full h-11 px-3 bg-[#F8F6F0] border border-[#252925]/15 rounded-sm text-sm text-[#252925] tabular-nums focus:border-[#183D32] focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'Adult' : 'Adults'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="quick-children"
                className="block text-[11px] font-medium tracking-[0.14em] uppercase text-[#354A36] mb-1.5"
              >
                Children
              </label>
              <select
                id="quick-children"
                value={children}
                onChange={(e) => setChildren(Number(e.target.value))}
                className="w-full h-11 px-3 bg-[#F8F6F0] border border-[#252925]/15 rounded-sm text-sm text-[#252925] tabular-nums focus:border-[#183D32] focus:outline-none"
              >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'Child' : 'Children'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="quick-rooms"
                className="block text-[11px] font-medium tracking-[0.14em] uppercase text-[#354A36] mb-1.5"
              >
                Rooms
              </label>
              <select
                id="quick-rooms"
                value={rooms}
                onChange={(e) => setRooms(Number(e.target.value))}
                className="w-full h-11 px-3 bg-[#F8F6F0] border border-[#252925]/15 rounded-sm text-sm text-[#252925] tabular-nums focus:border-[#183D32] focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'Room' : 'Rooms'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <button
                type="submit"
                className="w-full h-11 px-4 bg-[#183D32] text-[#F8F6F0] text-xs font-medium tracking-[0.14em] uppercase rounded-sm hover:bg-[#354A36] transition-colors cursor-pointer whitespace-nowrap"
              >
                Check Availability
              </button>
            </div>
          </div>

          {quickError && (
            <p role="alert" className="mt-3 text-xs text-red-700 font-medium">
              {quickError}
            </p>
          )}
        </form>
      </section>

      {/* C. Welcome Section (Asymmetric Layout) */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Asymmetric Overlapping Photography */}
          <div className="lg:col-span-6 relative pb-12 sm:pb-16 pr-6 sm:pr-12">
            <ResilientImage
              src={HOTEL_MEDIA.outdoorPool}
              alt="Outdoor swimming pool and open veranda illuminated under twilight skies at Small World Country Club"
              containerClassName="aspect-[4/3] rounded-sm shadow-md"
            />
            <div className="w-44 sm:w-56 md:w-64 aspect-[4/3] absolute bottom-0 right-0 rounded-sm overflow-hidden shadow-xl border-4 border-[#F8F6F0]">
              <ResilientImage
                src={HOTEL_MEDIA.courtyardEvening}
                alt="Thatched welcome pavilion glowing at dusk with landscaped agave entrance garden"
                containerClassName="w-full h-full"
              />
            </div>
          </div>

          {/* Right: Editorial Narrative */}
          <div className="lg:col-span-6">
            <p className="text-xs font-medium tracking-[0.22em] uppercase text-[#C5A46D]">
              Athi River · Mombasa Road
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] text-[#183D32] leading-[1.18] mt-4">
              Welcome to Your Little Escape
            </h2>
            <div aria-hidden="true" className="w-14 h-[1.5px] bg-[#C5A46D] my-6" />
            <p className="font-serif-editorial italic text-xl text-[#354A36] leading-relaxed">
              “{SITE_CONFIG.positioning}”
            </p>
            <div className="mt-6 space-y-5 text-sm sm:text-base text-[#252925]/80 leading-relaxed">
              <p>
                Positioned along Mombasa Road in Athi River, Small World Country Club offers a
                welcoming 3-star sanctuary for guests seeking respite from the pace of Nairobi.
                Here, open greenery, fresh countryside air, and genuine Kenyan hospitality set the
                rhythm of your stay.
              </p>
              <p>
                Whether you are arriving for a restorative weekend getaway, a family gathering, or a
                peaceful stopover near the capital, every detail is shaped around comfort and
                unhurried relaxation.
              </p>
            </div>
            <div className="mt-9 flex flex-wrap items-center gap-6">
              <button
                type="button"
                onClick={() => onNavigate('/about')}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#183D32] text-[#F8F6F0] text-xs font-medium tracking-[0.16em] uppercase rounded-sm hover:bg-[#354A36] transition-colors cursor-pointer"
              >
                <span>Discover Our Story</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <span className="text-xs text-[#252925]/65">
                {SITE_CONFIG.starCategory} · {SITE_CONFIG.ratings.google.score} Google Rating
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* D. Experience Section */}
      <section className="py-20 md:py-24 bg-[#E6DCCB]/35 bg-texture-botanical-light border-y border-[#252925]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-[0.22em] uppercase text-[#354A36]">
              The Country Club Experience
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-[#183D32] leading-tight mt-4">
              An Experience Worth Remembering
            </h2>
            <div aria-hidden="true" className="w-14 h-[1.5px] bg-[#C5A46D] mt-6" />
          </div>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {EXPERIENCE_CARDS.map((card, idx) => (
              <article
                key={card.title}
                className="group bg-[#FFFFFF] border border-[#252925]/10 rounded-sm overflow-hidden flex flex-col"
              >
                <div className="overflow-hidden">
                  <ResilientImage
                    src={card.image}
                    alt={card.alt}
                    containerClassName="aspect-[4/3]"
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-7 flex-1 flex flex-col">
                  <p className="text-[11px] font-medium tracking-[0.16em] uppercase text-[#C5A46D] tabular-nums">
                    0{idx + 1}. {card.subtitle}
                  </p>
                  <h3 className="font-display text-xl text-[#183D32] mt-3 pb-3.5 border-b border-[#252925]/10">
                    {card.title}
                  </h3>
                  <p className="text-sm text-[#252925]/75 mt-4 leading-relaxed flex-1">
                    {card.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* E. Facilities Section */}
      <section className="py-20 md:py-24 bg-texture-stone">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-[#252925]/10">
            <div className="max-w-xl">
              <p className="text-xs font-medium tracking-[0.22em] uppercase text-[#C5A46D]">
                Verified Amenities
              </p>
              <h2 className="font-display text-3xl sm:text-4xl text-[#183D32] leading-tight mt-4">
                Everything You Need for a Comfortable Stay
              </h2>
            </div>
            <p className="text-sm text-[#252925]/70 max-w-md leading-relaxed">
              Thoughtful essentials designed for effortless rest, family convenience, and a calm stay
              in Athi River.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {SITE_CONFIG.amenities.map((amenity) => (
              <div
                key={amenity.id}
                className="p-7 bg-[#FFFFFF] border border-[#252925]/10 rounded-sm flex items-start gap-5"
              >
                <div className="w-11 h-11 rounded-sm bg-[#183D32] text-[#C5A46D] flex items-center justify-center shrink-0 mt-0.5">
                  {AMENITY_ICONS[amenity.id]}
                </div>
                <div>
                  <h3 className="font-display text-lg text-[#183D32] leading-snug">
                    {amenity.title}
                  </h3>
                  <p className="text-sm text-[#252925]/75 mt-3 leading-relaxed">
                    {amenity.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* F. Photo Gallery */}
      <section className="py-20 md:py-24 bg-[#183D32] bg-texture-botanical-dark text-[#F8F6F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-[#F8F6F0]/15">
            <div>
              <p className="text-xs font-medium tracking-[0.22em] uppercase text-[#C5A46D]">
                Visual Showcase
              </p>
              <h2 className="font-display text-3xl sm:text-4xl text-[#FFFFFF] mt-4">
                A Glimpse of Small World
              </h2>
            </div>

            {/* Interactive Category Filter Tabs */}
            <div
              role="tablist"
              aria-label="Filter photo gallery"
              className="flex flex-wrap items-center gap-2"
            >
              {galleryCategories.map((cat) => {
                const active = galleryFilter === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setGalleryFilter(cat)}
                    className={`px-3.5 py-2 text-xs tracking-wider uppercase rounded-sm transition-colors cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-[#C5A46D] text-[#183D32] font-semibold'
                        : 'bg-[#FFFFFF]/10 text-[#F8F6F0]/85 hover:bg-[#FFFFFF]/20'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Masonry-style mixed aspect grid */}
          <div className="mt-12 columns-1 sm:columns-2 lg:columns-3 gap-7 space-y-7">
            {filteredGallery.map((item) => {
              const globalIndex = GALLERY_ITEMS.findIndex((g) => g.id === item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onOpenLightbox(globalIndex)}
                  className="group relative block w-full text-left break-inside-avoid overflow-hidden rounded-sm bg-[#252925] cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C5A46D]"
                >
                  <ResilientImage
                    src={item.src}
                    alt={item.alt}
                    containerClassName={
                      item.aspect === 'portrait' ? 'aspect-[3/4]' : 'aspect-[4/3]'
                    }
                    className={`transition-transform duration-500 group-hover:scale-105 ${
                      item.objectPosition || ''
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-[11px] tracking-[0.16em] uppercase text-[#C5A46D]">
                      {item.category}
                    </p>
                    <p className="font-display text-lg text-[#FFFFFF] mt-2">{item.title}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* G. Reviews & Testimonials (Verified Ratings Only) */}
      <section className="py-20 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <p className="text-xs font-medium tracking-[0.22em] uppercase text-[#C5A46D]">
              Verified Guest Ratings
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-[#183D32] leading-tight mt-4">
              Experiences That Speak for Themselves
            </h2>
            <div aria-hidden="true" className="w-14 h-[1.5px] bg-[#C5A46D] my-6" />
            <p className="text-sm sm:text-base text-[#252925]/75 leading-relaxed">
              Over a thousand visitors have shared their impressions of Small World Country Club
              across major travel platforms. Explore genuine guest feedback directly on Google Maps
              or Tripadvisor.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href={SITE_CONFIG.location.googleMapsListingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#183D32] text-[#F8F6F0] text-xs font-medium tracking-[0.16em] uppercase rounded-sm hover:bg-[#354A36] transition-colors"
              >
                <span>Read Our Reviews</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
              <a
                href={SITE_CONFIG.location.tripadvisorSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3.5 border border-[#183D32]/30 text-[#183D32] text-xs font-medium tracking-[0.14em] uppercase rounded-sm hover:bg-[#E6DCCB]/40 transition-colors"
              >
                <span>Tripadvisor Listing</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Google Rating Card */}
            <div className="bg-[#FFFFFF] border border-[#252925]/10 rounded-sm p-8 sm:p-9 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#354A36]">
                    Google Reviews
                  </span>
                  <div className="flex items-center gap-1 text-[#C5A46D]" aria-hidden="true">
                    {[1, 2, 3, 4].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-current" />
                    ))}
                    <Star className="w-4 h-4" />
                  </div>
                </div>
                <p className="font-display text-4xl text-[#183D32] mt-6 tabular-nums">
                  {SITE_CONFIG.ratings.google.score}
                </p>
                <p className="text-sm text-[#252925]/70 mt-2 tabular-nums">
                  {SITE_CONFIG.ratings.google.countLabel}
                </p>
              </div>
              <p className="text-xs text-[#252925]/65 mt-7 pt-5 border-t border-[#252925]/10 leading-relaxed">
                Verified aggregate guest score on Google Maps for Small World Country Club, Athi
                River.
              </p>
            </div>

            {/* Tripadvisor Rating Card */}
            <div className="bg-[#FFFFFF] border border-[#252925]/10 rounded-sm p-8 sm:p-9 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#354A36]">
                    Tripadvisor
                  </span>
                  <div className="flex items-center gap-1 text-[#C5A46D]" aria-hidden="true">
                    {[1, 2, 3, 4].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-current" />
                    ))}
                    <Star className="w-4 h-4" />
                  </div>
                </div>
                <p className="font-display text-4xl text-[#183D32] mt-6 tabular-nums">
                  {SITE_CONFIG.ratings.tripadvisor.score}
                </p>
                <p className="text-sm text-[#252925]/70 mt-2 tabular-nums">
                  {SITE_CONFIG.ratings.tripadvisor.countLabel}
                </p>
              </div>
              <p className="text-xs text-[#252925]/65 mt-7 pt-5 border-t border-[#252925]/10 leading-relaxed">
                Verified traveler rating on Tripadvisor. View full authentic guest reviews directly
                on the platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* H. Location Section */}
      <section className="py-20 md:py-24 bg-[#E6DCCB]/30 bg-texture-botanical-light border-t border-[#252925]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 pb-8 border-b border-[#252925]/10">
            <div>
              <p className="text-xs font-medium tracking-[0.22em] uppercase text-[#354A36]">
                Find Us Along Mombasa Road
              </p>
              <h2 className="font-display text-3xl sm:text-4xl text-[#183D32] leading-tight mt-4">
                Conveniently Located. Perfectly Positioned.
              </h2>
              <p className="text-sm sm:text-base text-[#252925]/80 mt-4 leading-relaxed">
                {SITE_CONFIG.location.addressLine} · Google Maps Plus Code:{' '}
                <strong className="font-semibold text-[#183D32]">
                  {SITE_CONFIG.location.plusCode}
                </strong>
              </p>
            </div>
            <a
              href={SITE_CONFIG.location.googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#183D32] text-[#F8F6F0] text-xs font-medium tracking-[0.16em] uppercase rounded-sm hover:bg-[#354A36] transition-colors shrink-0 self-start md:self-auto"
            >
              <Compass className="w-4 h-4" aria-hidden="true" />
              <span>Get Directions</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>

          <LocationMap quotaExceeded={quotaExceeded} />
        </div>
      </section>

      {/* I. Final Homepage Call to Action */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-[#183D32]">
        <img
          src={HOTEL_MEDIA.courtyardEvening}
          alt="Thatched welcome pavilion glowing at dusk at Small World Country Club"
          loading="lazy"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#183D32]/90 via-[#183D32]/70 to-[#183D32]/75"
        />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs tracking-[0.24em] uppercase text-[#C5A46D] font-medium">
            Small World Country Club
          </p>
          <h2 className="font-display text-3xl sm:text-5xl text-[#FFFFFF] leading-tight mt-4">
            Your Escape Is Waiting.
          </h2>
          <div aria-hidden="true" className="w-16 h-[1.5px] bg-[#C5A46D] mx-auto my-6" />
          <p className="text-base sm:text-lg text-[#F8F6F0]/90 leading-relaxed">
            Make time for relaxation, unforgettable moments and exceptional hospitality.
          </p>
          <div className="mt-9">
            <button
              type="button"
              onClick={() => onNavigate('/booking')}
              className="px-9 py-4 bg-[#C5A46D] text-[#183D32] text-xs font-semibold tracking-[0.18em] uppercase rounded-sm hover:bg-[#E6DCCB] transition-colors cursor-pointer"
            >
              Reserve Your Stay
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
