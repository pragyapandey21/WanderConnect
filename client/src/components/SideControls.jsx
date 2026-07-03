import { FaCrosshairs } from "react-icons/fa";
import { Md3dRotation } from "react-icons/md";
import { RiStackLine } from "react-icons/ri";

const SideControls = ({
  onLocate,
  isLocating,
  onToggleLayer,
  activeLayerLabel,
  isGlobeView,
  onToggleGlobe,
}) => {
  return (
    <div className="absolute right-3 top-40 flex flex-col items-center gap-4 px-3 py-4 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">
      {/* Locate me */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onLocate?.();
        }}
        className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-colors ${
          isLocating ? "bg-purple-500/30 text-purple-300" : "bg-white/5 text-white"
        }`}
        title="Find my location"
      >
        <FaCrosshairs className={isLocating ? "animate-spin" : ""} />
      </button>

      {/* Globe / Map toggle */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleGlobe?.();
        }}
        className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-300 border ${
          isGlobeView
            ? "bg-purple-500/40 text-white border-purple-400/70"
            : "bg-white/5 text-white border-transparent"
        }`}
        style={
          isGlobeView
            ? { boxShadow: "0 0 14px rgba(168,85,247,0.7)" }
            : undefined
        }
        title={isGlobeView ? "Switch to India map" : "Switch to 3D globe"}
      >
        <Md3dRotation />
      </button>

      {/* Map style / layer toggle */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleLayer?.();
        }}
        className="relative w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white text-xl"
        title={`Map style: ${activeLayerLabel}`}
      >
        <RiStackLine />
      </button>
    </div>
  );
};

export default SideControls;