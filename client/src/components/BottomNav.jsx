import {
  FaGlobeAmericas,
  FaUserFriends,
  FaSuitcase,
  FaUser,
  FaPlus,
} from "react-icons/fa";

const BottomNav = ({ activeTab = "explore", onTabChange }) => {
  const tabs = [
    { id: "explore",    icon: FaGlobeAmericas, label: "Explore",    active: true  },
    { id: "companions", icon: FaUserFriends,   label: "Companions", active: false },
    { id: "trips",      icon: FaSuitcase,      label: "Trips",      active: false },
    { id: "profile",    icon: FaUser,          label: "Profile",    active: false },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-4" style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}>
      <div
        className="flex items-center justify-between px-3 w-full"
        style={{ maxWidth: 420,
          height: 68,
          borderRadius: 34,
          background: "rgba(14, 12, 32, 0.93)",
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
          border: "1px solid rgba(255,255,255,0.09)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,255,255,0.05)",
        }}
      >
        {/* Left two tabs */}
        {tabs.slice(0, 2).map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className="flex flex-col items-center justify-center flex-1"
              style={{ background: "none", border: "none", cursor: "pointer", gap: 3 }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 11,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isActive
                    ? "linear-gradient(135deg, rgba(236,72,153,0.22) 0%, rgba(139,92,246,0.22) 100%)"
                    : "transparent",
                }}
              >
                <Icon
                  size={19}
                  color={isActive ? "#c084fc" : "rgba(255,255,255,0.4)"}
                />
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#c084fc" : "rgba(255,255,255,0.38)",
                  lineHeight: 1,
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* Centre FAB — sits INSIDE the pill */}
        <button
          onClick={() => onTabChange?.("plus")}
          className="flex items-center justify-center flex-shrink-0"
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
            boxShadow: "0 0 28px rgba(168,85,247,0.6), 0 4px 16px rgba(236,72,153,0.45)",
            border: "none",
            cursor: "pointer",
            margin: "0 4px",
          }}
        >
          <FaPlus size={20} color="#fff" />
        </button>

        {/* Right two tabs */}
        {tabs.slice(2).map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className="flex flex-col items-center justify-center flex-1"
              style={{ background: "none", border: "none", cursor: "pointer", gap: 3 }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 11,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isActive
                    ? "linear-gradient(135deg, rgba(236,72,153,0.22) 0%, rgba(139,92,246,0.22) 100%)"
                    : "transparent",
                }}
              >
                <Icon
                  size={19}
                  color={isActive ? "#c084fc" : "rgba(255,255,255,0.4)"}
                />
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#c084fc" : "rgba(255,255,255,0.38)",
                  lineHeight: 1,
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;