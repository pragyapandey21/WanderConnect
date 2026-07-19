import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const handleLogin = async () => {
  try {

    const res = await API.post("/auth/login", {
      email,
      password
    });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));


    alert("Login Successful!");

    navigate("/home");

  } catch (error) {

    alert(error.response?.data?.message || "Login Failed");

  }
};
  return (
    <div
  className="min-h-screen flex items-center justify-center px-6 bg-cover bg-center"
  style={{
    backgroundImage:
      "linear-gradient(rgba(5,8,22,0.6), rgba(5,8,22,0.8)), url('/images/bg.png')"
  }}
>
      <div className="w-full max-w-sm bg-black/20 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl shadow-purple-900">

        <div className="flex justify-center mb-6">
          <div className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent">
            W
          </div>
        </div>

        <h1 className="text-white text-4xl font-bold text-center">
          WanderConnect
        </h1>

        <p className="text-gray-300 text-center mt-2 mb-8">
          Explore • Connect • Journey Together
        </p>

        <div className="space-y-4">

          <div className="relative">
  <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />

  <input
    type="email"
    placeholder="Email or Phone"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full p-4 pl-12 rounded-xl bg-[#111827] text-white border border-gray-700 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 duration-300"
  />
</div>

          <div className="relative">
  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full p-4 pl-12 rounded-xl bg-[#111827] text-white border border-gray-700 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 duration-300"
  />
  <button
  type="button"
  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
  onClick={() => setShowPassword(!showPassword)}
>
  {showPassword ? <FaEyeSlash /> : <FaEye />}
</button>
</div>

<div className="flex justify-end">
  <p className="text-sm text-purple-300 cursor-pointer hover:text-purple-200">
    Forgot Password?
  </p>
</div>

          <button
  onClick={handleLogin}
  className="w-full bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:scale-105 duration-300 text-white p-4 rounded-xl font-semibold shadow-lg shadow-purple-500/50"
>
  Login
</button>

          <button className="w-full border border-gray-600 text-white p-4 rounded-xl flex items-center justify-center gap-3 hover:bg-white/10 hover:scale-105 duration-300">

  <FcGoogle className="text-2xl" />

  Continue with Google

</button>

          <p className="text-center text-gray-400">
            Don't have an account?{" "}
            <Link
  to="/register"
  className="text-purple-400 hover:text-purple-300"
>
  Sign up
</Link>
          </p>

        </div>
      </div>

    </div>
  );
}

export default Login;