import { FaLocationArrow } from "react-icons/fa";

const Compass = () => {
  return (
    <div className="absolute bottom-12 right-4">

      <div className="w-24 h-24 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center relative">

        <span className="absolute top-2 text-red-500 font-semibold">
          N
        </span>

        <span className="absolute bottom-2 text-white">
          S
        </span>

        <span className="absolute left-2 text-white">
          W
        </span>

        <span className="absolute right-2 text-white">
          E
        </span>

        <FaLocationArrow className="text-blue-400 text-2xl rotate-45" />

      </div>

    </div>
  );
};

export default Compass;