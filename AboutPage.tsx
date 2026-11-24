import React from 'react';
import { ArrowRight, Check, Compass } from 'lucide-react';
import { GALLERY_ITEMS, HOTEL_MEDIA, PageRoute, SITE_CONFIG } from '../config/siteConfig';
import { ResilientImage } from '../components/ResilientImage';

interface AboutPageProps {
  onNavigate: (route: PageRoute) => void;
  onOpenLightbox: (index: number) => void;
}

const PHILOSOPHY_PILLARS = [
  {
    number: '01',
    title: 'Hospitality',
    description: 'We believe every guest deserves a warm welcome and a comfortable experience.',
  },
  {
    number: '02',
    title: 'Relaxation',
    description: 'Create space to slow down, unwind and enjoy a peaceful environment.',
  },
  {
    number: '03',
    title: 'Memorable Experiences',
    description: 'Every visit is an opportunity to make memories that last.',
  },
];

const WHY_CHOOSE_POINTS = [
  'A relaxing environment away from busy city traffic',
  'Nature-inspired atmosphere surrounded by open greenery',
  'Convenient Mombasa Road location in Athi River',
  'Refreshing outdoor swimming pool with sunlit seating',
  'Family-friendly accommodation and welcoming grounds',
  'Complimentary Wi-Fi and free on-site parking',
];

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onOpenLightbox }) => {
  return (
    <div className="pt-20">
      {/* Page Hero */}
      <section className="relative py-20 md:py-28 bg-[#183D32] bg-texture-botanical-dark text-[#F8F6F0] overflow-hidden">
        <img
          src={HOTEL_MEDIA.familyLawn}
          alt="Aerial view of Small World Country Club cottages, green lawns, and swimming pool"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-[#183D32]/75 via-[#183D32]/65 to-[#183D32]/90"
        />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <p className="text-xs font-medium tracking-[0.24em] uppercase text-[#C5A46D]">
            About The Property
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#FFFFFF] leading-tight mt-4">
            Discover Small World Country Club
          </h1>
          <div aria-hidden="true" className="w-16 h-[1.5px] bg-[#C5A46D] mx-auto my-6" />
          <p className="font-serif-editorial italic text-xl sm:text-2xl text-[#E6DCCB]">
            A place to relax, reconnect and create beautiful memories.
          </p>
        </div>
      </section>

      {/* A. Our Story */}
      <section className="py-20 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <p className="text-xs font-medium tracking-[0.22em] uppercase text-[#C5A46D]">
              Our Story
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-[#183D32] leading-tight mt-4">
              A Welcoming Retreat Along Mombasa Road
            </h2>
            <div aria-hidden="true" className="w-14 h-[1.5px] bg-[#C5A46D] my-6" />
            <div className="space-y-5 text-sm sm:text-base text-[#252925]/80 leading-relaxed">
              <p>
                Set along Mombasa Road in Athi River, Small World Country Club is a 3-star hotel and
                country club created as a peaceful sanctuary outside the rush of Nairobi. Framed by
                green grounds and fresh countryside air, it offers visitors a harmonious blend of
                comfort, relaxation, and nature.
              </p>
              <p>
                Guests visit us for quiet weekend getaways, family gatherings, restful overnight
                stays, and memorable celebrations—drawn by the calm atmosphere, attentive service,
                and natural surroundings that make every arrival feel unhurried.
              </p>
              <p>
                With a {SITE_CONFIG.ratings.google.score} rating across{' '}
                {SITE_CONFIG.ratings.google.countLabel.toLowerCase()} on Google and{' '}
                {SITE_CONFIG.ratings.tripadvisor.score} on Tripadvisor, Small World Country Club
                continues to welcome travelers, families, and weekend guests looking for genuine
                Kenyan hospitality.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <ResilientImage
              src={HOTEL_MEDIA.accommodationWing}
              alt="Guest accommodation building with natural stone accents and spacious on-site parking courtyard"
              containerClassName="aspect-[4/3] rounded-sm shadow-md"
            />
          </div>
        </div>
      </section>

      {/* B. Our Philosophy */}
      <section className="py-20 md:py-24 bg-[#E6DCCB]/35 bg-texture-botanical-light border-y border-[#252925]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-medium tracking-[0.22em] uppercase text-[#354A36]">
              Our Philosophy
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-[#183D32] leading-tight mt-4">
              More Than Just a Stay
            </h2>
            <div aria-hidden="true" className="w-14 h-[1.5px] bg-[#C5A46D] mx-auto mt-6" />
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            {PHILOSOPHY_PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="bg-[#FFFFFF] border border-[#252925]/10 rounded-sm p-8 sm:p-9"
              >
                <span className="font-display text-3xl text-[#C5A46D] tabular-nums">
                  {pillar.number}
                </span>
                <h3 className="font-display text-xl tracking-wide uppercase text-[#183D32] mt-5 pb-4 border-b border-[#252925]/10">
                  {pillar.title}
                </h3>
                <p className="text-sm text-[#252925]/75 mt-5 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* C. Our Facilities */}
      <section className="py-20 md:py-24 bg-texture-stone">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1">
              <ResilientImage
                src={HOTEL_MEDIA.outdoorPool}
                alt="Outdoor swimming pool and open veranda illuminated under twilight skies at Small World Country Club"
                containerClassName="aspect-[4/3] rounded-sm shadow-md"
              />
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2">
              <p className="text-xs font-medium tracking-[0.22em] uppercase text-[#C5A46D]">
                Our Facilities
              </p>
              <h2 className="font-display text-3xl sm:text-4xl text-[#183D32] leading-tight mt-4">
                Comfort Framed by Nature
              </h2>
              <div aria-hidden="true" className="w-14 h-[1.5px] bg-[#C5A46D] my-6" />
              <p className="text-sm sm:text-base text-[#252925]/75 leading-relaxed">
                Every facility at Small World Country Club supports a serene, convenient stay in Athi
                River:
              </p>

              <ul className="mt-7 space-y-4">
                {[
                  'Outdoor swimming pool surrounded by peaceful gardens',
                  'Free on-site parking for guests and day visitors',
                  'Complimentary Wi-Fi across hotel spaces',
                  'Air-conditioned facilities for year-round comfort',
                  'Dedicated laundry services for effortless stays',
                  'Family-friendly environment with open green spaces',
                  'Nature-inspired surroundings along Mombasa Road',
                ].map((facility) => (
                  <li key={facility} className="flex items-start gap-3 text-sm text-[#252925]/85 leading-relaxed">
                    <Check className="w-4 h-4 text-[#183D32] mt-1 shrink-0" aria-hidden="true" />
                    <span>{facility}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* D. Why Choose Small World Country Club */}
      <section className="py-20 bg-[#183D32] bg-texture-botanical-dark text-[#F8F6F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <p className="text-xs font-medium tracking-[0.22em] uppercase text-[#C5A46D]">
                Why Guests Choose Us
              </p>
              <h2 className="font-display text-3xl sm:text-4xl text-[#FFFFFF] leading-tight mt-4">
                Why Choose Small World Country Club?
              </h2>
              <div aria-hidden="true" className="w-14 h-[1.5px] bg-[#C5A46D] my-6" />
              <p className="text-sm text-[#E6DCCB]/85 leading-relaxed">
                Accessible from Nairobi via Mombasa Road, yet wonderfully removed from city rush.
              </p>
            </div>
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {WHY_CHOOSE_POINTS.map((point, index) => (
                <div
                  key={point}
                  className="p-6 border border-[#F8F6F0]/15 bg-[#FFFFFF]/5 rounded-sm"
                >
                  <span className="text-xs font-semibold text-[#C5A46D] tabular-nums">
                    0{index + 1}
                  </span>
                  <p className="text-sm text-[#F8F6F0] mt-3 leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* E. Image Showcase */}
      <section className="py-20 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-[#252925]/10">
          <div>
            <p className="text-xs font-medium tracking-[0.22em] uppercase text-[#C5A46D]">
              Editorial Showcase
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-[#183D32] leading-tight mt-4">
              Spaces Designed for Calm
            </h2>
          </div>
          <p className="text-xs text-[#252925]/65 max-w-sm leading-relaxed">
            Explore the clubhouse, stone cottages, poolside terraces, and lush countryside grounds
            along Mombasa Road.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <button
            type="button"
            onClick={() => onOpenLightbox(0)}
            className="md:col-span-8 group relative overflow-hidden rounded-sm cursor-pointer text-left"
          >
            <ResilientImage
              src={HOTEL_MEDIA.heroExterior}
              alt={GALLERY_ITEMS[0].alt}
              containerClassName="aspect-[16/9]"
              className="transition-transform duration-500 group-hover:scale-105"
            />
          </button>
          <button
            type="button"
            onClick={() => onOpenLightbox(3)}
            className="md:col-span-4 group relative overflow-hidden rounded-sm cursor-pointer text-left"
          >
            <ResilientImage
              src={HOTEL_MEDIA.familyLawn}
              alt={GALLERY_ITEMS[3].alt}
              containerClassName="aspect-[4/3] md:h-full"
              className="transition-transform duration-500 group-hover:scale-105"
            />
          </button>
          <button
            type="button"
            onClick={() => onOpenLightbox(5)}
            className="md:col-span-6 group relative overflow-hidden rounded-sm cursor-pointer text-left"
          >
            <ResilientImage
              src={HOTEL_MEDIA.poolTwilight}
              alt={GALLERY_ITEMS[5].alt}
              containerClassName="aspect-[4/3]"
              className="transition-transform duration-500 group-hover:scale-105"
            />
          </button>
          <button
            type="button"
            onClick={() => onOpenLightbox(1)}
            className="md:col-span-6 group relative overflow-hidden rounded-sm cursor-pointer text-left"
          >
            <ResilientImage
              src={HOTEL_MEDIA.courtyardEvening}
              alt={GALLERY_ITEMS[1].alt}
              containerClassName="aspect-[4/3]"
              className="transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        </div>
      </section>

      {/* F. About Closing Section */}
      <section className="py-20 md:py-24 bg-[#E6DCCB]/40 bg-texture-botanical-light border-t border-[#252925]/10 text-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-3xl sm:text-4xl text-[#183D32] leading-tight">
            Come Experience Small World.
          </h2>
          <div aria-hidden="true" className="w-14 h-[1.5px] bg-[#C5A46D] mx-auto my-6" />
          <p className="font-serif-editorial italic text-xl text-[#354A36]">
            We look forward to welcoming you.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('/booking')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#183D32] text-[#F8F6F0] text-xs font-medium tracking-[0.16em] uppercase rounded-sm hover:bg-[#354A36] transition-colors cursor-pointer"
            >
              <span>Book Your Stay</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <a
              href={SITE_CONFIG.location.googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-4 border border-[#183D32]/30 text-[#183D32] text-xs font-medium tracking-[0.14em] uppercase rounded-sm hover:bg-[#FFFFFF] transition-colors"
            >
              <Compass className="w-4 h-4" aria-hidden="true" />
              <span>View Directions</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
