import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const typeColors = {
  "Solo Traveler": "#a78bfa",
  Backpacker: "#a78bfa",
  Photographer: "#a78bfa",
};

const filters = [
  { label: "All Travelers", icon: "👥" },
  { label: "Solo", icon: "🧍" },
  { label: "Backpacker", icon: "🎒" },
  { label: "Photographer", icon: "📷" },
  { label: "Writer", icon: "✍️" },
];

const TravelersPage = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const { name } = useParams();
  const destination = name || "Goa";

  const [travelers, setTravelers] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All Travelers");
  const [search, setSearch] = useState("");
  const [connectedUsers, setConnectedUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTravelers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/users/travelers/${name}`
        );
        setTravelers(res.data);
        const token = localStorage.getItem("token");
console.log("TOKEN:", token);
const profileRes = await axios.get(
  "http://localhost:5000/api/auth/profile",
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

setConnectedUsers(
  profileRes.data.following.map((user) => user._id)
);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTravelers();
  }, [name]);

  const handleConnect = async (userId) => {
  try {
    const token = localStorage.getItem("token");

    if (connectedUsers.includes(userId)) {
      // Unfollow
      await axios.put(
        `http://localhost:5000/api/users/unfollow/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setConnectedUsers(
        connectedUsers.filter((id) => id !== userId)
      );
    } else {
      // Follow
      await axios.put(
        `http://localhost:5000/api/users/${userId}/follow`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setConnectedUsers([...connectedUsers, userId]);
    }
  } catch (error) {
    console.log(error.response?.data);
  }
};
  const filtered = travelers.filter((t) => {
    const matchesFilter =
      activeFilter === "All Travelers" ||
      (t.travelStyle || "").includes(activeFilter);
    const matchesSearch =
      (t.username || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.location || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.interests || []).some((i) =>
        i.toLowerCase().includes(search.toLowerCase())
      );
    return matchesFilter && matchesSearch;
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a1a",
        color: "#fff",
        fontFamily: "'Inter', sans-serif",
        maxWidth: 430,
        margin: "0 auto",
        position: "relative",
        paddingBottom: 100,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 20px 0",
        }}
      >
        <button
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#fff",
            fontSize: 18,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ←
        </button>
        <button
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#fff",
            fontSize: 16,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ⚙️
        </button>
      </div>

      {/* Title */}
      <div style={{ padding: "18px 20px 0" }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>
          Find Travelers
        </h1>
        <p style={{ color: "#9ca3af", marginTop: 6, fontSize: 15 }}>
          Connect with people exploring{" "}
          <span style={{ color: "#ec4899", fontWeight: 600 }}>{destination}</span>{" "}
          🌴
        </p>
      </div>

      {/* Live Count Banner */}
      <div
        style={{
          margin: "16px 20px 0",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 16,
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex" }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: "2px solid #0a0a1a",
                  marginLeft: i === 0 ? 0 : -10,
                  background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
                  overflow: "hidden",
                  zIndex: 3 - i,
                  position: "relative",
                }}
              >
                {travelers[i]?.profilePic && (
                  <img
                    src={travelers[i].profilePic}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                )}
              </div>
            ))}
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>
              {travelers.length > 0 ? `${travelers.length}+ travelers available` : "Loading travelers..."}
            </p>
            <p style={{ margin: 0, fontSize: 12, color: "#9ca3af" }}>
              in {destination} right now
            </p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#22c55e",
              boxShadow: "0 0 6px #22c55e",
            }}
          />
          <span style={{ color: "#22c55e", fontSize: 13, fontWeight: 600 }}>
            Live
          </span>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: "14px 20px 0" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 999,
            padding: "12px 18px",
          }}
        >
          <span style={{ fontSize: 16, opacity: 0.5 }}>🔍</span>
          <input
            type="text"
            placeholder="Search by name, city or interest..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#fff",
              fontSize: 14,
              width: "100%",
            }}
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div
        style={{
          display: "flex",
          gap: 10,
          padding: "14px 20px 0",
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
      >
        {filters.map((f) => {
          const active = activeFilter === f.label;
          return (
            <button
              key={f.label}
              onClick={() => setActiveFilter(f.label)}
              style={{
                whiteSpace: "nowrap",
                padding: "9px 16px",
                borderRadius: 999,
                border: active ? "none" : "1px solid rgba(255,255,255,0.12)",
                background: active
                  ? "linear-gradient(135deg, #ec4899, #8b5cf6)"
                  : "rgba(255,255,255,0.06)",
                color: "#fff",
                fontSize: 13,
                fontWeight: active ? 700 : 400,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>{f.icon}</span>
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Traveler Cards */}
      <div style={{ padding: "16px 20px 0", display: "flex", flexDirection: "column", gap: 14 }}>
        {filtered.length === 0 && (
          <p style={{ color: "#6b7280", textAlign: "center", marginTop: 40 }}>
            No travelers found.
          </p>
        )}
        {filtered.map((traveler) => (
          <div
            key={traveler._id}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 20,
              padding: "14px",
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
            }}
          >
            {/* Avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
                  padding: 2,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    overflow: "hidden",
                    background: "#1e1e2e",
                  }}
                >
                  <img
                    src={traveler.profilePic || "/images/default-avatar.png"}
                    alt={traveler.username}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                </div>
              </div>
              {traveler.online && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 2,
                    right: 2,
                    width: 13,
                    height: 13,
                    borderRadius: "50%",
                    background: "#22c55e",
                    border: "2px solid #0a0a1a",
                    boxShadow: "0 0 6px #22c55e",
                  }}
                />
              )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>
                  {traveler.username}
                </h2>
                {traveler.openToChat && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      background: "rgba(236,72,153,0.15)",
                      border: "1px solid rgba(236,72,153,0.3)",
                      borderRadius: 999,
                      padding: "2px 10px",
                      fontSize: 11,
                      color: "#ec4899",
                      fontWeight: 600,
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#ec4899",
                        display: "inline-block",
                      }}
                    />
                    Open To Chat
                  </span>
                )}
              </div>

              <p
                style={{
                  margin: "3px 0 0",
                  fontSize: 13,
                  color: typeColors[traveler.travelStyle] || "#a78bfa",
                  fontWeight: 600,
                }}
              >
                {traveler.travelStyle || "Traveler"}
              </p>
              <p style={{ margin: "3px 0 0", fontSize: 12, color: "#6b7280" }}>
                📍 {traveler.location || "Unknown"}
              </p>

              {/* Interest tags */}
              <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                {(traveler.interests || []).slice(0, 2).map((interest, i) => (
                  <span
                    key={i}
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 999,
                      padding: "3px 10px",
                      fontSize: 11,
                      color: "#d1d5db",
                    }}
                  >
                    {interest}
                  </span>
                ))}
                {(traveler.interests || []).length > 2 && (
                  <span
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 999,
                      padding: "3px 10px",
                      fontSize: 11,
                      color: "#9ca3af",
                    }}
                  >
                    +{traveler.interests.length - 2}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                flexShrink: 0,
              }}
            >
              <button
  onClick={() => handleConnect(traveler._id)}
  disabled={traveler._id === currentUser._id}
  style={{
    padding: "10px 20px",
    borderRadius: 999,
    background: connectedUsers.includes(traveler._id)
      ? "#16a34a"
      : traveler._id === currentUser._id
      ? "#6b7280"
      : "linear-gradient(135deg, #ec4899, #8b5cf6)",
    border: "none",
    color: "#fff",
    fontWeight: 700,
    fontSize: 14,
    cursor:
  traveler._id === currentUser._id
    ? "not-allowed"
    : "pointer",
    whiteSpace: "nowrap",
  }}
>
  {traveler._id === currentUser._id
  ? "You"
  : connectedUsers.includes(traveler._id)
  ? "Unfollow"
  : "Connect"}
</button>
              <button
  onClick={() => navigate(`/chat/${traveler._id}`)}
  style={{
    background: "none",
    border: "none",
    color: "#9ca3af",
    fontSize: 12,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 4,
  }}
>
  💬 Say Hi
</button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Trip Group CTA */}
      <div
        style={{
          position: "fixed",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          width: "calc(100% - 40px)",
          maxWidth: 390,
          zIndex: 50,
        }}
      >
        <button
          style={{
            width: "100%",
            padding: "18px 0",
            borderRadius: 999,
            background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
            border: "none",
            color: "#fff",
            fontWeight: 700,
            fontSize: 16,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            boxShadow: "0 8px 30px rgba(236,72,153,0.4)",
          }}
        >
          <span style={{ fontSize: 20 }}>👥</span>
          Create Trip Group
        </button>
      </div>
    </div>
  );
};

export default TravelersPage;