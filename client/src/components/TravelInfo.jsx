const TravelInfo = () => {
  return (
    <div className="mt-10">

      <h2 className="text-2xl font-bold text-white mb-5">
        Travel Info
      </h2>

      <div className="grid grid-cols-2 gap-4">

        <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
          <h3 className="text-yellow-400 text-lg">
            🌤 Best Time
          </h3>
          <p className="text-gray-300 mt-2">
            Nov - Feb
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
          <h3 className="text-green-400 text-lg">
            💰 Budget
          </h3>
          <p className="text-gray-300 mt-2">
            ₹15k - ₹40k
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
          <h3 className="text-blue-400 text-lg">
            ⏳ Duration
          </h3>
          <p className="text-gray-300 mt-2">
            4-5 Days
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
          <h3 className="text-pink-400 text-lg">
            🚕 Transport
          </h3>
          <p className="text-gray-300 mt-2">
            Taxi • Scooty
          </p>
        </div>

      </div>

    </div>
  );
};

export default TravelInfo;