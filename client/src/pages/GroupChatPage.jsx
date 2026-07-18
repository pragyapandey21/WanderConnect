import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../socket";

const API = "http://localhost:5000/api/group-messages";

// ── Static mock data (design only) ──────────────────────────────────────────
const MOCK_MESSAGES = [
  {
    _id: "1",
    sender: { _id: "rahul", username: "Rahul Sharma", avatar: "https://i.pravatar.cc/40?img=8", color: "#a855f7" },
    text: "Hey everyone! 👋\nHow's the plan for tonight?",
    createdAt: "2024-07-12T11:45:00Z",
    mine: false,
  },
  {
    _id: "2",
    sender: { _id: "me", username: "Me" },
    text: "I was thinking we could explore Anjuna Beach and have dinner there.",
    createdAt: "2024-07-12T11:46:00Z",
    mine: true,
  },
  {
    _id: "3",
    sender: { _id: "priya", username: "Priya Mehta", avatar: "https://i.pravatar.cc/40?img=47", color: "#ec4899" },
    text: "Sounds amazing! 😍\nI'm in!",
    createdAt: "2024-07-12T11:47:00Z",
    mine: false,
  },
  {
    _id: "4",
    sender: { _id: "me", username: "Me" },
    text: "Perfect! Let's meet by 5 PM then.\n🏖️",
    createdAt: "2024-07-12T11:48:00Z",
    mine: true,
  },
  {
    _id: "5",
    sender: { _id: "arjun", username: "Arjun Verma", avatar: "https://i.pravatar.cc/40?img=15", color: "#60a5fa" },
    text: "Don't forget your swimsuits! 👙🌊",
    createdAt: "2024-07-12T12:10:00Z",
    mine: false,
    isNew: true,
  },
  {
    _id: "6",
    sender: { _id: "neha", username: "Neha Kapoor", avatar: "https://i.pravatar.cc/40?img=44", color: "#fbbf24" },
    text: "Yesss! Can't wait! 🎉",
    createdAt: "2024-07-12T12:12:00Z",
    mine: false,
  },
  {
    _id: "7",
    sender: { _id: "me", username: "Me" },
    text: "See you all there! 🌴✨",
    createdAt: "2024-07-12T12:15:00Z",
    mine: true,
  },
];

function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function GroupChatPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || '{"_id":"me"}');

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typingUser, setTypingUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState(null);

  const bottomRef = useRef(null);

  const authHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const fetchGroup = async () => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/groups/group/${groupId}`,
      authHeaders()
    );

    setGroup(res.data);
  } catch (err) {
    console.log(err);
  }
};

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API}/${groupId}`, authHeaders());
      setMessages(res.data);
    } catch (err) {
      console.log(err);
      // Fallback to mock data for design preview
      setMessages(MOCK_MESSAGES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  fetchGroup();
  fetchMessages();
  socket.emit("join-group", groupId);

  const handleIncomingMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  socket.on("receive-group-message", handleIncomingMessage);

  return () => {
    socket.off("receive-group-message", handleIncomingMessage);
  };
}, [groupId]); 
useEffect(() => {
  const handleTyping = (username) => {
    console.log("Received typing:", username);
    setTypingUser(username);
  };

  const handleStopTyping = () => {
    setTypingUser("");
  };

  socket.on("group-typing", handleTyping);
  socket.on("group-stop-typing", handleStopTyping);

  return () => {
    socket.off("group-typing", handleTyping);
    socket.off("group-stop-typing", handleStopTyping);
  };
}, []);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
  if (!text.trim()) return;
  socket.emit("send-group-message", {
    groupId,
    senderId: user._id,
    text: text.trim(),
  });
  setText("");
};
  // Track if "New Messages" divider has been shown
  let shownNewDivider = false;

  return (
    <div style={{
      background: "#0B0B14",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      color: "white",
      fontFamily: "'Inter', sans-serif",
      maxWidth: 430,
      margin: "0 auto",
    }}>

      {/* ── Header ── */}
      <div style={{
        padding: "14px 16px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: "#0B0B14",
      }}>
        {/* Back */}
        <button onClick={() => navigate(-1)} style={{
          background: "none", border: "none", color: "#a855f7",
          fontSize: 22, cursor: "pointer", padding: 0, lineHeight: 1,
        }}>←</button>

        {/* Group avatar */}
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=80&q=80"
          alt="group"
          style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
        />

        {/* Name + status */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.2 }}>
  🌴 {group?.groupName || "Loading..."}
</div>
          <div
  style={{
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
    display: "flex",
    alignItems: "center",
    gap: 5,
  }}
>
  <span
    style={{
      width: 7,
      height: 7,
      borderRadius: "50%",
      background: "#22c55e",
      display: "inline-block",
    }}
  />
  👥 {group?.members?.length || 0}/{group?.maxMembers || 0} Members
