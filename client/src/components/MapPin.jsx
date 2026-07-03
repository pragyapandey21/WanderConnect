const MapPin = ({
  image,
  color = "#ec4899",
  size = "w-12 h-12",
  onClick,
}) => {
  return (
    <div
  className="flex flex-col items-center cursor-pointer"
  onClick={onClick}
>
      {/* Image */}
      <div
        className={`${size} rounded-full overflow-hidden border-4`}
        style={{
          borderColor: color,
          boxShadow: `0 0 25px ${color}`,
        }}
      >
        <img
          src={image}
          className="w-full h-full object-cover"
          alt=""
        />
      </div>

      {/* Stem */}
      <div
        className="w-1 h-10"
        style={{ backgroundColor: color }}
      ></div>

      {/* Glow */}
      <div
        className="w-2 h-2 rounded-full"
        style={{
          backgroundColor: color,
          boxShadow: `0 0 25px ${color}`,
        }}
      ></div>
    </div>
  );
};

export default MapPin;