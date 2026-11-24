export type PageRoute = '/' | '/booking' | '/contact' | '/about';

export interface GalleryMediaItem {
  id: string;
  src: string;
  alt: string;
  title: string;
  category:
    | 'Exterior'
    | 'Swimming Pool'
    | 'Accommodations'
    | 'Gardens'
    | 'Pavilion'
    | 'Estate View';
  aspect: 'landscape' | 'portrait' | 'square';
  isPlaceholder?: boolean;
  objectPosition?: string;
}

export const SITE_CONFIG = {
  businessName: 'Small World Country Club',
  shortName: 'SMALL WORLD',
  subName: 'COUNTRY CLUB',
  starCategory: '3-Star Hotel & Country Club',
  tagline: 'Escape the Ordinary. Embrace the Extraordinary.',
  positioning:
    'A peaceful countryside escape where comfort, nature and memorable experiences come together.',
  location: {
    addressLine: 'Mombasa Road, Athi River, Kenya',
    fullLocation: 'Mombasa Road, Athi River, Nairobi, Kenya',
    plusCode: 'G28X+95 Athi River',
    coordinates: {
      lat: -1.483875,
      lng: 37.048125,
    },
    googleMapsDirectionsUrl:
      'https://www.google.com/maps/dir/?api=1&destination=G28X%2B95+Athi+River%2C+Kenya',
    googleMapsListingUrl:
      'https://www.google.com/maps/search/?api=1&query=Small+World+Country+Club+G28X%2B95+Athi+River',
    tripadvisorSearchUrl:
      'https://www.tripadvisor.com/Search?q=Small+World+Country+Club+Athi+River',
  },
  contact: {
    phoneDisplay: '+254 700 500 616',
    phoneHref: 'tel:+254700500616',
    whatsappNumber: '254700500616',
    whatsappBaseUrl: 'https://wa.me/254700500616',
    bookingEmail: '',
  },
  hours: {
    checkIn: '2:00 PM',
    checkOut: '10:00 AM',
  },
  ratings: {
    google: {
      score: '4.3 / 5',
      numericScore: 4.3,
      countLabel: 'Approximately 1,072 reviews',
    },
    tripadvisor: {
      score: '4.1 / 5',
      numericScore: 4.1,
      countLabel: '41 reviews',
    },
  },
  amenities: [
    {
      id: 'pool',
      title: 'Outdoor Swimming Pool',
      description:
        'An inviting outdoor pool surrounded by manicured lawns and sunlit loungers for quiet afternoons.',
    },
    {
      id: 'wifi',
      title: 'Complimentary Wi-Fi',
      description:
        'Reliable wireless internet access available across guest spaces so you can stay connected when needed.',
    },
    {
      id: 'parking',
      title: 'Free Parking',
      description:
        'Spacious, complimentary on-site parking conveniently positioned off Mombasa Road.',
    },
    {
      id: 'ac',
      title: 'Air-Conditioned Facilities',
      description:
        'Cool, climate-controlled indoor spaces designed for restful comfort throughout every season.',
    },
    {
      id: 'laundry',
      title: 'Laundry Services',
      description:
        'Thoughtful laundry care available to keep extended stays and weekend getaways effortless.',
    },
    {
      id: 'family',
      title: 'Family-Friendly Environment',
      description:
        'Open green grounds and a warm, welcoming atmosphere where families feel immediately at home.',
    },
  ],
  socialLinks: {
    facebook: '',
    instagram: '',
    tiktok: '',
  },
  integrations: {
    backendBookingApiUrl: '',
    backendContactApiUrl: '',
    mpesaEnabled: false,
    analyticsMeasurementId: '',
  },
} as const;

export const HOTEL_MEDIA = {
  heroExterior: '/assets/aistudio/sall_world_9_82d3fbe2.jpg',
  outdoorPool: '/assets/aistudio/Small_world_11245c1b.jpg',
  poolTwilight: '/assets/aistudio/small_world_5_beb782c9.jpg',
  acaciaGardens: '/assets/aistudio/small_world_8_e7e3f8d4.jpg',
  guestSuite: '/assets/aistudio/small_world_2_b1413b28.jpg',
  accommodationWing: '/assets/aistudio/sall_world_7_05100213.jpg',
  familyLawn: '/assets/aistudio/sall_world_3_b56878c2.jpg',
  courtyardEvening: '/assets/aistudio/small_world_4_09838198.jpg',
  verandaMosaic: '/assets/aistudio/small_world_6_a15da690.jpg',
};

