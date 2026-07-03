const events = [
  {
    id: 1,
    title: "Sunburn Goa",
    date: "27 Dec 2026",
    location: "Vagator Beach",
    emoji: "🎉",
  },
  {
    id: 2,
    title: "Beach Festival",
    date: "10 Jan 2027",
    location: "Calangute",
    emoji: "🏖",
  },
];

const UpcomingEvents = () => {
  return (
    <div className="mt-10">

      <div className="flex justify-between mb-5">
        <h2 className="text-2xl font-bold text-white">
          Upcoming Events
        </h2>

        <button className="text-pink-400 text-sm">
          View All →
        </button>
      </div>

      <div className="space-y-4">

        {events.map((event) => (

          <div
            key={event.id}
            className="bg-white/5 border border-white/10 rounded-3xl p-5"
          >

            <div className="flex justify-between">

              <div>

                <h3 className="text-white text-lg font-semibold">
                  {event.emoji} {event.title}
                </h3>

                <p className="text-gray-400 mt-2">
                  📅 {event.date}
                </p>

                <p className="text-gray-500 text-sm mt-1">
                  📍 {event.location}
                </p>

              </div>

              <button className="h-fit px-4 py-2 rounded-2xl bg-pink-500 text-white text-sm">
                View
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default UpcomingEvents;