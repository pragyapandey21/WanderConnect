import TopBar from "../components/TopBar";
import SearchBar from "../components/SearchBar";
import GlobeMap from "../components/GlobeMap";
import DestinationCard from "../components/DestinationCard";
import BottomNav from "../components/BottomNav";
import { useState, useEffect } from "react";
import axios from "axios";

const Map = () => {
  const [allDestinations, setAllDestinations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [destination, setDestination] = useState(null);
  const [cardVisible, setCardVisible] = useState(false);

  // Fetch the full list once — shared by SearchBar (autocomplete) and GlobeMap (pins)
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/destinations");
        setAllDestinations(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAll();
  }, []);

  // Fetch the selected destination's full detail for the card
  useEffect(() => {
    if (!selectedDestination) {
      setCardVisible(false);
      return;
    }

    setCardVisible(false); // reset so the slide-up replays every time

    const fetchDestination = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/destinations/${selectedDestination}`
        );
        setDestination(res.data);
      } catch (error) {
        console.log(error);
        setDestination(null);
      }
    };

    fetchDestination();

    // Let the map's zoom (500ms) mostly finish, then slide the card up —
    // this is what makes search → zoom → glow → card feel sequenced, not instant.
    const timer = setTimeout(() => setCardVisible(true), 500);
    return () => clearTimeout(timer);
  }, [selectedDestination]);

  return (
    <div className="min-h-screen bg-[#030816] text-white flex justify-center">
      {/* Phone Container */}
      <div className="w-full h-screen overflow-y-auto bg-[#020817]">
        {/* Top Section */}
        <TopBar />

        {/* Search Bar */}
        <SearchBar
          destinations={allDestinations}
          onSelect={(name) => setSelectedDestination(name)}
        />

        {/* Globe Section */}
        <GlobeMap
          destinations={allDestinations}
          selectedDestination={selectedDestination}
          setSelectedDestination={setSelectedDestination}
        />

        {/* Destination Card — only shows once something is selected, slides up in */}
        {selectedDestination && (
          <div
            className="transition-all duration-500 ease-out"
            style={{
              transform: cardVisible ? "translateY(0)" : "translateY(40px)",
              opacity: cardVisible ? 1 : 0,
            }}
          >
            <DestinationCard
              destination={destination}
              onClose={() => {
                setSelectedDestination(null);
                setDestination(null);
              }}
            />
          </div>
        )}

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};

export default Map;