export const GALLERY_ITEMS: GalleryMediaItem[] = [
  {
    id: 'gallery-manor',
    src: HOTEL_MEDIA.heroExterior,
    alt: 'Small World Country Club main clubhouse exterior overlooking the sunlit swimming pool and loungers',
    title: 'Main Clubhouse & Sunlit Poolside',
    category: 'Exterior',
    aspect: 'landscape',
  },
  {
    id: 'gallery-pavilion',
    src: HOTEL_MEDIA.courtyardEvening,
    alt: 'Thatched makuti welcome pavilion glowing at dusk with landscaped agave entrance garden',
    title: 'Thatched Welcome Pavilion',
    category: 'Pavilion',
    aspect: 'landscape',
  },
  {
    id: 'gallery-pool-dusk',
    src: HOTEL_MEDIA.outdoorPool,
    alt: 'Outdoor swimming pool and open veranda illuminated under twilight skies beside an acacia tree',
    title: 'Poolside Veranda at Dusk',
    category: 'Swimming Pool',
    aspect: 'landscape',
  },
  {
    id: 'gallery-aerial',
    src: HOTEL_MEDIA.familyLawn,
    alt: 'Aerial view of Small World Country Club cottages, winding garden paths, green lawns, and pool',
    title: 'Countryside Estate & Lawns',
    category: 'Estate View',
    aspect: 'landscape',
  },
  {
    id: 'gallery-villa',
    src: HOTEL_MEDIA.guestSuite,
    alt: 'Stone guest villa with warm veranda lighting and landscaped evening gardens',
    title: 'Stone Cottage & Garden Veranda',
    category: 'Accommodations',
    aspect: 'landscape',
  },
  {
    id: 'gallery-pool-gazebo',
    src: HOTEL_MEDIA.poolTwilight,
    alt: 'Evening swimming pool framed by arched coastal-style pavilion and thatched poolside gazebo',
    title: 'Evening Pool & Gazebos',
    category: 'Swimming Pool',
    aspect: 'landscape',
  },
  {
    id: 'gallery-wing',
    src: HOTEL_MEDIA.accommodationWing,
    alt: 'Guest accommodation building with natural stone accents and spacious on-site parking courtyard',
    title: 'Accommodation Wing & Parking',
    category: 'Accommodations',
    aspect: 'landscape',
  },
  {
    id: 'gallery-grounds',
    src: HOTEL_MEDIA.acaciaGardens,
    alt: 'Tree-lined entrance promenade and manicured green grounds at Small World Country Club',
    title: 'Tree-Lined Grounds & Entrance',
    category: 'Gardens',
    aspect: 'landscape',
  },
  {
    id: 'gallery-terrace',
    src: HOTEL_MEDIA.verandaMosaic,
    alt: 'Palm-framed stone terrace and arched veranda at Small World Country Club',
    title: 'Palm Terrace & Arched Veranda',
    category: 'Exterior',
    aspect: 'square',
    objectPosition: 'object-top',
  },
];

export const FAQS = [
  {
    question: 'What time is check-in?',
    answer: 'Check-in begins at 2:00 PM.',
  },
  {
    question: 'What time is check-out?',
    answer: 'Check-out is at 10:00 AM.',
  },
  {
    question: 'Does the hotel have a swimming pool?',
    answer: 'Yes, the hotel has an outdoor swimming pool.',
  },
  {
    question: 'Is parking available?',
    answer: 'Yes, free parking is available.',
  },
  {
    question: 'Is Wi-Fi available?',
    answer: 'Yes, complimentary Wi-Fi is available.',
  },
  {
    question: 'How can I make a reservation?',
    answer:
      'Guests can submit a booking request through the website or contact the hotel directly by phone or WhatsApp.',
  },
];
