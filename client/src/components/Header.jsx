import { useEffect, useState } from "react";
import axios from "axios";
import { FaBell } from "react-icons/fa";
import { HiMenu } from "react-icons/hi";
import { IoNotifications } from "react-icons/io5";

function Header() {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  fetchNotifications();
}, []);
  return (
    <div className="flex justify-between items-center px-6 pt-8">

  {/* Menu */}
 <button className="w-14 h-14 rounded-full bg-[#151B2E] border border-[#2a3555] flex items-center justify-center shadow-[0_0_18px_rgba(168,85,247,0.25)]">
  <span className="text-red-500 text-4xl">
  TEST
</span>
</button>
  {/* Logo */}
  <h1 className="text-white text-3xl font-extrabold tracking-tight">
  <span>Wander</span>
  <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
    Connect
  </span>
</h1>

  {/* Notification */}
  <div
  className="relative cursor-pointer"
  onClick={() => setShowNotifications(!showNotifications)}
>

    <IoNotifications className="text-yellow-300 text-3xl" />

    <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
  {notifications.length}
</div>

  </div>
{showNotifications && (
  <div className="absolute top-12 right-0 w-72 bg-[#1f2937] rounded-2xl shadow-xl p-4 z-50">
    <h3 className="text-white font-bold mb-3">
      Notifications
    </h3>

    {notifications.length === 0 ? (
      <p className="text-gray-400 text-sm">
        No notifications
      </p>
    ) : (
      notifications.map((notification) => (
        <div
          key={notification._id}
          className="border-b border-gray-700 py-3"
        >
          <p className="text-white text-sm">
            <span className="font-semibold">
              {notification.sender.username}
            </span>{" "}
            followed you
          </p>
        </div>
      ))
    )}
  </div>
)}
</div>
  );
}

export default Header;