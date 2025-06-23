import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 p-4 text-white shadow-md flex justify-between items-center">
      <div className="font-bold text-lg">Feedback System</div>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">Login</Link>
        <Link to="/register" className="hover:underline">Register</Link>
        <Link to="/manager" className="hover:underline">Manager</Link>
        <Link to="/employee" className="hover:underline">Employee</Link>
        <Link to="/feedback-request" className="hover:underline">Request Feedback</Link>
        <Link to="/timeline" className="hover:underline">Timeline</Link>
      </div>
    </nav>
  );
}
