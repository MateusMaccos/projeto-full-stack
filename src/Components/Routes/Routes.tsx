import { Routes, Route } from "react-router-dom";
import LoginSignup from "../LoginSignup/LoginSignup";
import Menu from "../Menu/Menu";
import BroadcastMessages from "../Broadcast/Broadcast";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginSignup />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/broadcast" element={<BroadcastMessages />} />
    </Routes>
  );
};

export default AppRoutes;
