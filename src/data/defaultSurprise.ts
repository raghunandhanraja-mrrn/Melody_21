import { SurpriseData } from '../types';

export const DEFAULT_SURPRISE_DATA: SurpriseData = {
  recipientName: 'Lishoow',
  nickname: 'Lishoow ✨',
  senderName: 'Yours Always',
  birthDate: 'October 16',
  specialMilestone: 'Happy Birthday, The Love of My Life',
  heroSubtitle: 'Every second with you is my favorite chapter. Today, every single star shines just for you.',
  loveLetter: {
    greeting: 'To my dearest, my greatest blessing,',
    body: [
      'From the moment you stepped into my life, everything softened, grew brighter, and made unmistakable sense. You have this rare, quiet magic where just hearing your laugh can turn my hardest day into pure peace.',
      'Thank you for your warmth, your silly jokes that make me smile when I least expect it, your gentle kindness to everyone around you, and the boundless love you wrap around my heart every single day.',
      'Watching you grow, dream, and conquer the world is the greatest honor of my life. On your birthday, I want to remind you how deeply treasured, admired, and cherished you are—not just today, but in every lifetime.',
      'Here is to another year of late-night conversations under the moonlight, spontaneous road trips, holding your hand through every season, and loving you more than words could ever hold.'
    ],
    closing: 'Forever and entirely yours,',
    signature: 'With all my love ❤️',
    date: 'On Your Special Day'
  },
  memories: [
    {
      id: 'mem-1',
      title: 'Golden Hour by the Coast',
      date: 'Our Summer Shoreline Walk',
      location: 'Ocean Bluff Trail',
      story: 'We kicked off our sandals, ran into the freezing tide, and laughed until our cheeks hurt. You turned around with wind in your hair and the sunset in your eyes, and in that split second, I knew I never wanted to let you go.',
      imageUrl: '/src/assets/images/romantic_memory_sunset_1792141311715.jpg',
      tag: 'Cherished Moment'
    },
    {
      id: 'mem-2',
      title: 'The Rooftop Candlelight Evening',
      date: 'Our Favorite Secret Spot',
      location: 'Old Town Skyline',
      story: 'Fairy lights overhead, slow music drifting from across the street, clinking champagne glasses, and you talking about your wildest dreams. Seeing your eyes sparkle in the candlelight was the most breathtaking sight in the universe.',
      imageUrl: '/src/assets/images/cinematic_surprise_hero_1792141310489.jpg',
      tag: 'Pure Magic'
    },
    {
      id: 'mem-3',
      title: 'Midnight Coffee & Endless Talks',
      date: 'That Rainy Tuesday',
      location: 'Our Cozy Corner Table',
      story: 'Rain tapping against the glass window, sharing one oversized cinnamon roll, talking about everything from astronomy to childhood memories until the café started flipping their chairs onto tables.',
      imageUrl: '/src/assets/images/luxury_gift_box_1792141310341.jpg',
      tag: 'Soulmate Hours'
    }
  ],
  reasonsWhy: [
    'The way your nose crinkles whenever you laugh uncontrollably.',
    'How you instinctively reach for my hand when we are crossing the street.',
    'Your unconditional empathy and the gentleness with which you treat the world.',
    'The adorable little happy dance you do when your favorite food arrives at the table.',
    'How safe, calm, and grounded I feel whenever I rest my head against your shoulder.',
    'The thoughtful little texts you send right in the middle of a busy workday.',
    'Your brilliant mind and how passionately your eyes light up when talking about your goals.',
    'How you remember the smallest details about the things and people you love.',
    'Because even doing the most mundane grocery runs feels like an adventure with you.',
    'The way you sing your favorite songs off-key with absolute confidence in the car.',
    'Your courage, resilience, and inner grace even through stormy days.',
    'The sweet sleepy voice you have in the morning before your first sip of coffee.',
    'How you make everywhere feel like home as long as you are standing there.',
    'Your hugs that instantly melt away all stress and fatigue from the day.',
    'Because loving you is the easiest, most natural thing I have ever known in my life.'
  ],
  gifts: [
    {
      id: 'gift-1',
      title: 'Private Starlit Rooftop Celebration',
      category: 'Unforgettable Date Experience',
      description: 'An intimate reservation at your favorite rooftop overlooking the twinkling city lights, tailored with your favorite dishes, champagne, and gentle acoustic jazz.',
      details: 'All planned, all taken care of. You just dress up and let me spoil you like the queen you are.',
      iconName: 'Sparkles'
    },
    {
      id: 'gift-2',
      title: 'The Dream Weekend Getaway',
      category: 'Escape & Adventure',
      description: 'A cozy scenic cottage retreat tucked near the coast/mountains, complete with a fireplace, stargazing deck, and zero alarm clocks.',
      details: 'Just you, me, cozy blankets, fresh morning espresso, and scenic walks hand in hand.',
      iconName: 'Compass'
    },
    {
      id: 'gift-3',
      title: 'Handmade Birthstone Keepsake',
      category: 'Treasured Keepsake',
      description: 'A delicate custom gold necklace carrying your birthstone and our anniversary coordinates engraved on the back.',
      details: 'A tangible piece of my heart you can wear every day to remember how endlessly loved you are.',
      iconName: 'Heart'
    },
    {
      id: 'gift-4',
      title: 'The Lifetime VIP Pass',
      category: 'Unconditional Promise',
      description: 'Unlimited forehead kisses, listening ear whenever your heart is full, back rubs after long days, and my unwavering commitment to stand by your side.',
      details: 'Never expires, valid worldwide in any situation, unconditional forever.',
      iconName: 'Crown'
    }
  ],
  coupons: [
    {
      id: 'c-1',
      title: 'Late Night Ice Cream & City Cruise',
      promise: 'Any hour, any night. Your craving is my immediate mission.',
      terms: 'Valid 24/7. Includes your choice of music playlist and as many toppings as you want.',
      isRedeemed: false,
      color: 'from-rose-500/20 to-pink-500/10'
    },
    {
      id: 'c-2',
      title: 'Chef Boyfriend: 3-Course Feast',
      promise: 'A full candlelit gourmet dinner prepared from scratch by me, plus dishes cleaned.',
      terms: 'You do not lift a single finger in the kitchen.',
      isRedeemed: false,
      color: 'from-amber-500/20 to-orange-500/10'
    },
    {
      id: 'c-3',
      title: 'Ultimate Movie Marathon & Blanket Fort',
      promise: 'Your entire watchlist without complaints, hot buttered popcorn, and endless cuddles.',
      terms: 'Even if it is cheesy romance films I pretended not to like.',
      isRedeemed: false,
      color: 'from-purple-500/20 to-indigo-500/10'
    },
    {
      id: 'c-4',
      title: 'One 45-Minute Deluxe Massage',
      promise: 'Shoulder, neck, and back relaxation with soothing lavender scented oils.',
      terms: 'Redeemable anytime you feel worn out or sore.',
      isRedeemed: false,
      color: 'from-emerald-500/20 to-teal-500/10'
    },
    {
      id: 'c-5',
      title: 'Guaranteed Win in Any Dispute',
      promise: 'Instant surrender voucher. Present this card and you are immediately 100% right.',
      terms: 'Valid on harmless couple squabbles (like where to eat or who picked what).',
      isRedeemed: false,
      color: 'from-fuchsia-500/20 to-rose-500/10'
    },
    {
      id: 'c-6',
      title: 'Spontaneous Day Trip Mystery Pass',
      promise: 'Pack an overnight bag, get in the passenger seat, and let me drive you somewhere gorgeous.',
      terms: 'Surprise destination picked entirely to make you smile.',
      isRedeemed: false,
      color: 'from-sky-500/20 to-blue-500/10'
    }
  ]
};
