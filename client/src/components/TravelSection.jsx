function TravelSection() {
  return (
    <div className="mx-5 mt-8">

      <div className="flex justify-between items-center">

        <h2 className="text-white text-2xl font-bold">
          Travel Experiences
        </h2>

        <button className="text-purple-400">
          See All
        </button>

      </div>

      <div className="mt-5 bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl overflow-hidden">

        <img
          src="/images/post2.jpg"
          className="w-full h-100 object-cover rounded-t-3xl"
        />

        <div className="p-4">

          <h3 className="text-white text-xl font-bold">
            Bali Paradise
          </h3>

          <p className="text-gray-400 mt-2">
            Experience beautiful beaches and luxury resorts.
          </p>

          <button className="mt-4 bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-3 rounded-2xl text-white">
            Explore
          </button>

        </div>

      </div>

    </div>
  );
}

export default TravelSection;