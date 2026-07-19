import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Map from "./pages/Map";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import DestinationPage from "./pages/DestinationPage";
import TravelersPage from "./pages/TravelersPage";
import PostsPage from "./pages/PostsPage";
import ChatPage from "./pages/ChatPage";
import TripGroupsPage from "./pages/TripGroupsPage";
import GroupChatPage from "./pages/GroupChatPage";
import CreatePost from "./pages/CreatePost";
import BottomNav from "./components/BottomNav";

// Lives inside <BrowserRouter> so useNavigate() is available here
function AppContent() {
  const navigate = useNavigate();

  const handleTabChange = (tabId) => {
    switch (tabId) {
      case "explore":
  navigate("/home");
  break;
      case "companions":
        navigate("/travelers/goa");
        break;
      case "trips":
        navigate("/trip-groups/goa");
        break;
      case "profile":
        navigate("/profile");
        break;
      case "plus":
        navigate("/create-post");
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
<Route path="/home" element={<Map />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/create-post" element={<CreatePost />} />
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
      <BottomNav onTabChange={handleTabChange} />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;