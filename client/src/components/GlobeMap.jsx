import { useEffect, useRef, useState } from "react";
import MapPin from "./MapPin";
import SideControls from "./SideControls";
import Compass from "./Compass";

// Flip to true only while you're calibrating new pin coordinates,
// then set back to false before shipping.
const DEBUG_CALIBRATE = true;

const ZOOM_LEVEL = 1.0;
const LOCATE_ZOOM = 2.4;

// Map styles cycled by the "layers" button. Implemented as CSS filters over
// the same neon image so you don't need a second map asset right now —
// swap in a real satellite image path later if you want a true style swap.
const MAP_LAYERS = [
  { id: "neon", label: "Neon", filter: "none" },
  { id: "satellite", label: "Satellite", filter: "grayscale(0.35) sepia(0.45) hue-rotate(50deg) brightness(0.85) saturate(1.3)" },
];

// Globe-view pin positions, keyed by destination name — kept entirely local
// since the database only stores mapTop/mapLeft (flat-map coordinates).
// These are eyeballed starting points for the india-terrain.png globe;
// nudge them with the DEBUG_CALIBRATE click-to-copy helper below (open
// Globe view, click the exact spot, then paste the copied {top, left}
// object in here).
const globePositions = {
  Mumbai: { top: 240, left: 121 },
  Goa: { top: 326, left: 138 },
};

// Builds a simple equirectangular-style projection (independent linear scale
// per axis) from two reference destinations' real lat/lng → their calibrated
// pixel mapTop/mapLeft. Good enough for a flat illustrative map like this one.
const buildProjection = (destinations) => {
  const refs = destinations.filter(
    (d) =>
      typeof d.latitude === "number" &&
      typeof d.longitude === "number" &&
      typeof d.mapTop === "number" &&
      typeof d.mapLeft === "number"
  );
  if (refs.length < 2) return null;

  const [a, b] = refs;
  if (a.longitude === b.longitude || a.latitude === b.latitude) return null;

  const mLon = (b.mapLeft - a.mapLeft) / (b.longitude - a.longitude);
  const cLon = a.mapLeft - mLon * a.longitude;
  const mLat = (b.mapTop - a.mapTop) / (b.latitude - a.latitude);
  const cLat = a.mapTop - mLat * a.latitude;

  return {
    toPixel: (lat, lng) => ({
      x: mLon * lng + cLon,
      y: mLat * lat + cLat,
    }),
  };
};

