import { FaHome, FaMapMarkerAlt, FaRegCommentDots, FaBriefcase, FaUser } from "react-icons/fa";

// Bottom tab bar. `active` picks the highlighted tab; `onNavigate` is called
// with the tab id on tap — wire this to your router when routes exist.
const TABS = [
  { id: "home", icon: FaHome },
  { id: "explore", icon: FaMapMarkerAlt },
  { id: "chat", icon: FaRegCommentDots },
  { id: "trips", icon: FaBriefcase },
  { id: "profile", icon: FaUser },
];

const Navbar = ({ active = "profile", onNavigate }) => {
  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-3 py-2.5 rounded-full border border-white/10 bg-[#120a1f]/90 backdrop-blur-xl w-[92%] max-w-md justify-between">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            onClick={() => onNavigate?.(tab.id)}
            className={`w-11 h-11 rounded-full flex items-center justify-center text-lg transition-all duration-200 ${
              isActive
                ? "text-white border border-fuchsia-400/60"
                : "text-white/50"
            }`}
            style={
              isActive
                ? {
                    background:
                      "linear-gradient(135deg, rgba(217,70,239,0.35), rgba(168,85,247,0.35))",
                    boxShadow: "0 0 14px rgba(217,70,239,0.55)",
                  }
                : undefined
            }
            title={tab.id}
          >
            <Icon />
          </button>
        );
      })}
    </nav>
  );
};

export default Navbar;