import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import UpcomingEvents from "../components/UpcomingEvents";
import {
  ArrowLeft,
  Heart,
  MapPin,
  Star,
  Users,
  Building2,
  CalendarDays,
  MessageSquare,
  Camera,
  ChevronRight,
  Waves,
  Music,
  Mountain,
  Landmark,
} from "lucide-react";

// ─── Destination Data ───────────────────────────────────────────────────────
const DESTINATIONS = {
  goa: {
    name: "Goa",
    emoji: "🌴",
    region: "India • Western India",
    rating: 4.8,
    reviews: 126,
    heroImage:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
    aboutImage:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&q=80",
    tags: [
      { icon: Waves, label: "Beaches" },
      { icon: Music, label: "Nightlife" },
      { icon: Mountain, label: "Adventure" },
      { icon: Landmark, label: "Culture" },
    ],
    stats: [
      { icon: Users, value: "124", label: "Travelers", sub: "in this place" },
      { icon: Building2, value: "45", label: "Hotels", sub: "available" },
      { icon: CalendarDays, value: "12", label: "Events", sub: "upcoming" },
      { icon: MessageSquare, value: "8", label: "Groups", sub: "active" },
    ],
    about:
      "Goa is India's sunshine state known for its golden beaches, vibrant nightlife, Portuguese heritage, and relaxed vibes. From thrilling water sports to peaceful sunsets, Goa has something for every traveler.",
    attractions: [
      {
        name: "Baga Beach",
        type: "Beach",
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&q=80",
      },
      {
        name: "Basilica of Bom Jesus",
        type: "Heritage",
        image:
          "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=300&q=80",
      },
      {
        name: "Dudhsagar Falls",
        type: "Nature",
        image:
          "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=300&q=80",
      },
      {
        name: "Fort Aguada",
        type: "Fort",
        image:
          "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=300&q=80",
      },
    ],
    events: [
      {
        name: "Sunburn Goa 2024",
        category: "Music Festival",
        categoryColor: "text-purple-400 bg-purple-400/10",
        dates: "27 Dec – 29 Dec 2024",
        location: "Vagator, Goa",
        image:
          "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=200&q=80",
      },
      {
        name: "Goa Beach Festival",
        category: "Beach Festival",
        categoryColor: "text-cyan-400 bg-cyan-400/10",
        dates: "18 Jan – 20 Jan 2025",
        location: "Candolim Beach, Goa",
        image:
          "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=200&q=80",
      },
    ],
  },
  mumbai: {
    name: "Mumbai",
    emoji: "🌆",
    region: "India • Western India",
    rating: 4.6,
    reviews: 214,
    heroImage:
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80",
    aboutImage:
      "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=400&q=80",
    tags: [
      { icon: Landmark, label: "Heritage" },
      { icon: Music, label: "Nightlife" },
      { icon: Waves, label: "Beaches" },
      { icon: Mountain, label: "Culture" },
    ],
    stats: [
      { icon: Users, value: "312", label: "Travelers", sub: "in this place" },
      { icon: Building2, value: "89", label: "Hotels", sub: "available" },
      { icon: CalendarDays, value: "24", label: "Events", sub: "upcoming" },
      { icon: MessageSquare, value: "15", label: "Groups", sub: "active" },
    ],
    about:
      "Mumbai is India's financial capital and the city that never sleeps. From the iconic Gateway of India to the bustling Dharavi, Mumbai is a city of contrasts, dreams, and endless energy.",
    attractions: [
      {
        name: "Gateway of India",
        type: "Monument",
        image:
          "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=300&q=80",
      },
      {
        name: "Marine Drive",
        type: "Promenade",
        image:
          "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=300&q=80",
      },
      {
        name: "Elephanta Caves",
        type: "Heritage",
        image:
          "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=300&q=80",
      },
      {
        name: "Juhu Beach",
        type: "Beach",
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&q=80",
      },
    ],
    events: [
      {
        name: "Mumbai Marathon 2025",
        category: "Sports Event",
        categoryColor: "text-orange-400 bg-orange-400/10",
        dates: "15 Jan – 15 Jan 2025",
        location: "CST, Mumbai",
        image:
          "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=200&q=80",
      },
      {
        name: "Kala Ghoda Arts Festival",
        category: "Cultural Festival",
        categoryColor: "text-pink-400 bg-pink-400/10",
        dates: "1 Feb – 9 Feb 2025",
        location: "Kala Ghoda, Mumbai",
        image:
          "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=200&q=80",
      },
    ],
  },
  delhi: {
    name: "Delhi",
    emoji: "🏛️",
    region: "India • Northern India",
    rating: 4.5,
    reviews: 189,
    heroImage:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80",
    aboutImage:
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=400&q=80",
    tags: [
      { icon: Landmark, label: "Heritage" },
      { icon: Mountain, label: "Culture" },
      { icon: Music, label: "Arts" },
      { icon: Waves, label: "Food" },
    ],
    stats: [
      { icon: Users, value: "278", label: "Travelers", sub: "in this place" },
      { icon: Building2, value: "120", label: "Hotels", sub: "available" },
      { icon: CalendarDays, value: "18", label: "Events", sub: "upcoming" },
      { icon: MessageSquare, value: "11", label: "Groups", sub: "active" },
    ],
    about:
      "Delhi, India's capital, is a living museum of thousands of years of history. From Mughal monuments to modern malls, Old Delhi's spice markets to Lutyens' bungalows — every street tells a story.",
    attractions: [
      {
        name: "Red Fort",
        type: "Monument",
        image:
          "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=300&q=80",
      },
      {
        name: "Qutub Minar",
        type: "Heritage",
        image:
          "https://images.unsplash.com/photo-1548013146-72479768bada?w=300&q=80",
      },
      {
        name: "India Gate",
        type: "Monument",
        image:
          "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=300&q=80",
      },
      {
        name: "Chandni Chowk",
        type: "Market",
        image:
          "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=300&q=80",
      },
    ],
    events: [
      {
        name: "Delhi Half Marathon",
        category: "Sports Event",
        categoryColor: "text-orange-400 bg-orange-400/10",
        dates: "20 Oct – 20 Oct 2024",
        location: "Jawaharlal Nehru Stadium",
        image:
          "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=200&q=80",
      },
      {
        name: "Dilli Haat Food Festival",
        category: "Food Festival",
        categoryColor: "text-yellow-400 bg-yellow-400/10",
        dates: "5 Dec – 15 Dec 2024",
        location: "Dilli Haat, INA",
        image:
          "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=200&q=80",
      },
    ],
  },
  jaipur: {
    name: "Jaipur",
    emoji: "🏰",
    region: "India • Northern India",
    rating: 4.7,
    reviews: 156,
    heroImage:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80",
    aboutImage:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&q=80",
    tags: [
      { icon: Landmark, label: "Heritage" },
      { icon: Mountain, label: "Culture" },
      { icon: Waves, label: "Crafts" },
      { icon: Music, label: "Festivals" },
    ],
    stats: [
      { icon: Users, value: "198", label: "Travelers", sub: "in this place" },
      { icon: Building2, value: "67", label: "Hotels", sub: "available" },
      { icon: CalendarDays, value: "9", label: "Events", sub: "upcoming" },
      { icon: MessageSquare, value: "7", label: "Groups", sub: "active" },
    ],
    about:
      "The Pink City of India, Jaipur is a treasure trove of royal palaces, ancient forts, and vibrant bazaars. The city blends Rajputana grandeur with warm Rajasthani hospitality.",
    attractions: [
      {
        name: "Amber Fort",
        type: "Fort",
        image:
          "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=300&q=80",
      },
      {
        name: "Hawa Mahal",
        type: "Palace",
        image:
          "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=300&q=80",
      },
      {
        name: "City Palace",
        type: "Heritage",
        image:
          "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=300&q=80",
      },
      {
        name: "Jantar Mantar",
        type: "Observatory",
        image:
          "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=300&q=80",
      },
    ],
    events: [
      {
        name: "Jaipur Literature Festival",
        category: "Cultural Festival",
        categoryColor: "text-pink-400 bg-pink-400/10",
        dates: "1 Feb – 5 Feb 2025",
        location: "Diggi Palace, Jaipur",
        image:
          "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=200&q=80",
      },
      {
        name: "Elephant Festival",
        category: "Traditional Festival",
        categoryColor: "text-purple-400 bg-purple-400/10",
        dates: "14 Mar – 14 Mar 2025",
        location: "Chaugan Stadium, Jaipur",
        image:
          "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=200&q=80",
      },
    ],
  },
};

