// Centralized Data for Ozkafe
// Verified brand & cafe details

export const CAFE_INFO = {
  name: "Ozkafe",
  tagline: "Brewing Fresh",
  subtitle: "Specialty Coffee Roastery Brand & Cafe Experience Center",
  foundedYear: 2016,
  originCity: "Kolkata, West Bengal",
  address: "30/4, Broad St, Ballygunge Park, Ballygunge, Kolkata",
  hours: "Open daily from 12:00 PM to 10:00 PM",
  phone: "+91 7605 023 132",
  phoneSecondary: "+91 9831133278",
  phones: ["+91 7605 023 132", "+91 9831133278"],
  phoneDisplay: "+91 7605 023 132 / +91 9831133278",
  email: "info@ozkafe.in",
  googleMapsUrl: "https://maps.google.com/?q=30/4+Broad+St+Ballygunge+Park+Kolkata",
  socials: {
    instagram: "https://www.instagram.com/ozkafecoffeeroaster/",
    instagramHandle: "@ozkafecoffeeroaster",
    facebook: "https://facebook.com/ozkafe",
    zomato: "https://www.zomato.com/kolkata/ozkafe-1-ballygunge"
  }
};

// Cuisine & Offerings
export const OFFERINGS_CATEGORIES = [
  { id: "all", label: "All Offerings" },
  { id: "coffee", label: "Specialty Coffee" },
  { id: "tea", label: "Flavored Teas" },
  { id: "bakery", label: "Bakery & Bakes" },
  { id: "pizza", label: "Artisan Pizza" },
  { id: "continental", label: "Continental Food" },
  { id: "burgers", label: "Gourmet Burgers" },
  { id: "salads", label: "Fresh Salads" }
];

