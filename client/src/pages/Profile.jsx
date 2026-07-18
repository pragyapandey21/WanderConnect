import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  FaMapMarkerAlt,
  FaChevronRight,
  FaBell,
  FaCog,
  FaCamera,
  FaCompass,
  FaGlobeAmericas,
  FaSuitcase,
  FaUserFriends,
  FaHeart,
  FaMountain,
  FaWater,
  FaUtensils,
  FaClipboardList,
  FaRegBookmark,
  FaTrash,
  FaPlus,
  FaTimes,
  FaTag,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";

// Mock data — swap these for real user/trip/post data once the profile
// and trips APIs are wired up. Shape kept intentionally simple so it's
// easy to replace with a fetch/query result.
const trips = [
  {
    name: "Goa",
    country: "India",
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&q=80",
  },
  {
    name: "Mumbai",
    country: "India",
    image:
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=500&q=80",
  },
  {
    name: "Ladakh",
    country: "India",
    image:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=500&q=80",
  },
  {
    name: "Kerala",
    country: "India",
    image:
      "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=500&q=80",
  },
];

// Starting defaults — no travel-style / interests fields on the user
// object yet, so these live as local, editable state for now. Once a
// real field exists (e.g. user.travelStyleTags / user.interests),
// initialize the state below from that instead and PATCH on change.
const defaultTravelStyleTags = ["Explorer", "Backpacker", "Nature Lover"];
const defaultInterests = [
  { label: "Mountains", icon: FaMountain },
  { label: "Beaches", icon: FaWater },
  { label: "Photography", icon: FaCamera },
  { label: "Food", icon: FaUtensils },
];

