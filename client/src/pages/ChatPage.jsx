import { useState, useEffect, useRef, useCallback } from "react";
import socket from "../socket";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// ── Constants ────────────────────────────────────────────────────────────────
const API = "http://localhost:5000/api/messages";
const REACTIONS = ["❤️", "😂", "😍", "👍", "😮", "😢"];

// ── Helpers ──────────────────────────────────────────────────────────────────
const formatTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatLastSeen = (iso) => {
  if (!iso) return "Offline";
  const d   = new Date(iso);
  const now = new Date();
  const diff = (now - d) / 1000; // seconds

  if (diff < 60)  return "Last seen just now";
  if (diff < 3600) return `Last seen ${Math.floor(diff / 60)}m ago`;

  const isToday = d.toDateString() === now.toDateString();
  const timeStr = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return isToday
    ? `Last seen today at ${timeStr}`
    : `Last seen ${d.toLocaleDateString([], { month: "short", day: "numeric" })} at ${timeStr}`;
};

// ── Axios helper with auth header ────────────────────────────────────────────
const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

// ── Date separator label ──────────────────────────────────────────────────────
// Returns "Today", "Yesterday", or "Mon, Jun 12" for a given ISO string.
const getDateLabel = (iso) => {
  if (!iso) return "";
  const d   = new Date(iso);
  const now = new Date();
  const today     = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today - 86400000);
  const msgDay    = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  if (msgDay.getTime() === today.getTime())     return "Today";
  if (msgDay.getTime() === yesterday.getTime()) return "Yesterday";
  return d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
};

