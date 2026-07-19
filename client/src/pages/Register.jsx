import { MdEmail } from "react-icons/md";
import { FaLock, FaUser } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Register() {

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

const [username, setUsername] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const handleRegister = async () => {
  try {

    const res = await API.post("/auth/register", {
      username,
      email,
      password
    });

    localStorage.setItem("token", res.data.token);

    alert("Registration Successful!");

    navigate("/home");

  } catch (error) {

    alert(error.response?.data?.message || "Registration Failed");

  }
};

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 bg-cover bg-center"
    style={{
  backgroundImage:
    "linear-gradient(rgba(5,8,22,0.85), rgba(5,8,22,0.95)), url('/images/bg.png')"
}}
    >
      <div className="w-full max-w-sm bg-black/20 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl shadow-purple-900">

        <div className="flex justify-center mb-6">
          <div className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent">
            W
          </div>
        </div>

        <h1 className="text-white text-4xl font-bold text-center">
          Create Account
        </h1>

        <p className="text-gray-300 text-center mt-2 mb-8">
          Join WanderConnect
        </p>

        <div className="space-y-4">

          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 pl-12 rounded-xl bg-[#111827] text-white border border-gray-700 outline-none focus:border-purple-500"
            />
          </div>

          <div className="relative">
            <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 pl-12 rounded-xl bg-[#111827] text-white border border-gray-700 outline-none focus:border-purple-500"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 pl-12 rounded-xl bg-[#111827] text-white border border-gray-700 outline-none focus:border-purple-500"
            />
          </div>

          <button
  onClick={handleRegister}
  className="w-full bg-gradient-to-r from-fuchsia-600 to-purple-600 p-4 rounded-xl text-white font-semibold shadow-lg shadow-purple-500/50"
>
  Sign Up
</button>

          <button className="w-full border border-gray-600 text-white p-4 rounded-xl flex items-center justify-center gap-3">
            <FcGoogle className="text-2xl" />
            Continue with Google
          </button>

          <p className="text-center text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-400">
              Login
            </Link>
          </p>

        </div>

      </div>
    </div>
  );
}

export default Register;