export const MENU_ITEMS = [
  // Specialty Coffee
  {
    id: "c1",
    category: "coffee",
    name: "Ozkafe Signature Pour-Over (V60)",
    tag: "Roaster's Special",
    price: "₹240",
    description: "Single-origin 100% Arabica roasted in-house. Bright stone fruit acidity, jasmine floral notes, and a caramel clean finish.",
    highlight: "Medium Roast • Washed Process • Chikmagalur"
  },
  {
    id: "c2",
    category: "coffee",
    name: "Classic Cortado & Flat White",
    tag: "Barista Classic",
    price: "₹220",
    description: "Double ristretto shot extracted over silky textured micro-foam milk in a ceramic cup, highlighting deep dark cocoa nuances.",
    highlight: "House Espresso Roast • Balanced & Velvety"
  },
  {
    id: "c3",
    category: "coffee",
    name: "18-Hour Slow Cold Brew",
    tag: "Bestseller",
    price: "₹260",
    description: "Steeped cold for 18 hours in small batches. Ultra-smooth, naturally sweet, zero bitterness, served over hand-cut clear ice.",
    highlight: "Dark Chocolate & Brown Sugar Notes"
  },
  {
    id: "c4",
    category: "coffee",
    name: "Aeropress Single-Estate Brew",
    tag: "Manual Brew",
    price: "₹250",
    description: "Immersive manual extraction yielding full-bodied clarity, subtle hazelnut aroma, and balanced fruit vibrancy.",
    highlight: "Estate Harvest • Filtered Precision"
  },

  // Flavored Teas
  {
    id: "t1",
    category: "tea",
    name: "Darjeeling First Flush Whole Leaf",
    tag: "Single Estate",
    price: "₹210",
    description: "The champagne of teas sourced directly from high-altitude Darjeeling tea gardens. Delicate floral muscatel character.",
    highlight: "Spring Harvest • Golden Liquor"
  },
  {
    id: "t2",
    category: "tea",
    name: "Hibiscus Rose & Berry Infusion",
    tag: "Caffeine Free",
    price: "₹220",
    description: "Sun-dried wild hibiscus blossoms blended with organic dried rose petals, whole cranberries, and a touch of raw forest honey.",
    highlight: "Served Hot or Chilled over Ice"
  },
  {
    id: "t3",
    category: "tea",
    name: "Kolkata Spiced Masala Chai Craft",
    tag: "Cafe Signature",
    price: "₹180",
    description: "Assam CTC slow-simmered with crushed green cardamom, ginger, cinnamon bark, and creamy whole milk.",
    highlight: "Traditional Slow Boil • Aromatic"
  },

  // Bakery Items
  {
    id: "b1",
    category: "bakery",
    name: "Artisan Butter Croissant",
    tag: "Freshly Baked Daily",
    price: "₹190",
    description: "Laminated French pastry with 72 golden crispy flaky layers, baked every morning using pure cultured butter.",
    highlight: "Flaky & Golden • Served Warm"
  },
  {
    id: "b2",
    category: "bakery",
    name: "Dark Chocolate Espresso Brownie",
    tag: "Customer Favorite",
    price: "₹210",
    description: "Fudgy 70% dark Belgian chocolate brownie infused with a shot of Ozkafe house espresso and sea salt flakes.",
    highlight: "Rich & Decadent • Made In-House"
  },
  {
    id: "b3",
    category: "bakery",
    name: "Basque Burnt Cheesecake",
    tag: "Specialty Bake",
    price: "₹280",
    description: "Caramelized deeply browned top with a creamy, melt-in-your-mouth custardy center and vanilla bean essence.",
    highlight: "Baked Fresh Daily • Gluten Friendly"
  },

  // Artisan Pizza
  {
    id: "p1",
    category: "pizza",
    name: "Ballygunge Classic Margherita",
    tag: "Wood-Fired Crust",
    price: "₹420",
    description: "48-hour fermented sourdough crust, San Marzano tomato pomodoro, fresh bocconcini mozzarella, sweet basil, and extra virgin olive oil.",
    highlight: "11-inch Hand-Stretched Sourdough"
  },
  {
    id: "p2",
    category: "pizza",
    name: "Wild Mushroom & Truffle Oil Pizza",
    tag: "Chef's Special",
    price: "₹490",
    description: "Sauteed cremini and button mushrooms, roasted garlic, white truffle scented oil, fresh thyme, and mozzarella.",
    highlight: "Rich Earthy Flavors • Vegetarian"
  },
  {
    id: "p3",
    category: "pizza",
    name: "Smoked Chicken & Caramelized Onion Pizza",
    tag: "Signature",
    price: "₹520",
    description: "Hickory smoked chicken chunks, slow-caramelized brown onions, roasted peppers, and aged cheddar-mozzarella blend.",
    highlight: "Wood-Fired Char • House Herb Crust"
  },

  // Continental Food
  {
    id: "cf1",
    category: "continental",
    name: "Tuscan Sun-Dried Tomato & Herb Pasta",
    tag: "Continental",
    price: "₹410",
    description: "Penne tossed in garlic-infused olive oil, sun-dried tomatoes, toasted pine nuts, kalamata olives, and shaved parmesan.",
    highlight: "Al Dente • Choice of Penne or Fettuccine"
  },
  {
    id: "cf2",
    category: "continental",
    name: "Pan-Seared Herbed Chicken Breast",
    tag: "Continental Classic",
    price: "₹480",
    description: "Tender chicken breast seared with rosemary and garlic, served with creamy potato mash, buttered greens, and jus.",
    highlight: "Hearty European Comfort Food"
  },
  {
    id: "cf3",
    category: "continental",
    name: "Grilled Vegetable & Halloumi Platter",
    tag: "Vegetarian",
    price: "₹440",
    description: "Zucchini, bell peppers, asparagus, and golden grilled halloumi cheese drizzled with aged balsamic reduction and sourdough toast.",
    highlight: "Fresh Farm Herbs • Continental Delicacy"
  },

  // Gourmet Burgers
  {
    id: "bg1",
    category: "burgers",
    name: "The Ozkafe Handcrafted Brioche Burger",
    tag: "Gourmet",
    price: "₹380",
    description: "Juicy handcrafted patty (choice of gourmet chicken or seasoned roasted lentil-mushroom), aged cheddar, caramelized onions, house truffle mayo, served on toasted brioche.",
    highlight: "Served with Seasoned Potato Wedges"
  },
  {
    id: "bg2",
    category: "burgers",
    name: "Crispy Peri-Peri Cottage Cheese Burger",
    tag: "Vegetarian",
    price: "₹340",
    description: "Crispy panko-crusted spiced paneer patty, crunchy iceberg lettuce, pickled gherkins, and house smoked paprika relish.",
    highlight: "Toasted Butter Bun • In-House Slaw"
  },

  // Fresh Salads
  {
    id: "s1",
    category: "salads",
    name: "Mediterranean Crisp Greek Salad",
    tag: "Farm Fresh",
    price: "₹320",
    description: "Crisp romaine, vine-ripened tomatoes, English cucumber, Kalamata olives, thinly sliced red onion, and crumbled feta cheese with lemon-oregano vinaigrette.",
    highlight: "Light, Crunchy & Refreshing"
  },
  {
    id: "s2",
    category: "salads",
    name: "Warm Roasted Beetroot & Goat Cheese Salad",
    tag: "Healthy & Wholesome",
    price: "₹350",
    description: "Oven-roasted baby beets, candied walnuts, peppery wild arugula, crumbled creamy goat cheese, tossed with orange-honey reduction.",
    highlight: "Seasonal Greens • High Antioxidant"
  }
];

