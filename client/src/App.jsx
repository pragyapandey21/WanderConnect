import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Map from "./pages/Map";
import Profile from "./pages/Profile";
import DestinationPage from "./pages/DestinationPage";
import TravelersPage from "./pages/TravelersPage";
import PostsPage from "./pages/PostsPage";
import ChatPage from "./pages/ChatPage";
import TripGroupsPage from "./pages/TripGroupsPage";
import GroupChatPage from "./pages/GroupChatPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Map />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/destination/:name" element={<DestinationPage />} />
        <Route path="/travelers/:name" element={<TravelersPage />} />
        <Route path="/posts/:name" element={<PostsPage />} />
        <Route path="/chat/:id" element={<ChatPage />} />
        <Route
  path="/trip-groups/:destination"
  element={<TripGroupsPage />}
/>
<Route
  path="/group-chat/:groupId"
  element={<GroupChatPage />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;