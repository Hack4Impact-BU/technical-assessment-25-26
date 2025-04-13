import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full flex justify-between items-center p-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow">
      <h1 className="text-2xl font-bold">🌞 SolMate</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/history" className="hover:underline">History</Link>
      </div>
    </nav>
  );
}