// ─── Component ───────────────────────────────────────────────────────────────
const DestinationPage = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("attractions");

  const dest = DESTINATIONS[name?.toLowerCase()] || DESTINATIONS.goa;

  return (
    <div
      className="min-h-screen bg-[#0a0a14] text-white overflow-y-auto"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Hero ── */}
      <div className="relative h-72 w-full overflow-hidden">
        <img
          src={dest.heroImage}
          alt={dest.name}
          className="w-full h-full object-cover"
        />
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a14] via-[#0a0a1480] to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-5 left-5 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/10"
        >
          <ArrowLeft size={18} />
        </button>

        {/* Like button */}
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/10"
        >
          <Heart
            size={18}
            className={liked ? "text-pink-500 fill-pink-500" : "text-white"}
          />
        </button>

        {/* Title over hero */}
        <div className="absolute bottom-5 left-5">
          <h1 className="text-4xl font-black tracking-tight">
            {dest.name}{" "}
            <span className="text-3xl">{dest.emoji}</span>
          </h1>
          <div className="flex items-center gap-1 mt-1 text-sm text-white/70">
            <MapPin size={13} className="text-pink-400" />
            <span>{dest.region}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-0.5 rounded-full">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-300 text-xs font-semibold">
                {dest.rating}
              </span>
            </div>
            <span className="text-white/50 text-xs">
              ({dest.reviews} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-4 pb-12 space-y-6 mt-2">
        {/* Tags */}
        <div className="flex gap-2 flex-wrap">
          {dest.tags.map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm text-white/80 hover:bg-white/10 transition-colors"
            >
              <Icon size={13} className="text-purple-400" />
              {label}
            </button>
          ))}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-2 bg-white/5 border border-white/10 rounded-2xl p-4">
          {dest.stats.map(({ icon: Icon, value, label, sub }) => (
            <div key={label} className="flex flex-col items-center text-center gap-1">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                <Icon
                  size={18}
                  className={
                    label === "Travelers"
                      ? "text-purple-400"
                      : label === "Hotels"
                      ? "text-blue-400"
                      : label === "Events"
                      ? "text-pink-400"
                      : "text-green-400"
                  }
                />
              </div>
              <span className="text-xl font-bold leading-none">{value}</span>
              <span className="text-white/80 text-xs font-medium">{label}</span>
              <span className="text-white/40 text-[10px] leading-tight">{sub}</span>
            </div>
          ))}
        </div>

        {/* About */}
        <div>
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-gradient-to-b from-purple-400 to-pink-500 inline-block" />
            About {dest.name}
          </h2>
          <div className="flex gap-3">
            <p className="text-white/60 text-sm leading-relaxed flex-1">
              {dest.about}
            </p>
            <img
              src={dest.aboutImage}
              alt="About"
              className="w-28 h-28 object-cover rounded-2xl flex-shrink-0"
            />
          </div>
        </div>

        {/* Top Attractions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-gradient-to-b from-purple-400 to-pink-500 inline-block" />
              Top Attractions
            </h2>
            <button className="flex items-center gap-1 text-purple-400 text-sm">
              View all <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {dest.attractions.map((a) => (
              <div
                key={a.name}
                className="relative rounded-2xl overflow-hidden h-36 cursor-pointer group"
              >
                <img
                  src={a.image}
                  alt={a.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-2 left-3">
                  <p className="text-white font-semibold text-sm leading-tight">
                    {a.name}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin size={10} className="text-pink-400" />
                    <span className="text-white/60 text-xs">{a.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button
  onClick={() => navigate(`/travelers/${name}`)}
  className="flex flex-col items-center gap-2 py-3 rounded-2xl bg-purple-500/20 border border-purple-500/30 hover:bg-purple-500/30 transition-colors"
>
  <Users size={18} className="text-purple-400" />
  <span className="text-xs text-white/80">Find Travelers</span>
</button>
          <button
  onClick={() => navigate(`/posts/${name}`)}
  className="flex flex-col items-center gap-2 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
>
  <Camera size={18} className="text-blue-400" />
  <span className="text-xs text-white/80">View Posts</span>
</button>
          <button
  onClick={() => navigate("/trip-groups/Goa")}
  className="flex flex-col items-center gap-2 py-3 rounded-2xl bg-pink-500/20 border border-pink-500/30 hover:bg-pink-500/30 transition-colors"
>
  <MessageSquare size={18} className="text-pink-400" />
  <span className="text-xs text-white/80">Trip Groups</span>
</button>
        </div>

        

        {/* Upcoming Events */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-gradient-to-b from-purple-400 to-pink-500 inline-block" />
              Upcoming Events
            </h2>
            <button className="flex items-center gap-1 text-purple-400 text-sm">
              View all <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {dest.events.map((ev) => (
              <div
                key={ev.name}
                className="flex gap-3 bg-white/5 border border-white/10 rounded-2xl overflow-hidden p-3 items-center"
              >
                <img
                  src={ev.image}
                  alt={ev.name}
                  className="w-16 h-16 object-cover rounded-xl flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-semibold text-sm">
                      {ev.name}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${ev.categoryColor}`}
                    >
                      {ev.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <CalendarDays size={11} className="text-white/40" />
                    <span className="text-white/50 text-xs">{ev.dates}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin size={11} className="text-white/40" />
                    <span className="text-white/50 text-xs">{ev.location}</span>
                  </div>
                </div>
                <button className="text-xs border border-white/20 rounded-lg px-2 py-1.5 text-white/70 hover:bg-white/10 transition-colors flex-shrink-0">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationPage;