import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  FaArrowLeft,
  FaCamera,
  FaCompass,
  FaMountain,
  FaWater,
  FaUtensils,
  FaHiking,
  FaLandmark,
} from "react-icons/fa";

const travelStyleOptions = ["Explorer", "Backpacker", "Luxury", "Nature Lover"];

const interestOptions = [
  { label: "Mountains", icon: FaMountain },
  { label: "Beaches", icon: FaWater },
  { label: "Photography", icon: FaCamera },
  { label: "Food", icon: FaUtensils },
  { label: "Adventure", icon: FaHiking },
  { label: "Culture", icon: FaLandmark },
];

const EditProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [travelStyle, setTravelStyle] = useState("");
  const [interests, setInterests] = useState([]);
  const [openToChat, setOpenToChat] = useState(true);

  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);

  // Load current profile so the form starts populated with real data.
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/users/profile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data || {};
        setUsername(data.username || "");
        setBio(data.bio || "");
        setLocation(data.location || "");
        setTravelStyle(data.travelStyle || "");
        setInterests(data.interests || []);
        setOpenToChat(
          data.openToChat !== undefined ? data.openToChat : true
        );
        setProfilePicUrl(data.profilePic || "");
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("Couldn't load your profile. Please go back and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handlePickImage = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewImageFile(file);
    setNewImagePreview(URL.createObjectURL(file));
  };

  const toggleInterest = (label) => {
    setInterests((prev) =>
      prev.includes(label)
        ? prev.filter((i) => i !== label)
        : [...prev, label]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      // 1. Upload the new profile picture first, if one was picked.
      // NOTE: your other calls in this app (e.g. Profile.jsx) hit routes
      // like "/users/profile/me" with no "/api" prefix — presumably
      // because your axios instance's baseURL already includes it.
      // The endpoints below are written exactly as requested
      // ("/api/users/profilePic" and "/api/users/profile"). If that
      // gives you a doubled-up "/api/api/..." URL against your baseURL,
      // just drop the leading "/api" here to match the rest of the app.
      if (newImageFile) {
        const formData = new FormData();
        formData.append("profilePic", newImageFile);

        // Don't set Content-Type manually here — FormData needs axios/the
        // browser to generate it (it includes a boundary string the
        // server needs to parse the multipart body). Setting it by hand
        // was the bug: the request went out without a valid boundary, so
        // the server silently couldn't read the file, while the rest of
        // the save still succeeded.
        API.post("/users/profilePic", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      // 2. Update the rest of the profile fields.
      await API.put(
        "/api/users/profile",
        {
          username,
          bio,
          location,
          travelStyle,
          interests,
          openToChat,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // 3. Go back to the profile page — Profile.jsx fetches fresh data
      // on mount, so navigating there re-runs that fetch automatically.
      navigate("/profile");
    } catch (err) {
      console.error("Failed to save profile:", err);
      setError("Something went wrong while saving. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0714] flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  const avatarSrc =
    newImagePreview ||
    profilePicUrl ||
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80";

  return (
    <div className="min-h-screen bg-[#0a0714] text-white px-4 pt-6 pb-28 max-w-md mx-auto">
      {/* Top bar */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
        >
          <FaArrowLeft className="text-sm" />
        </button>
        <h1 className="text-lg font-bold">Edit Profile</h1>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Profile picture */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <div
            className="w-[130px] h-[130px] rounded-full p-[3px]"
            style={{
              background: "linear-gradient(135deg, #f472b6, #a855f7, #6d28d9)",
            }}
          >
            <img
              src={avatarSrc}
              alt="Profile"
              className="w-full h-full rounded-full object-cover border-2 border-[#0a0714]"
            />
          </div>
          <button
            onClick={handlePickImage}
            className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-fuchsia-500 border-2 border-[#0a0714] flex items-center justify-center text-white hover:bg-fuchsia-400 transition-colors"
            title="Change photo"
          >
            <FaCamera className="text-sm" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
        <button
          onClick={handlePickImage}
          className="mt-3 text-xs text-fuchsia-300 hover:text-fuchsia-200 transition-colors"
        >
          Change profile photo
        </button>
      </div>

      {/* Form fields */}
      <div className="space-y-5">
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">
            Username
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your username"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-fuchsia-400/60 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell people about your travels..."
            rows={3}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-fuchsia-400/60 transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">
            Location
          </label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, Country"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-fuchsia-400/60 transition-colors"
          />
        </div>

        {/* Travel style — single select */}
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold mb-2.5">
            <FaCompass className="text-fuchsia-400" />
            Travel Style
          </div>
          <div className="flex flex-wrap gap-2">
            {travelStyleOptions.map((option) => {
              const isSelected = travelStyle === option;
              return (
                <button
                  key={option}
                  onClick={() => setTravelStyle(option)}
                  className={`px-3.5 py-2 rounded-full text-xs font-medium border transition-colors ${
                    isSelected
                      ? "border-fuchsia-400/60 bg-fuchsia-500/20 text-fuchsia-200"
                      : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interests — multi select */}
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold mb-2.5">
            <FaHiking className="text-pink-400" />
            Interests
          </div>
          <div className="flex flex-wrap gap-2">
            {interestOptions.map(({ label, icon: Icon }) => {
              const isSelected = interests.includes(label);
              return (
                <button
                  key={label}
                  onClick={() => toggleInterest(label)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium border transition-colors ${
                    isSelected
                      ? "border-fuchsia-400/60 bg-fuchsia-500/20 text-fuchsia-200"
                      : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                  }`}
                >
                  <Icon className={isSelected ? "text-fuchsia-300" : "text-white/40"} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Open to chat toggle */}
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5">
          <div>
            <p className="text-sm font-medium">Open To Chat</p>
            <p className="text-xs text-white/40 mt-0.5">
              Let other travellers message you
            </p>
          </div>
          <button
            onClick={() => setOpenToChat((prev) => !prev)}
            className={`relative w-12 h-7 rounded-full transition-colors ${
              openToChat ? "bg-fuchsia-500" : "bg-white/15"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white transition-transform ${
                openToChat ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full mt-8 py-3.5 rounded-2xl text-sm font-semibold text-white transition-opacity disabled:opacity-60"
        style={{
          background: "linear-gradient(90deg, #f472b6, #a855f7, #6d28d9)",
          boxShadow: "0 0 30px rgba(217,70,239,0.25)",
        }}
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

export default EditProfile;