// ── ChatPage ─────────────────────────────────────────────────────────────────
function ChatPage() {
  const { id }      = useParams();   // other user's ID
  const navigate    = useNavigate();
  const user        = JSON.parse(localStorage.getItem("user"));

  // ── Core state ──────────────────────────────────────────────────────────────
  const [messages,       setMessages]       = useState([]);
  const [text,           setText]           = useState("");
  const [typing,         setTyping]         = useState(false);
  const [onlineUsers,    setOnlineUsers]    = useState([]);
  const [lastSeen,       setLastSeen]       = useState(null);
  const [notifCount,     setNotifCount]     = useState(0);
  const [chatUser, setChatUser] = useState(null);

  // ── Message actions state ────────────────────────────────────────────────────
  const [replyTo,        setReplyTo]        = useState(null);   // message object
  const [editingMsg,     setEditingMsg]     = useState(null);   // message object
  const [contextMenu,    setContextMenu]    = useState(null);   // { msgId, x, y }
  const [reactionMenu,   setReactionMenu]   = useState(null);   // msgId
  const [searchQuery,    setSearchQuery]    = useState("");
  const [searchResults,  setSearchResults]  = useState([]);
  const [showSearch,     setShowSearch]     = useState(false);

  const bottomRef          = useRef(null);
  const inputRef           = useRef(null);
  const typingTimer        = useRef(null);
  const isTyping           = useRef(false);
  const scrollContainerRef = useRef(null); // ref on the scrollable message list
  const initialLoadDone    = useRef(false); // tracks whether the first fetch for this chat is complete

  // ── Derived ─────────────────────────────────────────────────────────────────
  const otherOnline = onlineUsers.includes(id);

  // ── Fetch conversation ───────────────────────────────────────────────────────
  const fetchMessages = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/${id}`, authHeaders());
      initialLoadDone.current = false; // next messages render = initial load, snap to bottom
      setMessages(res.data);
    } catch (e) {
      console.error("fetchMessages:", e.message);
    }
  }, [id]);

  const fetchChatUser = useCallback(async () => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/users/${id}`,
      authHeaders()
    );

    setChatUser(res.data);
  } catch (e) {
    console.error("fetchChatUser:", e.message);
  }
}, [id]);

  // ── Mark as read + notify sender ─────────────────────────────────────────────
  // FIX: The HTTP call now triggers the socket emit server-side,
  // so we don't emit "messages_seen" from the client at all.
  // This eliminates the stale-closure bug where the event fired
  // before the DB write completed.
  const markAsRead = useCallback(async () => {
    try {
      await axios.put(`${API}/read/${id}`, {}, authHeaders());
      // Update our own local message state so read:true shows immediately
      setMessages(prev =>
        prev.map(m =>
          m.sender === id && !m.read ? { ...m, read: true, delivered: true } : m
        )
      );
    } catch (e) {
      console.error("markAsRead:", e.message);
    }
  }, [id]);

  // ── Join socket room once ────────────────────────────────────────────────────
  useEffect(() => {
    if (user?._id) {
      socket.emit("join", user._id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  // ── Load conversation + mark read when chat partner changes ─────────────────
  useEffect(() => {
    setMessages([]);
    setReplyTo(null);
    setEditingMsg(null);
    setShowSearch(false);
    setSearchQuery("");
    fetchChatUser();
    fetchMessages().then(() => markAsRead());
  }, [id, fetchMessages, markAsRead]);

  // ── Socket event listeners ───────────────────────────────────────────────────
  useEffect(() => {
    // ── Receive new message ─────────────────────────────────────────────────
    const onReceiveMessage = (message) => {
      setMessages(prev => {
        // Prevent duplicate if we already have this message (sent by us via HTTP)
        if (prev.some(m => m._id === message._id)) return prev;
        return [...prev, message];
      });

      // If this message is from our current chat partner, mark it read immediately
      if (message.sender === id) {
        // Small delay to let state settle, then mark read
        setTimeout(() => markAsRead(), 100);
      }
    };

    // ── Sender sees ✓✓ Seen ────────────────────────────────────────────────
    // FIX: Instead of re-fetching from the network (which caused the refresh bug),
    // we update msg.read = true locally in state. This is instant and correct.
    const onMessagesSeen = ({ conversationWith }) => {
      setMessages(prev =>
        prev.map(m =>
          m.receiver === conversationWith || m.receiver === id
            ? { ...m, read: true }
            : m
        )
      );
    };

    // ── Delivered status ────────────────────────────────────────────────────
    const onMessageDelivered = ({ messageId }) => {
      setMessages(prev =>
        prev.map(m => m._id === messageId ? { ...m, delivered: true } : m)
      );
    };

    // ── Reactions ───────────────────────────────────────────────────────────
    const onMessageReaction = ({ messageId, reactions }) => {
      setMessages(prev =>
        prev.map(m => m._id === messageId ? { ...m, reactions } : m)
      );
    };

    // ── Delete for everyone ─────────────────────────────────────────────────
    const onMessageDeleted = ({ messageId, deletedForEveryone }) => {
      if (deletedForEveryone) {
        setMessages(prev =>
          prev.map(m =>
            m._id === messageId
              ? { ...m, text: "", deletedForEveryone: true }
              : m
          )
        );
      }
    };

    // ── Edit message ────────────────────────────────────────────────────────
    const onMessageEdited = ({ messageId, text, edited }) => {
      setMessages(prev =>
        prev.map(m => m._id === messageId ? { ...m, text, edited } : m)
      );
    };

    // ── Online users ────────────────────────────────────────────────────────
    const onOnlineUsers = (users) => setOnlineUsers(users);

    // ── Last seen ───────────────────────────────────────────────────────────
    const onUserLastSeen = ({ userId, lastSeen: ls }) => {
      if (userId === id) setLastSeen(ls);
    };

    // ── Typing ──────────────────────────────────────────────────────────────
    const onTyping    = () => setTyping(true);
    const onStopTyping = () => setTyping(false);

    // ── Notification count ──────────────────────────────────────────────────
    const onNotifCount = (count) => setNotifCount(count);

    // Register all listeners
    socket.on("receive_message",     onReceiveMessage);
    socket.on("messages_seen",       onMessagesSeen);
    socket.on("message_delivered",   onMessageDelivered);
    socket.on("message_reaction",    onMessageReaction);
    socket.on("message_deleted",     onMessageDeleted);
    socket.on("message_edited",      onMessageEdited);
    socket.on("online_users",        onOnlineUsers);
    socket.on("user_last_seen",      onUserLastSeen);
    socket.on("typing",              onTyping);
    socket.on("stop_typing",         onStopTyping);
    socket.on("notification_count",  onNotifCount);

    // Cleanup: remove every listener on re-render / unmount
    // This prevents duplicate listeners (the original bug).
    return () => {
      socket.off("receive_message",    onReceiveMessage);
      socket.off("messages_seen",      onMessagesSeen);
      socket.off("message_delivered",  onMessageDelivered);
      socket.off("message_reaction",   onMessageReaction);
      socket.off("message_deleted",    onMessageDeleted);
      socket.off("message_edited",     onMessageEdited);
      socket.off("online_users",       onOnlineUsers);
      socket.off("user_last_seen",     onUserLastSeen);
      socket.off("typing",             onTyping);
      socket.off("stop_typing",        onStopTyping);
      socket.off("notification_count", onNotifCount);
    };
  // id and markAsRead in deps so the closure always has the current chat partner
  }, [id, markAsRead]);

  // ── Smart auto scroll ────────────────────────────────────────────────────────
  // On initial load: instantly snap to bottom after DOM renders.
  // On new messages: only scroll if already near the bottom.
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el || messages.length === 0) return;

    if (!initialLoadDone.current) {
      // First render after fetch — snap to bottom, then mark initial load complete
      el.scrollTop = el.scrollHeight;
      initialLoadDone.current = true;
    } else {
      // Subsequent messages — only scroll if user is near the bottom
      const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      if (distanceFromBottom <= 150) {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages]);

  // ── Close context/reaction menus on click outside ────────────────────────────
  useEffect(() => {
    const close = () => { setContextMenu(null); setReactionMenu(null); };
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  // ── Send message ─────────────────────────────────────────────────────────────
  const sendMessage = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    // Optimistic UI: add a temporary message immediately
    const tempId  = `temp-${Date.now()}`;
    const tempMsg = {
      _id:       tempId,
      sender:    user._id,
      receiver:  id,
      text:      trimmed,
      read:      false,
      delivered: false,
      replyTo:   replyTo,
      createdAt: new Date().toISOString(),
      _temp:     true
    };
    setMessages(prev => [...prev, tempMsg]);
    setText("");
    setReplyTo(null);

    try {
      const res = await axios.post(
        API,
        { receiver: id, text: trimmed, replyTo: replyTo?._id || null },
        authHeaders()
      );
      // Replace temp message with real one from server
      setMessages(prev =>
        prev.map(m => m._id === tempId ? res.data : m)
      );
    } catch (e) {
      console.error("sendMessage:", e.message);
      // Remove optimistic message on failure
      setMessages(prev => prev.filter(m => m._id !== tempId));
    }

    stopTypingEmit();
  };

  // ── Typing ──────────────────────────────────────────────────────────────────
  const stopTypingEmit = useCallback(() => {
    if (isTyping.current) {
      socket.emit("stop_typing", { receiver: id });
      isTyping.current = false;
    }
    clearTimeout(typingTimer.current);
  }, [id]);

  const handleTextChange = (e) => {
    setText(e.target.value);

    if (!isTyping.current) {
      socket.emit("typing", { sender: user._id, receiver: id });
      isTyping.current = true;
    }

    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(stopTypingEmit, 1500);
  };

  // ── Send on Enter ────────────────────────────────────────────────────────────
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (editingMsg) saveEdit();
      else sendMessage();
    }
    if (e.key === "Escape") {
      setEditingMsg(null);
      setReplyTo(null);
      setText("");
    }
  };

  // ── Edit message ─────────────────────────────────────────────────────────────
  const startEdit = (msg) => {
    setEditingMsg(msg);
    setText(msg.text);
    inputRef.current?.focus();
  };

  const saveEdit = async () => {
    if (!text.trim() || !editingMsg) return;
    try {
      await axios.put(`${API}/${editingMsg._id}/edit`, { text: text.trim() }, authHeaders());
      setMessages(prev =>
        prev.map(m => m._id === editingMsg._id ? { ...m, text: text.trim(), edited: true } : m)
      );
    } catch (e) {
      console.error("saveEdit:", e.message);
    }
    setEditingMsg(null);
    setText("");
  };

  // ── Delete message ────────────────────────────────────────────────────────────
  const deleteMsg = async (msgId, deleteFor) => {
    try {
      await axios.delete(`${API}/${msgId}`, {
        ...authHeaders(),
        data: { deleteFor }
      });
      if (deleteFor === "me") {
        setMessages(prev => prev.filter(m => m._id !== msgId));
      }
      // "everyone" is handled by socket event
    } catch (e) {
      console.error("deleteMsg:", e.message);
    }
  };

  // ── React to message ──────────────────────────────────────────────────────────
  const reactTo = async (msgId, emoji) => {
    try {
      await axios.post(`${API}/${msgId}/react`, { emoji }, authHeaders());
    } catch (e) {
      console.error("reactTo:", e.message);
    }
    setReactionMenu(null);
  };

  // ── Search messages ───────────────────────────────────────────────────────────
  const handleSearch = async (q) => {
    setSearchQuery(q);
    if (!q.trim()) { setSearchResults([]); return; }
    try {
      const res = await axios.get(`${API}/${id}/search?q=${encodeURIComponent(q)}`, authHeaders());
      setSearchResults(res.data);
    } catch (e) {
      console.error("search:", e.message);
    }
  };



  // ── Context menu handler ──────────────────────────────────────────────────────
  const handleContextMenu = (e, msg) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ msgId: msg._id, msg, x: e.clientX, y: e.clientY });
    setReactionMenu(null);
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="h-screen bg-[#0d0d14] flex justify-center overflow-hidden">
      <div className="w-full max-w-md bg-[#0d0d14] h-screen text-white flex flex-col relative">

        {/* ── HEADER ─────────────────────────────────────────────────────────── */}
        <div className="sticky top-0 z-10 bg-[#0d0d14] flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
          <div className="flex items-center gap-3">
            {/* BACK ARROW */}
            <button onClick={() => navigate(-1)} className="text-white mr-1">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>

            {/* AVATAR */}
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-600 flex-shrink-0">
              <div className="w-full h-full bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center text-sm font-semibold">J</div>
              {otherOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0d0d14]" />
              )}
            </div>

            {/* NAME + STATUS */}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-[16px] leading-tight">
  {chatUser?.username || "Loading..."}
