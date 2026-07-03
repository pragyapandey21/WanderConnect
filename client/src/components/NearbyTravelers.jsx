const travelers = [
  {
    id: 1,
    name: "Priya",
    city: "Delhi",
    status: "Open To Chat",
    image: "/images/priya.jpg",
  },
  {
    id: 2,
    name: "Rahul",
    city: "Mumbai",
    status: "Backpacker",
    image: "/images/rahul.jpg",
  },
  {
    id: 3,
    name: "Aman",
    city: "Pune",
    status: "Visiting in July",
    image: "/images/post1.jpg",
  },
];

const NearbyTravelers = () => {
  return (
    <div className="mt-8">
      {/* Heading */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-white text-2xl font-bold">
          Nearby Travelers
        </h2>

        <button className="text-pink-400 text-sm">
          View All →
        </button>
      </div>

      {/* Travelers */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">

  {travelers.map((traveler) => (

    <div
      key={traveler.id}
      className="min-w-[180px] bg-white/5 border border-white/10 rounded-3xl p-4"
    >

      {/* Avatar */}
      <div className="relative w-fit mx-auto">

        <img
          src={traveler.image}
          alt=""
          className="w-16 h-16 rounded-full object-cover border-2 border-pink-500"
        />

        {/* Online badge */}
        <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-[#020617]" />

      </div>

      {/* Info */}
      <div className="text-center mt-4">

        <h3 className="text-white font-semibold">
          {traveler.name}
        </h3>

        <p className="text-xs text-gray-400 mt-1">
          {traveler.status}
        </p>

        <p className="text-xs text-gray-500 mt-1">
          📍 {traveler.city}
        </p>

      </div>

      {/* Chat button */}
      <button className="w-full mt-4 py-2 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm">
        Connect
      </button>

    </div>

  ))}

</div>
    </div>
  );
};

export default NearbyTravelers;