const GlobeMap = ({ destinations = [], selectedDestination, setSelectedDestination }) => {
  const containerRef = useRef(null);
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
  const [userLocation, setUserLocation] = useState(null); // { x, y } in map pixel space
  const [isLocating, setIsLocating] = useState(false);
  const [layerIndex, setLayerIndex] = useState(0);
  const [isGlobeView, setIsGlobeView] = useState(false);

  useEffect(() => {
    console.log(`GlobeMap received ${destinations.length} destinations:`, destinations);
  }, [destinations]);

  const handleDebugClick = (e) => {
    if (!DEBUG_CALIBRATE) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    if (isGlobeView) {
      // Globe coordinates live in the local globePositions object, not the
      // database, so copy a ready-to-paste entry instead of a bare field.
      const label = selectedDestination || "DestinationName";
      const snippet = `${label}: { top: ${y}, left: ${x} },`;
      navigator.clipboard.writeText(snippet);
      alert(`Copied → ${snippet}\nPaste into globePositions in GlobeMap.jsx`);
    } else {
      navigator.clipboard.writeText(`mapTop: ${y},\nmapLeft: ${x},`);
      alert(`Copied → mapTop: ${y}, mapLeft: ${x}`);
    }
  };

  const panZoomTo = (x, y, scale) => {
    if (!containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    const centerX = width / 2;
    const targetY = height * 0.4;
    setTransform({
      scale,
      x: centerX - x * scale,
      y: targetY - y * scale,
    });
  };

  // Fly the map to the selected pin: zoom in and pan so it lands center-screen
  useEffect(() => {
    if (!selectedDestination || !containerRef.current) {
      setTransform({ scale: 1, x: 0, y: 0 });
      return;
    }

    const dest = destinations.find((d) => d.name === selectedDestination);
    const globePos = dest && globePositions[dest.name];
    const destTop = dest && (isGlobeView ? globePos?.top : dest.mapTop);
    const destLeft = dest && (isGlobeView ? globePos?.left : dest.mapLeft);

    if (!dest || typeof destTop !== "number" || typeof destLeft !== "number") {
      console.warn(
        `GlobeMap: "${selectedDestination}" is missing valid ${
          isGlobeView ? "globePositions entry" : "mapTop/mapLeft"
        } — skipping zoom.`
      );
      setTransform({ scale: 1, x: 0, y: 0 });
      return;
    }

    panZoomTo(destLeft, destTop, ZOOM_LEVEL);
  }, [selectedDestination, destinations, isGlobeView]);

  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert("Your browser doesn't support location access.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const projection = buildProjection(destinations);

        if (!projection) {
          alert(
            "Can't place your location on the map yet — need at least 2 destinations with calibrated coordinates."
          );
          return;
        }

        // Demo location (Bhopal)
const x = 205;
const y = 225;

setSelectedDestination(null);
setUserLocation({ x, y });
panZoomTo(x, y, LOCATE_ZOOM);
      },
      (err) => {
        setIsLocating(false);
        console.log(err);
        alert("Couldn't get your location. Check location permissions and try again.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleToggleLayer = () => {
    setLayerIndex((i) => (i + 1) % MAP_LAYERS.length);
  };

  const handleToggleGlobe = () => {
    setIsGlobeView((prev) => !prev);
  };

  const activeLayer = MAP_LAYERS[layerIndex];

  return (
    <div
      ref={containerRef}
      className="relative h-[600px] overflow-hidden"
      onClick={handleDebugClick}
    >
      {/* Everything that should zoom/pan together lives in this layer */}
      <div
        className="absolute inset-0 transition-transform duration-500 ease-in-out"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: "top left",
        }}
      >
        {/* Flat India map — cross-fades out when globe view is active */}
        <img
          src="/india-earth.png"
          className="absolute left-1/2 top-1/2 w-[100%] max-w-none transition-all duration-[350ms] ease-in-out"
          style={{
            filter: activeLayer.filter,
            opacity: isGlobeView ? 0 : 1,
            transform: `translate(-50%, -50%) scale(${isGlobeView ? 0.95 : 1})`,
            pointerEvents: isGlobeView ? "none" : "auto",
          }}
          alt="India map"
        />

        {/* 3D Globe image — cross-fades in when globe view is active */}
        <img
          src="/images/india-terrain.png"
          className="absolute left-1/2 top-1/2 w-[99%] max-w-none transition-all duration-[350ms] ease-in-out"
          style={{
            opacity: isGlobeView ? 1 : 0,
            transform: `translate(-50%, -50%) scale(${isGlobeView ? 1 : 0.95})`,
            pointerEvents: isGlobeView ? "auto" : "none",
          }}
          alt="3D Globe"
        />

        {destinations.map((destination) => {
          const globePos = globePositions[destination.name];
          const pinTop = isGlobeView ? globePos?.top : destination.mapTop;
          const pinLeft = isGlobeView ? globePos?.left : destination.mapLeft;

          if (typeof pinTop !== "number" || typeof pinLeft !== "number") {
            console.warn(
              isGlobeView
                ? `GlobeMap: "${destination.name}" has no entry in globePositions, skipping pin.`
                : `GlobeMap: "${destination.name}" has invalid mapTop/mapLeft, skipping pin.`,
              destination
            );
            return null;
          }

          const isSelected = destination.name === selectedDestination;
          return (
            <div
              key={destination._id}
              className="absolute transition-all duration-300"
              style={{
                top: pinTop,
                left: pinLeft,
                transform: `translate(-50%, -100%) scale(${
                  (isSelected ? 1.3 : 1) / transform.scale
                })`,
                transformOrigin: "bottom center",
                zIndex: isSelected ? 30 : 10,
                opacity: !selectedDestination || isSelected ? 1 : 0.45,
              }}
            >
              {isSelected && (
                <>
                  {/* Outer ripple — expands and fades, restarts via key on selection change */}
                  <span
                    key={`ripple-${destination._id}`}
                    className="absolute left-1/2 bottom-0 -translate-x-1/2 rounded-full pointer-events-none"
                    style={{
                      width: 70,
                      height: 70,
                      bottom: 14,
                      border: "1.5px solid rgba(168,85,247,0.6)",
                      animation: "wcRipple 2.2s ease-out infinite",
                    }}
                  />
                  {/* Soft pulsing halo behind the pin */}
                  <span
                    className="absolute left-1/2 bottom-0 -translate-x-1/2 rounded-full pointer-events-none"
                    style={{
                      width: 44,
                      height: 44,
                      bottom: 14,
                      background: "rgba(168,85,247,0.18)",
                      animation: "wcPulse 2.4s ease-in-out infinite",
                    }}
                  />
                </>
              )}

              <MapPin
                image={destination.image}
                color={isSelected ? "#a855f7" : destination.pinColor}
                size={isSelected ? "w-16 h-16" : "w-12 h-12"}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDestination(destination.name);
                }}
              />
            </div>
          );
        })}

        {/* "You are here" marker */}
        {userLocation && (
          <div
            className="absolute pointer-events-none"
            style={{
              top: userLocation.y,
              left: userLocation.x,
              transform: "translate(-50%, -50%)",
              zIndex: 25,
            }}
          >
            <span
              className="absolute left-1/2 top-1/2 rounded-full"
              style={{
                width: 36,
                height: 36,
                transform: "translate(-50%, -50%)",
                background: "rgba(56,189,248,0.25)",
                animation: "wcPulse 2.4s ease-in-out infinite",
              }}
            />
            <span
              className="block rounded-full"
              style={{
                width: 14,
                height: 14,
                background: "#38bdf8",
                border: "2px solid #fff",
                boxShadow: "0 0 12px #38bdf8",
              }}
            />
          </div>
        )}
      </div>

      {/* Keyframes for the ripple effect (scoped via unique animation name) */}
      <style>{`
        @keyframes wcRipple {
          0% { transform: translateX(-50%) scale(0.5); opacity: 0.6; }
          100% { transform: translateX(-50%) scale(1.5); opacity: 0; }
        }
        @keyframes wcPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.35; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.6; }
        }
      `}</style>

      {/* UI overlay stays fixed, doesn't zoom with the map */}

      {/* Globe View badge — glass pill, fades in/out with the globe, offset below
          the Reset View button (top-4 right-4) so the two never overlap */}
      <div
        className="absolute top-16 right-4 z-40 transition-all duration-[350ms] ease-in-out"
        style={{
          opacity: isGlobeView ? 1 : 0,
          transform: `scale(${isGlobeView ? 1 : 0.95})`,
          pointerEvents: "none",
        }}
      >
        <span
          className="flex items-center gap-1.5 text-xs text-white bg-white/10 backdrop-blur-xl border border-purple-400/50 rounded-full px-3 py-1.5"
          style={{ boxShadow: "0 0 12px rgba(168,85,247,0.45)" }}
        >
          🌍 Globe View
        </span>
      </div>

      <SideControls
        onLocate={handleLocate}
        isLocating={isLocating}
        onToggleLayer={handleToggleLayer}
        activeLayerLabel={activeLayer.label}
        isGlobeView={isGlobeView}
        onToggleGlobe={handleToggleGlobe}
      />
      <Compass />

      {(selectedDestination || userLocation) && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedDestination(null);
            setUserLocation(null);
            setTransform({ scale: 1, x: 0, y: 0 });
          }}
          className="absolute top-4 right-4 z-50 text-xs text-white bg-black/60 border border-white/15 rounded-full px-3 py-1.5 backdrop-blur-md"
        >
          ⤺ Reset view
        </button>
      )}
    </div>
  );
};

export default GlobeMap;