// Roastery & Brand Milestones
export const ABOUT_MILESTONES = [
  {
    year: "2016",
    title: "Founded in Kolkata",
    description: "Ozkafe was established in Kolkata, West Bengal with a singular obsession: to bring world-class specialty coffee roasting directly to the City of Joy."
  },
  {
    year: "2023",
    title: "The Ballygunge Experience Center",
    description: "Opened our flagship cafe and roastery experience center on Broad Street, Ballygunge Park, featuring an open micro-roasting floor and cupping table."
  },
  {
    year: "2025",
    title: "Artisanal Kitchen & Bakery Expansion",
    description: "Expanded our culinary vision to include genuine wood-fired pizzas, continental dining, gourmet burgers, salads, and fresh European-style bakery items."
  },
  {
    year: "Today",
    title: "Brewing Fresh Everyday",
    description: "A beloved community sanctuary for coffee connoisseurs, creative minds, and food lovers seeking honest roasting and unhurried hospitality."
  }
];

// FAQs matching customer inquiries
export const FAQ_DATA = [
  {
    id: "faq-1",
    category: "hours",
    question: "What are Ozkafe's operating hours and location?",
    answer: "Ozkafe is open daily from 12:00 PM to 10:00 PM. We are located at 30/4, Broad St, Ballygunge Park, Ballygunge, Kolkata, West Bengal. You can easily find us near Ballygunge Park with roadside parking access."
  },
  {
    id: "faq-2",
    category: "coffee",
    question: "What does 'Specialty Coffee Roastery' mean at Ozkafe?",
    answer: "Specialty coffee represents the top 5% of beans graded worldwide (scoring 80+ points on the SCA scale). At Ozkafe, we source directly from shade-grown Indian estates and roast them in small, monitored batches right here in Kolkata. This preserves terroir nuances, whether you choose pour-over (V60), Aeropress, espresso, or 18-hour cold brew."
  },
  {
    id: "faq-3",
    category: "coffee",
    question: "Can I buy freshly roasted coffee beans or grounds for home brewing?",
    answer: "Yes, absolutely! We sell our freshly roasted whole beans and can grind them on order specifically for your home brewer (French Press, South Indian Filter, Espresso, Moka Pot, Aeropress, or Pour-over). Ask our baristas at the cafe counter or drop us an inquiry online."
  },
  {
    id: "faq-4",
    category: "food",
    question: "What cuisine and food options do you offer at the cafe?",
    answer: "Our kitchen offers freshly made artisanal pizzas, continental delicacies, gourmet burgers, crisp salads, daily baked goods (croissants, brownies, cheesecakes), specialty coffees, and single-estate flavored teas. We cater generously to vegetarians, vegans, and meat lovers alike."
  },
  {
    id: "faq-5",
    category: "dining",
    question: "Are walk-ins welcome at Ozkafe?",
    answer: "Yes, walk-ins are always warmly welcomed! We are open daily from 12:00 PM to 10:00 PM with comfortable ambient indoor seating for coffee enthusiasts, remote work, conversations, and casual dining."
  },
  {
    id: "faq-6",
    category: "dining",
    question: "Is Ozkafe suitable for remote work or reading?",
    answer: "Yes! Our Ballygunge space is designed as an unhurried, serene cafe sanctuary. We provide high-speed complimentary Wi-Fi, comfortable seating with accessible power outlets, and a tranquil ambiance bathed in natural light."
  },
  {
    id: "faq-7",
    category: "events",
    question: "Do you host roastery tours, cupping workshops, or private events?",
    answer: "Yes! We periodically hold coffee cupping workshops, manual brewing masterclasses, and accommodate intimate gatherings. Please reach out to us through our Contact page to inquire about upcoming session dates or private event bookings."
  },
  {
    id: "faq-8",
    category: "dining",
    question: "Are parking facilities available at your Ballygunge cafe?",
    answer: "Yes, Broad Street in Ballygunge Park provides street parking for cars and two-wheelers. Our cafe security staff is happy to assist you upon arrival."
  }
];

// Customer Testimonials
export const REVIEWS = [
  {
    id: "r1",
    author: "Ananya Sen",
    role: "Ballygunge Resident & Coffee Aficionado",
    quote: "Ozkafe brings the authentic craft coffee culture Kolkata was craving. Their pour-overs are brewed to perfection, and their wood-fired margherita pizza is second to none.",
    rating: 5
  },
  {
    id: "r2",
    author: "Debanjan Mukherjee",
    role: "Regular Guest",
    quote: "A true gem tucked into Ballygunge Park. The aroma of freshly roasted beans as you walk in is heavenly. Great spot for unhurried conversations and quiet reading.",
    rating: 5
  },
  {
    id: "r3",
    author: "Ritika Roy",
    role: "Food & Lifestyle Explorer",
    quote: "The combination of specialty roast coffee and authentic continental food with freshly baked croissants makes Ozkafe my absolute favorite cafe in Kolkata.",
    rating: 5
  }
];
