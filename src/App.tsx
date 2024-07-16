import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Reset from "./Pages/Reset";
import Login from "./Pages/Login";
import Header from "./Components/Header";
import ResetLink from "./Pages/ResetLink";
import Profile from "./Pages/Profile";
import ProtectedRoute from "./Components/ProtectedRoute";
import Verify from "./Pages/Verify";

function App() {
  return (
    <>
      <Header />
      <Routes>
        {/* Public Routes Here */}

        <Route path="/">
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/reset/:id" element={<ResetLink />} />
        </Route>
        {/* Private Routes Here */}
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/verify" element={<Verify />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