</div>
        </div>

        {/* Icons */}
        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          <span style={{ fontSize: 20, color: "#a855f7", cursor: "pointer" }}>📞</span>
          <span style={{ fontSize: 20, color: "#fff", cursor: "pointer", fontWeight: 900 }}>⋮</span>
        </div>
      </div>

      {/* ── Group Info Banner ── */}
      {group && (
        <div style={{
          margin: "10px 14px 0",
          padding: "12px 16px",
          borderRadius: 14,
          background: "#171726",
          border: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>📍 {group.destination}</div>
            {group.description && (
              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{group.description}</div>
            )}
          </div>
          <div style={{ fontSize: 12, color: "#9ca3af", textAlign: "right" }}>
            <div>📅 {new Date(group.startDate).toLocaleDateString()}</div>
          </div>
        </div>
      )}

      {/* ── Pinned Message ── */}
      <div style={{
        margin: "10px 14px 4px",
        background: "#16142a",
        border: "1px solid rgba(168,85,247,0.25)",
        borderRadius: 14,
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}>
        <span style={{ fontSize: 18, flexShrink: 0 }}>📌</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#a855f7", marginBottom: 2 }}>Pinned Message</div>
          <div style={{ fontSize: 13, color: "#e5e7eb" }}>Let's meet at Baga Beach tomorrow at 5 PM 🏔️</div>
        </div>
        <span style={{ color: "#a855f7", fontSize: 16, flexShrink: 0 }}>›</span>
      </div>

      {/* ── Messages ── */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        paddingBottom: 120,
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}>

        {/* Date divider */}
        <div style={{ display: "flex", justifyContent: "center", margin: "4px 0 8px" }}>
          <span style={{
            background: "#1e1e30", color: "#9ca3af",
            fontSize: 11, fontWeight: 600,
            padding: "4px 14px", borderRadius: 50,
          }}>Today</span>
        </div>

        {loading ? (
          <h3 style={{ textAlign: "center", color: "#9ca3af" }}>Loading...</h3>
        ) : (
          messages.map((msg, idx) => {
            const mine = msg.mine ?? msg.sender._id === user._id;

            // New Messages divider
            let divider = null;
            if (msg.isNew && !shownNewDivider) {
              shownNewDivider = true;
              divider = (
                <div key={`divider-${idx}`} style={{
                  display: "flex", alignItems: "center", gap: 10, margin: "8px 0",
                }}>
                  <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, #ec4899)" }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#ec4899" }}>New Messages</span>
                  <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, #ec4899, transparent)" }} />
                </div>
              );
            }

            return (
              <React.Fragment key={msg._id}>
                {divider}
                <div style={{
                  display: "flex",
                  flexDirection: mine ? "row-reverse" : "row",
                  alignItems: "flex-end",
                  gap: 8,
                }}>
                  {/* Avatar for others */}
                  {!mine && (
                    <img
                      src={msg.sender.avatar || `https://i.pravatar.cc/40?u=${msg.sender._id}`}
                      alt={msg.sender.username}
                      style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", flexShrink: 0, marginBottom: 18 }}
                    />
                  )}

                  <div style={{ maxWidth: "72%", display: "flex", flexDirection: "column", alignItems: mine ? "flex-end" : "flex-start" }}>
                    {/* Sender name */}
                    {!mine && (
                      <div style={{
                        fontSize: 12, fontWeight: 700,
                        color: msg.sender.color || "#a855f7",
                        marginBottom: 3,
                      }}>
                        {msg.sender.username}
                      </div>
                    )}

                    {/* Bubble */}
                    <div style={{
                      background: mine
                        ? "linear-gradient(135deg, #8b5cf6, #ec4899)"
                        : "#1c1b2e",
                      padding: "10px 14px",
                      borderRadius: mine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      fontSize: 14,
                      lineHeight: 1.5,
                      color: "#fff",
                      whiteSpace: "pre-wrap",
                    }}>
                      {msg.text}
                    </div>

                    {/* Time + ticks */}
                    <div style={{
                      fontSize: 10, color: "#6b7280",
                      marginTop: 3,
                      display: "flex", alignItems: "center", gap: 3,
                      flexDirection: mine ? "row-reverse" : "row",
                    }}>
                      <span>{fmtTime(msg.createdAt)}</span>
                      {mine && (
  <span style={{ color: "#a855f7", fontSize: 12 }}>
    {msg.readBy?.length > 1 ? "✓✓" : "✓"}
  </span>
)}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })
        )}

        <div ref={bottomRef} />
      </div>

      <h1 style={{ color: "red" }}>
  {typingUser}
</h1>
      {typingUser && (
  <div
    style={{
      color: "#a855f7",
      fontSize: 13,
      marginBottom: 8,
      fontStyle: "italic",
      paddingLeft: 6,
    }}
  >
    {typingUser} is typing...
  </div>
)}

      {/* ── Input Bar ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px 105px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "#0B0B14",
      }}>
        
        {/* + button */}
        <button style={{
          width: 42, height: 42, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
          border: "none", color: "#fff", fontSize: 22, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>+</button>

        {/* Text input */}
        <div style={{
          flex: 1, display: "flex", alignItems: "center",
          background: "#1a1a2e", borderRadius: 30,
          padding: "0 14px", gap: 10,
        }}>
          <input
            value={text}
            onChange={(e) => {
  setText(e.target.value);

  socket.emit("group-typing", {
    groupId,
    username: user.username,
  });

  clearTimeout(window.typingTimeout);

  window.typingTimeout = setTimeout(() => {
    socket.emit("group-stop-typing", {
      groupId,
    });
  }, 1000);
}}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            style={{
              flex: 1, border: "none", outline: "none",
              background: "transparent", color: "#fff",
              fontSize: 14, padding: "12px 0",
            }}
          />
          <span style={{ fontSize: 20, color: "#6b7280", cursor: "pointer" }}>🙂</span>
          <span style={{ fontSize: 20, color: "#6b7280", cursor: "pointer" }}>📷</span>
        </div>

        {/* Mic / Send button */}
        <button onClick={sendMessage} style={{
          width: 46, height: 46, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
          border: "none", color: "#fff", fontSize: 20, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>🎤</button>
      </div>

    </div>
  );
}

export default GroupChatPage;