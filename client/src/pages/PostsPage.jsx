import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaBell,
  FaMapMarkerAlt,
  FaHeart,
  FaRegComment,
  FaPaperPlane,
  FaRegBookmark,
  FaEllipsisH,
  FaImage,
} from "react-icons/fa";

// Turns an ISO date string into "2h ago" style text.
// Assumes each post has a createdAt field — adjust the key below if
// your API returns something else (e.g. post.createdAt vs post.date).
const timeAgo = (dateString) => {
  if (!dateString) return "";
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString();
};

const feedTabs = ["Posts", "Trips", "Saved"];

function PostsPage() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [activeTab, setActiveTab] = useState("Posts");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("https://wanderconnect.onrender.com/api/posts");

        setPosts(res.data);
        console.log(res.data[0]);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `https://wanderconnect.onrender.com/api/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts(
        posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: [...post.likes, "liked"],
              }
            : post
        )
      );
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  const handleComment = async (postId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `https://wanderconnect.onrender.com/api/posts/${postId}/comment`,
        {
          text: commentText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts(
        posts.map((post) =>
          post._id === postId
            ? { ...post, comments: res.data.comments }
            : post
        )
      );

      setCommentText("");
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0714] text-white pb-28 max-w-md mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-6 mb-4">
        <h1 className="text-xl font-extrabold tracking-tight">
          Wander<span className="text-fuchsia-400">Connect</span>
        </h1>
        <button className="relative text-white/70 hover:text-white transition-colors">
          <FaBell className="text-lg" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-fuchsia-500" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 px-4 border-b border-white/10 mb-4">
        {feedTabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? "text-fuchsia-400 border-fuchsia-400"
                  : "text-white/40 border-transparent hover:text-white/60"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {activeTab !== "Posts" ? (
        <div className="px-4 py-16 text-center text-white/40 text-sm">
          {activeTab === "Trips"
            ? "Trips from this destination will show up here."
            : "Saved posts will show up here."}
        </div>
      ) : (
        <div className="px-4">
          {/* Composer */}
          <div
            onClick={() => navigate("/create-post")}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-4 py-3 mb-5 cursor-pointer hover:bg-white/[0.07] transition-colors"
          >
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80"
              alt="Your avatar"
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />
            <span className="flex-1 text-sm text-white/40">What's on your mind?</span>
            <span className="flex items-center gap-1.5 text-fuchsia-400 text-sm font-medium shrink-0">
              <FaImage />
              Photo
            </span>
          </div>

          {name && (
            <p className="text-xs text-white/40 mb-3 -mt-2">
              Showing posts from {name}
            </p>
          )}

          {/* Feed */}
          <div className="space-y-4">
            {posts.map((post) => {
              // Author info assumed to live on post.user — swap the keys
              // below if your API populates this differently.
              const authorName = post.user?.username || "Traveller";
              const authorPic =
                post.user?.profilePic ||
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80";

              // Not part of the current schema — defaults to 0 until a
              // real "shares" field exists on the post.
              const shareCount = post.shares?.length || 0;

              return (
                <div
                  key={post._id}
                  className="rounded-[24px] border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden"
                >
                  {/* Post header */}
                  <div className="flex items-center justify-between px-4 pt-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={authorPic}
                        alt={authorName}
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{authorName}</p>
                        <div className="flex items-center gap-1 text-xs text-white/50 truncate">
                          {post.location && (
                            <>
                              <FaMapMarkerAlt className="text-fuchsia-400 text-[10px] shrink-0" />
                              <span className="text-fuchsia-300">{post.location}</span>
                              <span className="text-white/30">•</span>
                            </>
                          )}
                          <span>{timeAgo(post.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <button className="text-white/40 hover:text-white/70 transition-colors shrink-0">
                      <FaEllipsisH />
                    </button>
                  </div>

                  {/* Caption */}
                  {post.caption && (
                    <p className="px-4 mt-3 text-sm text-white/80">{post.caption}</p>
                  )}

                  {/* Image */}
                  {post.image && (
                    <div className="mt-3">
                      <img
                        src={post.image} // ← confirm this matches your real API field
                        alt={post.caption}
                        className="w-full max-h-96 object-cover"
                      />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between px-4 pt-3 text-sm">
                    <div className="flex items-center gap-5">
                      <button
                        onClick={() => handleLike(post._id)}
                        className="flex items-center gap-1.5 text-white/80 hover:text-fuchsia-400 transition-colors"
                      >
                        <FaHeart className="text-pink-500" />
                        {post.likes.length}
                      </button>
                      <span className="flex items-center gap-1.5 text-white/80">
                        <FaRegComment />
                        {post.comments.length}
                      </span>
                      <span className="flex items-center gap-1.5 text-white/80">
                        <FaPaperPlane />
                        {shareCount}
                      </span>
                    </div>
                    <button className="text-white/50 hover:text-white/80 transition-colors">
                      <FaRegBookmark />
                    </button>
                  </div>

                  {/* Liked by */}
                  {post.likes.length > 0 && (
                    <div className="flex items-center gap-2 px-4 mt-2.5">
                      <div className="flex -space-x-2">
                        {[...Array(Math.min(3, post.likes.length))].map((_, i) => (
                          <div
                            key={i}
                            className="w-5 h-5 rounded-full border border-[#0a0714] bg-gradient-to-br from-fuchsia-500 to-purple-700"
                          />
                        ))}
                      </div>
                      <p className="text-xs text-white/50">
                        Liked by{" "}
                        <span className="text-fuchsia-400">
                          {post.likes.length === 1
                            ? "1 person"
                            : `${post.likes.length} people`}
                        </span>
                      </p>
                    </div>
                  )}

                  {/* Comment input */}
                  <div className="flex gap-2 px-4 mt-3 mb-3">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 px-4 py-2 rounded-xl outline-none focus:border-fuchsia-400/60 transition-colors"
                    />
                    <button
                      onClick={() => handleComment(post._id)}
                      className="px-4 py-2 rounded-xl text-sm font-medium text-white"
                      style={{
                        background: "linear-gradient(90deg, #f472b6, #a855f7, #6d28d9)",
                      }}
                    >
                      Send
                    </button>
                  </div>

                  {post.comments.length > 0 && (
                    <div className="px-4 pb-4 space-y-2">
                      {post.comments.map((comment, index) => (
                        <div
                          key={index}
                          className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-sm text-white/70"
                        >
                          {comment.text}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default PostsPage;