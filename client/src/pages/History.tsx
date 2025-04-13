import Navbar from "../components/Navbar";

export default function History() {
  return (
    <div className="h-screen flex flex-col">
      <div className="h-16">
        <Navbar />
      </div>
      <div className="flex-1 flex items-center justify-center text-xl text-gray-700">
        History here.
      </div>
    </div>
  );
}