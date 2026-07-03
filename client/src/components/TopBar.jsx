const TopBar = () => {
  return (
    <div className="flex justify-between items-center px-6 pt-8 text-white">
      
      {/* WanderConnect Logo */}
      <button className="w-14 h-14 rounded-2xl bg-[#161B2D] border border-purple-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.25)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(236,72,153,0.4)]">
        <span className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
          W
        </span>
      </button>

      {/* App Name */}
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">
          <span className="text-white">Wander</span>
          <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Connect
          </span>
        </h1>

        <p className="text-gray-400 text-sm">
          Explore. Connect. Travel Together.
        </p>
      </div>

      {/* Notification */}
      <button className="w-14 h-14 rounded-2xl bg-[#161B2D] border border-purple-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(236,72,153,0.4)]">
        <span className="text-2xl">🔔</span>
      </button>

    </div>
  );
};

export default TopBar;