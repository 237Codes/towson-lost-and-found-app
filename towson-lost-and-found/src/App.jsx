import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "../components/HomePage/Homepage";
import "./App.css";
import LoginSignup from "../components/LoginSignup/LoginSignup";

function App() {
  return (
    // Note all Pages should go inside the Routes Tags since we are using react router dom
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<LoginSignup />} />
      </Routes>
    </Router>
  );
}

export default App;