</h2>
                {notifCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none">
                    {notifCount}
                  </span>
                )}
              </div>
              {typing ? (
                <p className="text-purple-400 text-[13px] leading-tight animate-pulse">typing...</p>
              ) : otherOnline ? (
                <p className="text-green-400 text-[13px] leading-tight font-medium">● Online</p>
              ) : (
                <p className="text-gray-400 text-[12px] leading-tight">{formatLastSeen(lastSeen)}</p>
              )}
            </div>
          </div>

          {/* RIGHT ICONS */}
          <div className="flex items-center gap-4">
            {/* SEARCH */}
            <button
              onClick={(e) => { e.stopPropagation(); setShowSearch(s => !s); setSearchQuery(""); setSearchResults([]); }}
              className="text-white/70 hover:text-white"
            >
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
            {/* THREE-DOT MENU */}
            <button className="text-white/70 hover:text-white flex flex-col gap-[4px] items-center justify-center">
              <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
              </svg>
            </button>
          </div>
        </div>

        {/* ── SEARCH BAR ─────────────────────────────────────────────────────── */}
        {showSearch && (
          <div className="sticky top-[65px] z-10 bg-[#0d0d14] px-4 py-2 border-b border-white/[0.07]">
            <input
              autoFocus
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search messages…"
              className="w-full bg-white/10 rounded-full px-4 py-2 outline-none text-sm text-white placeholder-gray-500"
            />
            {searchResults.length > 0 && (
              <div className="mt-2 max-h-40 overflow-y-auto rounded-xl bg-white/5 divide-y divide-white/10">
                {searchResults.map(m => (
                  <div
                    key={m._id}
                    onClick={() => {
                      document.getElementById(`msg-${m._id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
                      setShowSearch(false);
                    }}
                    className="px-4 py-2 text-sm cursor-pointer hover:bg-white/10"
                  >
                    <span className="text-gray-400 text-xs">{formatTime(m.createdAt)} · </span>
                    {m.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── MESSAGES ───────────────────────────────────────────────────────── */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto flex flex-col gap-2 px-4 py-3">
          {messages.map((msg, index) => {
            const isMine    = msg.sender === user._id || msg.sender?._id === user._id;
            const isDeleted = msg.deletedForEveryone;

            const currentLabel  = getDateLabel(msg.createdAt);
            const previousLabel = index > 0 ? getDateLabel(messages[index - 1].createdAt) : null;
            const showDateSep   = currentLabel !== previousLabel;

            return (
              <div key={msg._id} className="flex flex-col">
                {/* DATE SEPARATOR */}
                {showDateSep && (
                  <div className="flex justify-center my-3">
                    <span className="bg-[#1e1e2e] text-gray-400 text-[12px] px-4 py-1 rounded-full">
                      {currentLabel}
                    </span>
                  </div>
                )}

                <div
                  id={`msg-${msg._id}`}
                  className={`flex flex-col max-w-[78%] ${isMine ? "self-end items-end" : "self-start items-start"}`}
                >
                  {/* REPLY PREVIEW inside bubble */}
                  {msg.replyTo && (
                    <div className={`w-full rounded-t-2xl rounded-b-none px-3 pt-2 pb-1 text-[12px] border-l-[3px] border-purple-400 ${isMine ? "bg-purple-800/60" : "bg-white/10"}`}>
                      <span className="text-purple-300 font-semibold block">
                        ← {msg.replyTo.sender === user._id
    ? "You"
    : chatUser?.username || "User"}
                      </span>
                      <span className="text-gray-300 truncate block">{msg.replyTo.text || "Message"}</span>
                    </div>
                  )}

                  {/* BUBBLE */}
                  <div
                    onContextMenu={(e) => handleContextMenu(e, msg)}
                    className={`px-4 py-2.5 cursor-pointer select-none
                      ${msg.replyTo ? "rounded-b-2xl rounded-t-none" : "rounded-2xl"}
                      ${isMine ? "bg-[#7c3aed]" : "bg-[#1e1e30]"}
                      ${isDeleted ? "opacity-50" : ""}
                    `}
                  >
                    {isDeleted ? (
                      <span className="flex items-center gap-2 text-gray-300 text-[14px] italic">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                        </svg>
                        This message was deleted
                      </span>
                    ) : (
                      <span className="text-white text-[15px] leading-snug break-words">{msg.text}</span>
                    )}

                    {/* EDITED BADGE + TIME + TICK — all inline in same row */}
                    <div className="flex items-center justify-end gap-1 mt-1">
                      {msg.edited && !isDeleted && (
                        <span className="text-[11px] text-gray-300/70">(edited)</span>
                      )}
                      <span className="text-[11px] text-gray-300/80 ml-1">{formatTime(msg.createdAt)}</span>
                      {isMine && (
                        <span className="ml-0.5">
                          {msg._temp
                            ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/></svg>
                            : msg.read
                            ? <svg width="16" height="10" viewBox="0 0 22 10" fill="none"><path d="M1 5l4 4L13 1" stroke="#a78bfa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 5l4 4 8-8" stroke="#a78bfa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            : msg.delivered
                            ? <svg width="16" height="10" viewBox="0 0 22 10" fill="none"><path d="M1 5l4 4L13 1" stroke="#d1d5db" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 5l4 4 8-8" stroke="#d1d5db" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            : <svg width="10" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5l3.5 3.5L11 1" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          }
                        </span>
                      )}
                    </div>
                  </div>

                  {/* REACTIONS DISPLAY */}
                  {msg.reactions?.length > 0 && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {Object.entries(
                        msg.reactions.reduce((acc, r) => {
                          acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                          return acc;
                        }, {})
                      ).map(([emoji, count]) => (
                        <button
                          key={emoji}
                          onClick={() => reactTo(msg._id, emoji)}
                          className="bg-[#1e1e30] border border-white/10 rounded-full px-2 py-0.5 text-sm hover:bg-white/10 flex items-center gap-1"
                        >
                          {emoji}
                          {count > 1 && <span className="text-[11px] text-gray-300">{count}</span>}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* REACTION PICKER */}
                  {reactionMenu === msg._id && (
                    <div
                      className="flex gap-2 bg-[#1e1e2e] rounded-full px-3 py-2 shadow-2xl mt-1.5 z-50 border border-white/10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {REACTIONS.map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => reactTo(msg._id, emoji)}
                          className="text-xl hover:scale-125 transition-transform"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* ── CONTEXT MENU ───────────────────────────────────────────────────── */}
        {contextMenu && (
          <div
            className="fixed z-50 bg-[#1c1c2a] rounded-2xl shadow-2xl py-1 min-w-[200px] overflow-hidden"
            style={{
              top:  Math.min(contextMenu.y, window.innerHeight - 300),
              left: Math.min(contextMenu.x, window.innerWidth  - 210),
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* REACT */}
            <button
              className="w-full flex items-center gap-3 px-5 py-3 hover:bg-white/[0.07] text-[15px] text-white"
              onClick={() => { setReactionMenu(contextMenu.msgId); setContextMenu(null); }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
              </svg>
              React
            </button>

            {/* REPLY */}
            <button
              className="w-full flex items-center gap-3 px-5 py-3 hover:bg-white/[0.07] text-[15px] text-white"
              onClick={() => {
                setReplyTo(contextMenu.msg);
                setText("");
                inputRef.current?.focus();
                setContextMenu(null);
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/>
              </svg>
              Reply
            </button>

            {/* EDIT */}
            {(contextMenu.msg.sender === user._id || contextMenu.msg.sender?._id === user._id) && !contextMenu.msg.deletedForEveryone && (
              <button
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-white/[0.07] text-[15px] text-white"
                onClick={() => { startEdit(contextMenu.msg); setContextMenu(null); }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Edit
              </button>
            )}

            {/* COPY */}
            <button
              className="w-full flex items-center gap-3 px-5 py-3 hover:bg-white/[0.07] text-[15px] text-white"
              onClick={() => { navigator.clipboard?.writeText(contextMenu.msg.text); setContextMenu(null); }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              Copy
            </button>

            <div className="h-px bg-white/[0.07] mx-4" />

            {/* DELETE FOR ME */}
            <button
              className="w-full flex items-center gap-3 px-5 py-3 hover:bg-white/[0.07] text-[15px] text-red-400"
              onClick={() => { deleteMsg(contextMenu.msgId, "me"); setContextMenu(null); }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
              </svg>
              Delete for me
            </button>

            {/* DELETE FOR EVERYONE */}
            {(contextMenu.msg.sender === user._id || contextMenu.msg.sender?._id === user._id) && !contextMenu.msg.deletedForEveryone && (
              <button
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-white/[0.07] text-[15px] text-red-500"
                onClick={() => { deleteMsg(contextMenu.msgId, "everyone"); setContextMenu(null); }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                </svg>
                Delete for everyone
              </button>
            )}
          </div>
        )}

        {/* ── INPUT AREA ─────────────────────────────────────────────────────── */}
        <div className="bg-[#0d0d14] pb-4 pt-2 px-3">

          {/* REPLY PREVIEW BAR */}
          {replyTo && (
            <div className="flex items-center justify-between px-4 py-2 mb-2 bg-white/5 rounded-xl border-l-4 border-purple-500">
              <div className="text-[12px] text-purple-300 truncate">
                ↩ Replying to: <span className="text-white">{replyTo.text}</span>
              </div>
              <button onClick={() => setReplyTo(null)} className="text-gray-400 hover:text-white ml-3 text-lg leading-none">×</button>
            </div>
          )}

          {/* EDIT MODE BAR */}
          {editingMsg && (
            <div className="flex items-center justify-between px-4 py-2 mb-2 bg-purple-900/30 rounded-xl border-l-4 border-purple-400">
              <div className="text-[12px] text-purple-300 truncate">
                ✏️ Editing: <span className="text-white">{editingMsg.text}</span>
              </div>
              <button onClick={() => { setEditingMsg(null); setText(""); }} className="text-gray-400 hover:text-white ml-3 text-lg leading-none">×</button>
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* PLUS BUTTON */}
            <button className="w-11 h-11 bg-[#7c3aed] rounded-full flex items-center justify-center flex-shrink-0 hover:bg-purple-700 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>

            {/* TEXT INPUT */}
            <div className="flex-1 flex items-center bg-[#1c1c2a] rounded-full px-4 py-2.5 gap-2">
              <input
                ref={inputRef}
                value={text}
                onChange={handleTextChange}
                onKeyDown={handleKeyDown}
                placeholder={editingMsg ? "Edit message…" : "Type a message..."}
                className="flex-1 bg-transparent outline-none text-white text-[15px] placeholder-gray-500"
              />
              {/* EMOJI BUTTON */}
              <button className="text-gray-400 hover:text-white flex-shrink-0">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
                </svg>
              </button>
            </div>

            {/* MIC / SEND BUTTON */}
            {text.trim() ? (
              <button
                onClick={editingMsg ? saveEdit : sendMessage}
                className="w-11 h-11 bg-[#7c3aed] rounded-full flex items-center justify-center flex-shrink-0 hover:bg-purple-700 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            ) : (
              <button className="w-11 h-11 bg-[#7c3aed] rounded-full flex items-center justify-center flex-shrink-0 hover:bg-purple-700 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default ChatPage;