const profileTabs = [
  { key: "posts", label: "Posts", icon: FaClipboardList },
  { key: "trips", label: "Trips", icon: FaSuitcase },
  { key: "saved", label: "Saved", icon: FaRegBookmark },
  { key: "companions", label: "Companions", icon: FaUserFriends },
];

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");

  // Editable tag state (local-only until a backend field exists)
  const [travelStyleTags, setTravelStyleTags] = useState(defaultTravelStyleTags);
  const [interests, setInterests] = useState(defaultInterests);
  const [newStyleTag, setNewStyleTag] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const [addingStyleTag, setAddingStyleTag] = useState(false);
  const [addingInterest, setAddingInterest] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("TOKEN:", token);

        const res = await API.get("/users/profile/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data);
        const postsRes = await API.get("/posts/my-posts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPosts(postsRes.data);
        console.log(postsRes.data[0]);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const addTravelStyleTag = () => {
    const tag = newStyleTag.trim();
    if (!tag) return;
    if (!travelStyleTags.includes(tag)) {
      setTravelStyleTags((prev) => [...prev, tag]);
    }
    setNewStyleTag("");
    setAddingStyleTag(false);
  };

  const removeTravelStyleTag = (tag) => {
    setTravelStyleTags((prev) => prev.filter((t) => t !== tag));
  };

  const addInterest = () => {
    const label = newInterest.trim();
    if (!label) return;
    if (!interests.some((i) => i.label === label)) {
      setInterests((prev) => [...prev, { label, icon: FaTag }]);
    }
    setNewInterest("");
    setAddingInterest(false);
  };

  const removeInterest = (label) => {
    setInterests((prev) => prev.filter((i) => i.label !== label));
  };

  const handleDeletePost = async (postId) => {
    const confirmed = window.confirm("Delete this post? This can't be undone.");
    if (!confirmed) return;

    // Optimistic removal — adjust the endpoint below to match your real
    // delete route if it's different.
    const previousPosts = posts;
    setPosts((prev) => prev.filter((p) => p._id !== postId));

    try {
      const token = localStorage.getItem("token");
      await API.delete(`/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Failed to delete post:", error);
      setPosts(previousPosts); // roll back on failure
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0714] flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  // Countries stat derived from the mock trips array until a real
  // "countries visited" field exists on the user object.
  const countryCount = new Set(trips.map((t) => t.country)).size;

  const stats = [
    { label: "Trips", value: trips.length, icon: FaSuitcase },
    { label: "Followers", value: user?.followers?.length || 0, icon: FaUserFriends },
    { label: "Following", value: user?.following?.length || 0, icon: FaUserFriends },
    { label: "Countries", value: countryCount, icon: FaGlobeAmericas },
  ];

  return (
    <div className="min-h-screen bg-[#0a0714] text-white px-4 pt-6 pb-28 max-w-md mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-extrabold tracking-tight">
          Wander<span className="text-fuchsia-400">Connect</span>
        </h1>
        <div className="flex items-center gap-4">
          <button className="relative text-white/70 hover:text-white transition-colors">
            <FaBell className="text-lg" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-fuchsia-500" />
          </button>
          <button className="text-white/70 hover:text-white transition-colors">
            <FaCog className="text-lg" />
          </button>
        </div>
      </div>

      {/* Profile header card */}
      <div
        className="relative rounded-[28px] p-5 border border-fuchsia-500/30 bg-gradient-to-br from-fuchsia-950/40 via-[#150b26] to-[#0a0714] overflow-hidden"
        style={{ boxShadow: "0 0 40px rgba(217,70,239,0.12)" }}
      >
        {/* Decorative route line + pin */}
        <svg
          viewBox="0 0 260 140"
          className="absolute top-0 right-0 w-2/3 h-full opacity-60 pointer-events-none"
          preserveAspectRatio="xMaxYMid slice"
        >
          <path
            d="M20 130 C 90 120, 120 70, 160 55 S 220 30, 235 20"
            fill="none"
            stroke="#a855f7"
            strokeWidth="2"
            strokeDasharray="4 6"
            opacity="0.6"
          />
          <circle cx="235" cy="20" r="5" fill="#f472b6" />
        </svg>

        <div className="flex items-start gap-4 relative">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className="w-[110px] h-[110px] rounded-full p-[3px]"
              style={{
                background: "linear-gradient(135deg, #f472b6, #a855f7, #6d28d9)",
              }}
            >
              <img
                src={
                  user?.profilePic
                    ? user.profilePic
                    : "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80"
                }
                alt={user?.username}
                className="w-full h-full rounded-full object-cover border-2 border-[#0a0714]"
              />
            </div>
            {user.online && (
              <span className="absolute bottom-1.5 right-1.5 w-4 h-4 rounded-full bg-green-500 border-2 border-[#0a0714]" />
            )}
            <button
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-fuchsia-500 border-2 border-[#0a0714] flex items-center justify-center text-white text-xs"
              title="Change photo"
            >
              <FaCamera />
            </button>
          </div>

          {/* Name + meta */}
          <div className="flex-1 pt-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-xl font-bold truncate">{user?.username}</h2>
              {user.verified && (
                <MdVerified className="text-blue-500 text-lg shrink-0" />
              )}
            </div>

            {user?.username && (
              <p className="text-white/50 text-sm mt-0.5">@{user.username}</p>
            )}

            <div className="flex items-center gap-1.5 text-white/60 text-sm mt-1.5">
              <FaMapMarkerAlt className="text-fuchsia-400 shrink-0" />
              <span className="truncate">{user?.location || "Add location"}</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-white/70 leading-relaxed mt-4 whitespace-pre-line">
          {user.bio}
        </p>

        {/* Edit button */}
        <button
          onClick={() => navigate("/edit-profile")}
          className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-fuchsia-400/50 bg-fuchsia-500/10 text-fuchsia-300 hover:bg-fuchsia-500/20 transition-colors"
        >
          <FaPenIcon />
          Edit Profile
        </button>
      </div>

      {/* Stats */}
      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl flex items-stretch">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`flex-1 flex flex-col items-center gap-1 py-4 ${
                i !== 0 ? "border-l border-white/10" : ""
              }`}
            >
              <Icon className="text-fuchsia-400 text-lg mb-1" />
              <span className="text-lg font-bold">{stat.value}</span>
              <span className="text-xs text-white/50">{stat.label}</span>
            </div>
          );
        })}
      </div>

      {/* Travel Style + Interests (editable) */}
      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4">
        <div className="flex items-center gap-2 text-sm font-semibold mb-3">
          <FaCompass className="text-fuchsia-400" />
          Travel Style
        </div>
        <div className="flex flex-wrap items-center gap-2 pb-3 mb-3 border-b border-white/10">
          {travelStyleTags.map((tag) => (
            <span
              key={tag}
              className="group flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full text-xs font-medium border border-white/10 bg-white/5 text-white/80"
            >
              {tag}
              <button
                onClick={() => removeTravelStyleTag(tag)}
                className="text-white/30 hover:text-red-400 transition-colors"
                title={`Remove ${tag}`}
              >
                <FaTimes className="text-[10px]" />
              </button>
            </span>
          ))}

          {addingStyleTag ? (
            <span className="flex items-center gap-1 pl-2 pr-1 py-1 rounded-full border border-fuchsia-400/50 bg-fuchsia-500/10">
              <input
                autoFocus
                value={newStyleTag}
                onChange={(e) => setNewStyleTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTravelStyleTag()}
                placeholder="Add style"
                className="bg-transparent outline-none text-xs text-white placeholder-white/30 w-20"
              />
              <button
                onClick={addTravelStyleTag}
                className="text-fuchsia-300 hover:text-fuchsia-200 text-[10px] px-1"
              >
                <FaPlus />
              </button>
            </span>
          ) : (
            <button
              onClick={() => setAddingStyleTag(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border border-dashed border-fuchsia-400/40 text-fuchsia-300 hover:bg-fuchsia-500/10 transition-colors"
            >
              <FaPlus className="text-[10px]" />
              Add
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm font-semibold mb-3">
          <FaHeart className="text-pink-400" />
          Interests
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {interests.map((interest) => {
            const Icon = interest.icon;
            return (
              <span
                key={interest.label}
                className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full text-xs font-medium border border-white/10 bg-white/5 text-white/80"
              >
                <Icon className="text-white/50" />
                {interest.label}
                <button
                  onClick={() => removeInterest(interest.label)}
                  className="text-white/30 hover:text-red-400 transition-colors"
                  title={`Remove ${interest.label}`}
                >
                  <FaTimes className="text-[10px]" />
                </button>
              </span>
            );
          })}

          {addingInterest ? (
            <span className="flex items-center gap-1 pl-2 pr-1 py-1 rounded-full border border-fuchsia-400/50 bg-fuchsia-500/10">
              <input
                autoFocus
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addInterest()}
                placeholder="Add interest"
                className="bg-transparent outline-none text-xs text-white placeholder-white/30 w-24"
              />
              <button
                onClick={addInterest}
                className="text-fuchsia-300 hover:text-fuchsia-200 text-[10px] px-1"
              >
                <FaPlus />
              </button>
            </span>
          ) : (
            <button
              onClick={() => setAddingInterest(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border border-dashed border-fuchsia-400/40 text-fuchsia-300 hover:bg-fuchsia-500/10 transition-colors"
            >
              <FaPlus className="text-[10px]" />
              Add
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl flex items-stretch overflow-hidden">
        {profileTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                isActive ? "text-fuchsia-400" : "text-white/50 hover:text-white/70"
              }`}
            >
              <Icon className="text-base" />
              {tab.label}
              <span
                className={`mt-1 h-0.5 w-8 rounded-full ${
                  isActive ? "bg-fuchsia-400" : "bg-transparent"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* My Posts */}
      {activeTab === "posts" && (
        <>
          <SectionHeader title="My Posts" />
          <div className="grid grid-cols-2 gap-3">
            {posts.map((post) => (
              <div
                key={post._id}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10"
              >
                <img
                  src={post.image} // ← change this key to match your real API field
                  alt={post.caption}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <button
                  onClick={() => handleDeletePost(post._id)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 hover:bg-red-500/80 flex items-center justify-center text-white/90 transition-colors"
                  title="Delete post"
                >
                  <FaTrash className="text-[11px]" />
                </button>
                {post.location && (
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[11px] text-white/90">
                    <FaMapMarkerAlt className="text-fuchsia-400 text-[10px]" />
                    {post.location}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Recent Trips (shown under the Trips tab) */}
      {activeTab === "trips" && (
        <>
          <SectionHeader title="Recent Trips" />
          <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
            {trips.map((trip) => (
              <div
                key={trip.name}
                className="relative shrink-0 w-[150px] h-[180px] rounded-2xl overflow-hidden border border-white/10"
              >
                <img
                  src={trip.image}
                  alt={trip.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="font-semibold text-sm leading-tight">{trip.name}</p>
                  <p className="text-xs text-white/70">{trip.country}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === "saved" && (
        <div className="mt-6 text-center text-white/40 text-sm py-10">
          Saved destinations will show up here.
        </div>
      )}

      {activeTab === "companions" && (
        <div className="mt-6 text-center text-white/40 text-sm py-10">
          Your travel companions will show up here.
        </div>
      )}

    </div>
  );
};

// Small pencil icon kept local so we don't need to touch the top-level
// react-icons import block for a single glyph.
const FaPenIcon = () => (
  <svg viewBox="0 0 512 512" className="w-3 h-3 fill-current">
    <path d="M498.1 5.6c-7.5-7.5-19.8-7.5-27.3 0l-45.3 45.3 41.7 41.7 45.3-45.3c7.5-7.5 7.5-19.8 0-27.3L498.1 5.6zM392.2 84.3L52.7 423.8c-2.9 2.9-5 6.4-6.2 10.3L1.1 486.8c-2.5 8.4.5 17.5 7.4 22.9s16.5 6.1 24 1.1l55.9-38c3.6-2.5 6.9-5.6 9.7-9.1l327.7-327.7-33.6-33.6z" />
  </svg>
);

const SectionHeader = ({ title }) => (
  <div className="flex items-center justify-between mt-6 mb-3">
    <h2 className="font-semibold text-[15px]">{title}</h2>
    <button className="flex items-center gap-1 text-xs text-fuchsia-400 hover:text-fuchsia-300 transition-colors">
      See all
      <FaChevronRight className="text-[10px]" />
    </button>
  </div>
);

export default Profile;