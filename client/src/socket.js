import { io } from "socket.io-client";

const socket = io("https://wanderconnect.onrender.com");

export default socket;