function TripSection() {
  return (
    <div className="mx-5 mt-8">

      <div className="flex justify-between items-center">
        <h2 className="text-white text-2xl font-bold">
          Upcoming Trips
        </h2>

        <button className="text-purple-400">
          See All
        </button>
      </div>

      {/* Card 1 */}
      <div className="mt-5 bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl overflow-hidden">

        <img
          src="/images/trip1.jpg"
          className="w-full h-[100px] object-cover"
        />

        <div className="p-4">

          <h3 className="text-white font-bold text-xl">
            Goa Trip 🌴
          </h3>

          <p className="text-gray-400">
            10 Jul - 15 Jul
          </p>

          <p className="text-purple-300 mt-2">
            Budget ₹7000
          </p>

        </div>

      </div>

      {/* Card 2 */}
      <div className="mt-5 bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl overflow-hidden">

        <img
          src="/images/trip2.jpg"
          className="w-full h-[100px] object-cover"
        />

        <div className="p-4">

          <h3 className="text-white font-bold text-xl">
            Manali Trip 🏔
          </h3>

          <p className="text-gray-400">
            25 Jul - 30 Jul
          </p>

          <p className="text-purple-300 mt-2">
            Budget ₹12000
          </p>

        </div>

      </div>

    </div>
  );
}

export default TripSection;