import { FaHeart } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { MdOutlinePhotoLibrary } from "react-icons/md";
import { IoLocationSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const DestinationCard = ({ destination, onClose }) => {
  if (!destination) return null;
  const {
  name,
  image,
  country,
  travelers,
  open,
  hotels,
  events,
  description,
} = destination;
  const stats = [
  { value: travelers, label: "Travelers" },
  { value: open, label: "Open to\nConnect" },
  { value: hotels, label: "Hotels" },
  { value: events, label: "Events" },
];

const navigate = useNavigate();
  return (
    <div className="mx-3 -mt-8 mb-28 relative z-30">
      <div
        className="rounded-[28px] shadow-2xl overflow-hidden"
        style={{
          background: "rgba(18, 16, 38, 0.95)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 60px rgba(0,0,0,0.7), 0 0 0 0.5px rgba(255,255,255,0.05)",
        }}
      >
        {/* Top section */}
        <div className="flex gap-4 p-4 pb-3">

          {/* Left — Image */}
          <div className="relative flex-shrink-0" style={{ width: 130 }}>
            <img
              src={image}
              className="rounded-[18px] object-cover block"
              style={{ width: 130, height: 185 }}
            />

            {/* Heart button */}
            <button
              className="absolute top-2.5 left-2.5 flex items-center justify-center"
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: "rgba(255,255,255,0.14)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
            >
              <FaHeart size={13} color="#fff" />
            </button>

            {/* Travelers Nearby overlay */}
            <div
              className="absolute bottom-0 left-0 right-0 px-2.5 py-2"
              style={{
                borderRadius: "0 0 18px 18px",
                background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 100%)",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold flex items-center gap-1" style={{ fontSize: 11 }}>
                    <HiOutlineUserGroup size={11} /> {travelers}
                  </div>
                  <div className="text-gray-400" style={{ fontSize: 9 }}>Travelers Nearby</div>
                </div>
                <div className="flex items-center">
                  {["/images/post1.jpg", "/images/post2.jpg", "/images/post3.jpg"].map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      className="rounded-full"
                      style={{
                        width: 20,
                        height: 20,
                        border: "1.5px solid #fff",
                        marginLeft: i === 0 ? 0 : -6,
                      }}
                    />
                  ))}
                  <span
                    className="text-white"
                    style={{
                      fontSize: 9,
                      background: "rgba(255,255,255,0.18)",
                      borderRadius: 20,
                      padding: "1px 5px",
                      marginLeft: 4,
                    }}
                  >
                    +21
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Content */}
          <div className="flex-1 min-w-0 flex flex-col">

            {/* Title + Close */}
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <h1
                  className="font-bold text-white leading-none truncate"
                  style={{ fontSize: 24, letterSpacing: -0.5 }}
                >
                  {name} 🌴
                </h1>
                <p className="flex items-center gap-1 mt-1 text-gray-400" style={{ fontSize: 12 }}>
                  <IoLocationSharp size={12} color="#a78bfa" />
                  📍 {country}
                </p>
              </div>

              <button
                className="flex-shrink-0 flex items-center justify-center ml-2"
                onClick={onClose}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <IoClose size={16} color="#9ca3af" />
              </button>
            </div>

            {/* Trending badge */}
            <div
              className="inline-flex items-center gap-1 mt-2.5 self-start"
              style={{
                borderRadius: 20,
                background: "rgba(168,85,247,0.18)",
                border: "1px solid rgba(168,85,247,0.28)",
                padding: "4px 10px",
              }}
            >
              <span style={{ fontSize: 11 }}>🔥</span>
              <span style={{ fontSize: 11, color: "#c084fc" }}>Trending Destination</span>
            </div>

            {/* Stats — 4 cols, equal width */}
            <div className="grid grid-cols-4 mt-3 gap-1">
              {stats.map((stat, i) => (
                <div key={i} className="min-w-0">
                  <div className="font-bold text-white" style={{ fontSize: 17, lineHeight: 1 }}>
                    {stat.value}
                  </div>
                  <div
                    className="text-gray-400 mt-0.5 leading-tight"
                    style={{ fontSize: 9, whiteSpace: "pre-line" }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <p className="text-gray-400 mt-2.5 leading-snug" style={{ fontSize: 12 }}>
              {description}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "0 16px" }} />

        {/* Action Buttons */}
        <div className="flex gap-2.5 p-4 pt-3">
          {/* Explore */}
          <button
          onClick={() => navigate(`/destination/${name.toLowerCase()}`)}
            className="flex-shrink-0 flex items-center justify-center font-semibold text-white"
            style={{
              height: 44,
              paddingLeft: 20,
              paddingRight: 20,
              borderRadius: 13,
              background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
              boxShadow: "0 4px 20px rgba(236,72,153,0.4)",
              fontSize: 13,
              whiteSpace: "nowrap",
            }}
          >
            Explore →
          </button>

          {/* Find Travelers */}
          <button
          onClick={() => navigate(`/travelers/${name.toLowerCase()}`)}
            className="flex-1 min-w-0 flex items-center justify-center gap-1.5"
            style={{
              height: 44,
              borderRadius: 13,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#d1d5db",
              fontSize: 12,
            }}
          >
            <HiOutlineUserGroup size={14} />
            <span className="truncate">Find Travelers</span>
          </button>

          {/* View Posts */}
          <button
          onClick={() => navigate(`/posts/${name.toLowerCase()}`)}
            className="flex-1 min-w-0 flex items-center justify-center gap-1.5"
            style={{
              height: 44,
              borderRadius: 13,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#d1d5db",
              fontSize: 12,
            }}
          >
            <MdOutlinePhotoLibrary size={14} />
            <span className="truncate">View Posts</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;