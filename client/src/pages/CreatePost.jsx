import { useState } from "react";
import { FaArrowLeft, FaImage } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreatePost = () => {
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };
  const handleSubmit = async () => {
  try {
    const token = localStorage.getItem("token");

    const formData = new FormData();

    formData.append("image", image);
    formData.append("caption", caption);
    formData.append("location", location);
    formData.append("tags", tags);

    const res = await axios.post(
      "https://wanderconnect.onrender.com/api/posts",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Post created:", res.data);

    alert("Post created successfully!");

    navigate("/profile");

  } catch (error) {
    console.error(error);
    alert(error.response?.data?.message || "Failed to create post");
  }
};

  return (
    <div className="min-h-screen bg-[#0a0714] text-white max-w-md mx-auto px-4 pt-5 pb-28">

      {/* Header */}

      <div className="flex items-center gap-4 mb-6">

        <button onClick={() => navigate(-1)}>
          <FaArrowLeft size={18} />
        </button>

        <h1 className="text-2xl font-bold">
          Create Post
        </h1>

      </div>

      {/* Preview */}

      <div className="w-full h-72 rounded-3xl overflow-hidden border border-fuchsia-500/30 bg-[#171123] flex items-center justify-center">

        {preview ? (

          <img
            src={preview}
            alt="preview"
            className="w-full h-full object-cover"
          />

        ) : (

          <div className="text-center">

            <FaImage
              size={45}
              className="mx-auto text-fuchsia-400 mb-3"
            />

            <p className="text-white/60">
              Select an image
            </p>

          </div>

        )}

      </div>

      {/* Choose Image */}

      <label className="mt-5 block">

        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleImageChange}
        />

        <div className="bg-fuchsia-600 hover:bg-fuchsia-700 transition rounded-xl py-3 text-center cursor-pointer font-semibold">

          Choose Image

        </div>

      </label>

      {/* Caption */}

      <input
        type="text"
        placeholder="Write a caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="mt-6 w-full bg-[#171123] rounded-xl p-4 outline-none border border-white/10"
      />

      {/* Location */}

      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="mt-4 w-full bg-[#171123] rounded-xl p-4 outline-none border border-white/10"
      />

      {/* Tags */}

      <input
        type="text"
        placeholder="Tags (Beach, Sunset...)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="mt-4 w-full bg-[#171123] rounded-xl p-4 outline-none border border-white/10"
      />

      {/* Share */}

      <button
  onClick={handleSubmit}
  className="mt-8 w-full bg-gradient-to-r from-pink-500 to-purple-600 py-4 rounded-xl font-bold text-lg"
>
  Share Post
</button>

    </div>
  );
};

export default CreatePost;