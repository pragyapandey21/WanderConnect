import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CreateGroupModal from "../components/CreateGroupModal";


function TripGroupsPage() {
  const { destination } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
  const dest = destination || "Goa";
  
  const [groups, setGroups] = useState([]);
const [loading, setLoading] = useState(true);

const [showCreateModal, setShowCreateModal] = useState(false);



const fetchGroups = async () => {
  try {
    const res = await axios.get(
      `https://wanderconnect.onrender.com/api/groups/${dest}`
    );

    setGroups(res.data);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchGroups();
}, [dest]);

const joinGroup = async (groupId) => {
  try {
    await axios.put(
      `https://wanderconnect.onrender.com/api/groups/${groupId}/join`,
      {},
      authHeaders()
    );

    // Refresh the groups after joining
    fetchGroups();

  } catch (error) {
    alert(error.response?.data?.message || "Failed to join group");
  }
};

const leaveGroup = async (groupId) => {
  try {
    await axios.put(
      `https://wanderconnect.onrender.com/api/groups/${groupId}/leave`,
      {},
      authHeaders()
    );

    fetchGroups();
  } catch (error) {
    alert(error.response?.data?.message || "Failed to leave group");
  }
};

const deleteGroup = async (groupId) => {
  try {
    await axios.delete(
      `https://wanderconnect.onrender.com/api/groups/${groupId}`,
      authHeaders()
    );

    fetchGroups();

  } catch (error) {
    alert(error.response?.data?.message || "Failed to delete group");
  }
};

  return (
    <div style={{ minHeight: "100vh", background: "#0B0B14", color: "#fff", display: "flex", justifyContent: "center", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 430, minHeight: "100vh", position: "relative", paddingBottom: 100 }}>

        {/* Header */}
        <div style={{ padding: "52px 20px 12px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <button
  onClick={() => navigate(-1)}
  style={{
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: 20,
    cursor: "pointer",
    padding: 0,
    lineHeight: 1
  }}
>
  ←
</button>
          <button style={{ background: "none", border: "none", color: "#fff", fontSize: 20, cursor: "pointer", padding: 0 }}>⚙</button>
        </div>

        <div style={{ padding: "0 20px 16px" }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>
            {dest} Trip Groups 🌴
          </h1>
          <p style={{ fontSize: 14, color: "#9ca3af", margin: "4px 0 0" }}>Find people travelling together</p>
        </div>

        {/* Hero Banner */}
        <div style={{ margin: "0 16px 24px", borderRadius: 24, overflow: "hidden", position: "relative", background: "#1a0a2e" }}>
          {/* Sunset Beach BG */}
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"
            alt="Goa Beach"
            style={{ width: "100%", height: 220, objectFit: "cover", display: "block", filter: "brightness(0.55) saturate(1.3)" }}
          />

          {/* Purple overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg, rgba(90,20,150,0.7) 0%, rgba(180,30,100,0.3) 60%, transparent 100%)"
          }} />

          {/* Active Groups Pill */}
          <div style={{
            position: "absolute", top: 14, right: 14,
            background: "rgba(20,10,30,0.75)", backdropFilter: "blur(8px)",
            borderRadius: 50, padding: "6px 14px",
            display: "flex", alignItems: "center", gap: 6,
            fontSize: 13, fontWeight: 600, color: "#fff",
            border: "1px solid rgba(255,255,255,0.15)"
          }}>
            <span style={{ fontSize: 15 }}>👥</span> {groups.length} Active Groups
          </div>

          {/* Script Title */}
          <div style={{ position: "absolute", bottom: 70, left: 18 }}>
            <div style={{
              fontFamily: "'Dancing Script', 'Pacifico', cursive",
              fontSize: 52, fontWeight: 700, lineHeight: 1,
              background: "linear-gradient(90deg, #e879f9, #fb7185)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 20px rgba(232,121,249,0.5))"
            }}>
              Goa
            </div>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>
              Explore beaches, parties<br />
              and amazing vibes<br />
              with new people. 💗
            </p>
          </div>

          {/* Stats Row */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: "rgba(10,5,20,0.85)", backdropFilter: "blur(10px)",
            display: "flex", justifyContent: "space-around", padding: "12px 10px",
          }}>
            {[
  {
    icon: "👥",
    value: groups.length,
    label: "Active Groups",
  },
  {
    icon: "🙋",
    value: groups.reduce(
      (total, group) => total + group.members.length,
      0
    ),
    label: "Members",
  },
  {
    icon: "📍",
    value: destination,
    label: "Destination",
  },
].map((s, i) => (
              <div key={i} style={{ textAlign: "center", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 22 }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Groups Section */}
        <div style={{ padding: "0 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Popular Groups</h2>
            <button style={{ background: "none", border: "none", color: "#a855f7", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
              See all →
            </button>
          </div>
{/* Group Cards */}
<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
  {loading ? (
    <h2
      style={{
        color: "white",
        textAlign: "center",
        marginTop: 40,
      }}
    >
      Loading...
    </h2>
  ) : groups.length === 0 ? (
    <h2
      style={{
        color: "#9ca3af",
        textAlign: "center",
        marginTop: 40,
      }}
    >
      No Trip Groups Found
    </h2>
  ) : (
    groups.map((group) => (
      
      <div
        key={group._id}
        style={{
          background: "#171726",
          borderRadius: 18,
          padding: 18,
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  }}
>
  <h2
    style={{
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
      margin: 0,
    }}
  >
    🌴 {group.groupName}
  </h2>

  {(group.members.some((m) => m._id === user._id) ||
    group.createdBy._id === user._id) && (
    <button
      onClick={() => navigate(`/group-chat/${group._id}`)}
      style={{
        background: "rgba(168,85,247,0.15)",
        border: "1px solid rgba(168,85,247,0.4)",
        width: 38,
        height: 38,
        borderRadius: "50%",
        cursor: "pointer",
        color: "#a855f7",
        fontSize: 18,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "0.2s",
      }}
    >
      💬
    </button>
  )}
</div>

        <p
          style={{
            color: "#bdbdbd",
            fontSize: 13,
            marginBottom: 10,
          }}
        >
          {group.description}
        </p>

        <p style={{ color: "#ddd", fontSize: 13 }}>
          👤 Host : {group.createdBy.username}
        </p>

        <p style={{ color: "#ddd", fontSize: 13 }}>
          👥 Members : {group.members.length}/{group.maxMembers}
        </p>

        <p style={{ color: "#ddd", fontSize: 13 }}>
          📅 {new Date(group.startDate).toLocaleDateString()} -{" "}
          {new Date(group.endDate).toLocaleDateString()}
        </p>
{group.createdBy._id === user._id ? (
  <button
    onClick={() => deleteGroup(group._id)}
    style={{
      marginTop: 15,
      width: "100%",
      padding: "12px",
      borderRadius: 12,
      border: "none",
      background: "#dc2626",
      color: "white",
      fontWeight: "bold",
      cursor: "pointer",
    }}
  >
    🗑 Delete Group
  </button>
) : (
  <button
    onClick={() => {
      if (group.members.some((member) => member._id === user._id)) {
        leaveGroup(group._id);
      } else {
        joinGroup(group._id);
      }
    }}
    style={{
      marginTop: 15,
      width: "100%",
      padding: "12px",
      borderRadius: 12,
      border: "none",
      cursor: "pointer",
      fontWeight: "bold",
      color: "white",
      background: group.members.some((member) => member._id === user._id)
        ? "#ef4444"
        : "linear-gradient(135deg,#8b5cf6,#ec4899)",
    }}
  >
    {group.members.some((member) => member._id === user._id)
      ? "Leave Group"
      : "Join Group"}
  </button>
)}
      </div>
    ))
          )}
          </div>
        </div>
        

        {/* Bottom Banner + FAB */}
        <div style={{
          position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: "100%", maxWidth: 430,
          background: "rgba(11,11,20,0.95)", backdropFilter: "blur(10px)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          padding: "14px 20px 28px",
          display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 26 }}>👥</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Can't find a group?</div>
              <div style={{ fontSize: 12, color: "#9ca3af" }}>Create your own trip group!</div>
            </div>
          </div>
          <button
  onClick={() => setShowCreateModal(true)}
  style={{
    width: 52,
    height: 52,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#a855f7,#ec4899)",
    border: "none",
    color: "#fff",
    fontSize: 26,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 20px rgba(168,85,247,0.5)",
  }}
>
  +
</button>
        </div>
        <CreateGroupModal
  open={showCreateModal}
  onClose={() => setShowCreateModal(false)}
  destination={dest}
  fetchGroups={fetchGroups}
/>

        {/* Google Fonts for cursive */}
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap" rel="stylesheet" />
      </div>
    </div>
  );
}

export default TripGroupsPage;