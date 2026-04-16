import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div style={{ padding: "10px", background: "#333", color: "white" }}>
      <h2>Project Management Tool</h2>

      <Link to="/" style={{ marginRight: 10, color: "white" }}>
        Login
      </Link>

      <Link to="/register" style={{ marginRight: 10, color: "white" }}>
        Register
      </Link>

      <Link to="/dashboard" style={{ marginRight: 10, color: "white" }}>
        Dashboard
      </Link>

      <Link to="/board" style={{ color: "white" }}>
        Project Board
      </Link>
    </div>
  );
}

export default Navbar;