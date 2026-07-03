import { useState, useEffect } from "react";
import API from "../services/api";
import { FaPen, FaMapMarkerAlt, FaChevronRight, FaImages, FaUserFriends, FaUsers, FaRegBookmark, FaRegBell, FaLock, FaSignOutAlt } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { GiBackpack } from "react-icons/gi";

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

const posts = [
  "https://images.unsplash.com/photo-1551632811-561732d1e306?w=500&q=80",
  "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=500&q=80",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500&q=80",
  "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=500&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=500&q=80",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500&q=80",
];

const menuItems = [
  { label: "Edit Profile", icon: FaUserFriends },
  { label: "Saved Destinations", icon: FaRegBookmark },
  { label: "Notifications", icon: FaRegBell },
  { label: "Privacy", icon: FaLock },
];
const Profile = () => {
const [isEditing, setIsEditing] = useState(false);
const [user, setUser] = useState(null);
const [posts, setPosts] = useState([]);
const [loading, setLoading] = useState(true);

const stats = [
  {
    label: "Posts",
    value: posts.length,
    icon: FaImages,
  },
  {
    label: "Followers",
    value: user?.followers?.length || 0,
    icon: FaUserFriends,
  },
  {
    label: "Following",
    value: user?.following?.length || 0,
    icon: FaUsers,
  },
];
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

    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, []);
if (loading) {
  return (
    <div className="min-h-screen bg-[#0a0714] flex items-center justify-center text-white">
      Loading...
    </div>
  );
}

  return (
    <div className="min-h-screen bg-[#0a0714] text-white px-4 pt-6 pb-28 max-w-md mx-auto">
      {/* Profile header card */}
      <div
        className="relative rounded-[28px] p-5 border border-fuchsia-500/30 bg-gradient-to-br from-fuchsia-950/40 via-[#150b26] to-[#0a0714] overflow-hidden"
        style={{ boxShadow: "0 0 40px rgba(217,70,239,0.12)" }}
      >
        <div className="flex items-start gap-4">
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
          </div>

          {/* Name + meta */}
          <div className="flex-1 pt-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-bold truncate">{user?.username}</h1>
              {user.verified && (
                <MdVerified className="text-blue-500 text-lg shrink-0" />
              )}
            </div>

            <div className="flex items-center gap-1.5 text-white/60 text-sm mt-1.5">
              <FaMapMarkerAlt className="text-fuchsia-400 shrink-0" />
              <span className="truncate">{user?.location || "Add location"}</span>
            </div>

            <div
              className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-xs font-medium border border-fuchsia-400/40"
              style={{
                background:
                  "linear-gradient(90deg, rgba(217,70,239,0.25), rgba(168,85,247,0.25))",
              }}
            >
              <GiBackpack className="text-fuchsia-300" />
              {user?.travelStyle || "Traveller"}
            </div>
          </div>
        </div>

        <p className="text-sm text-white/70 leading-relaxed mt-4">{user.bio}</p>

        {/* Edit button */}
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-4 right-4 w-9 h-9 rounded-xl flex items-center justify-center border border-fuchsia-400/50 bg-fuchsia-500/10 text-fuchsia-300 hover:bg-fuchsia-500/20 transition-colors"
          title="Edit profile"
        >
          <FaPen className="text-sm" />
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

      {/* Recent Trips */}
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

      {/* Recent Posts */}
      <SectionHeader title="Recent Posts" />
      <div className="grid grid-cols-2 gap-3">
        {posts.map((src, i) => (
          <div
            key={i}
            className="aspect-[4/3] rounded-2xl overflow-hidden border border-white/10"
          >
            <img
              src={src}
              alt={`Post ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Menu */}
      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
        {menuItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm text-left hover:bg-white/5 transition-colors ${
                i !== 0 ? "border-t border-white/10" : ""
              }`}
            >
              <Icon className="text-fuchsia-400 text-base shrink-0" />
              <span className="flex-1">{item.label}</span>
              <FaChevronRight className="text-white/30 text-xs shrink-0" />
            </button>
          );
        })}

        <button className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-left text-red-400 hover:bg-red-500/5 transition-colors border-t border-white/10">
          <FaSignOutAlt className="text-base shrink-0" />
          <span>Logout</span>
        </button>
      </div>

      {isEditing && (
        // Placeholder hook for a future edit-profile modal/screen.
        // Wire this up to your actual edit flow when it exists.
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-6"
          onClick={() => setIsEditing(false)}
        >
          <div
            className="bg-[#150b26] border border-fuchsia-500/30 rounded-2xl p-5 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm text-white/70">
              Edit profile flow goes here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const SectionHeader = ({ title }) => (
  <div className="flex items-center justify-between mt-6 mb-3">
    <h2 className="font-semibold text-[15px]">{title}</h2>
    <button className="flex items-center gap-1 text-xs text-fuchsia-400 hover:text-fuchsia-300 transition-colors">
      View all
      <FaChevronRight className="text-[10px]" />
    </button>
  </div>
);

export default Profile;