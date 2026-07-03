import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function PostsPage() {
     const { name } = useParams();
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
  const fetchPosts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/posts"
      );

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
      `http://localhost:5000/api/posts/${postId}/like`,
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
      `http://localhost:5000/api/posts/${postId}/comment`,
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
  <div className="min-h-screen bg-black text-white p-4">
    <h1 className="text-2xl font-bold mb-6">
      Posts from {name}
    </h1>

    <div className="space-y-5">
      {posts.map((post) => (
        <div
          key={post._id}
          className="bg-zinc-900 rounded-3xl p-4 border border-zinc-800"
        >
          <h2 className="font-bold text-lg">
            {post.location}
          </h2>

          <p className="text-gray-300 mt-2">
            {post.caption}
          </p>

          <div className="flex justify-between mt-4 text-xl">
            <button onClick={() => handleLike(post._id)}>
  ❤️ {post.likes.length}
</button>
            <button>💬 {post.comments.length}</button>
            <button>📤 Share</button>
          </div>
          <div className="mt-4 flex gap-2">
  <input
    type="text"
    placeholder="Write a comment..."
    value={commentText}
    onChange={(e) => setCommentText(e.target.value)}
    className="flex-1 bg-zinc-800 text-white px-4 py-2 rounded-xl outline-none"
  />

  <button
    onClick={() => handleComment(post._id)}
    className="bg-purple-600 px-4 py-2 rounded-xl"
  >
    Send
  </button>
</div>
<div className="mt-4 space-y-2">
  {post.comments.map((comment, index) => (
    <div
      key={index}
      className="bg-zinc-800 p-2 rounded-xl text-sm"
    >
      {comment.text}
    </div>
  ))}
</div>
        </div>
      ))}
    </div>
  </div>
);
}

export default PostsPage;