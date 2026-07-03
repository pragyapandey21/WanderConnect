function CompanionSection() {
  return (
    <div className="mx-5 mt-8">

      <div className="flex justify-between items-center">

        <h2 className="text-white text-2xl font-bold">
          Travel Companions ❤️
        </h2>

        <button className="text-purple-400">
          See All
        </button>

      </div>

      <div className="mt-5 bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl overflow-hidden">

        <img
          src="/images/companion1.jpg"
          className="w-full h-[150px] object-cover"
        />

        <div className="p-4">

          <h3 className="text-white text-xl font-bold">
            Ananya, 24
          </h3>

          <p className="text-gray-400 mt-1">
            Delhi • Solo Traveler
          </p>

          <div className="mt-4 flex justify-between items-center">

            <div className="bg-green-500 px-4 py-2 rounded-2xl text-white">
              94% Match
            </div>

            <button className="bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-2 rounded-2xl text-white">
              Connect
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default CompanionSection;