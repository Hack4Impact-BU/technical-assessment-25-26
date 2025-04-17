import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full flex justify-between items-center px-6 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow">
      {/* Clickable Logo */}
      <Link to="/" className="text-2xl font-bold hover:opacity-90 transition-opacity">
        🌞 SolMate
      </Link>
      <div className="space-x-6 text-lg">
        <Link to="/history" className="hover:text-yellow-100 transition-colors">
          History
        </Link>
      </div>
    </nav>
  );
}