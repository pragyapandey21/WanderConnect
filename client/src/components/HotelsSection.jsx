const hotels = [
  {
    id: 1,
    name: "Sea View Resort",
    image: "/images/post1.jpg",
    price: "₹3500/night",
    rating: "4.8 ⭐",
  },
  {
    id: 2,
    name: "Taj Holiday Village",
    image: "/images/post2.jpg",
    price: "₹8000/night",
    rating: "4.9 ⭐",
  },
  {
    id: 3,
    name: "W Resort Goa",
    image: "/images/post3.jpg",
    price: "₹15000/night",
    rating: "5.0 ⭐",
  },
];

const HotelsSection = () => {
  return (
    <div className="mt-10">

      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold text-white">
          Hotels Nearby
        </h2>

        <button className="text-pink-400 text-sm">
          View All →
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">

        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="min-w-[220px] bg-white/5 border border-white/10 rounded-3xl overflow-hidden"
          >

            <img
              src={hotel.image}
              alt=""
              className="h-40 w-full object-cover"
            />

            <div className="p-4">

              <h3 className="text-white font-semibold">
                {hotel.name}
              </h3>

              <p className="text-yellow-400 mt-2">
                {hotel.rating}
              </p>

              <p className="text-gray-400 mt-2">
                {hotel.price}
              </p>

              <button className="w-full mt-4 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                Book Now
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default HotelsSection;