import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Reset from "./Pages/Reset";
import Login from "./Pages/Login";
import Header from "./Components/Header";

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

          {/* Private Routes Here */}
          <Route></Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
