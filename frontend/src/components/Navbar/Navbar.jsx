import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-amber-200 text-white p-4 flex items-center justify-between">
      <NavLink to="/map" className="text-2xl font-bold hover:underline text-sky-500">
        SunSpot
      </NavLink>

      <ul className="flex space-x-6 text-sky-500">
        <li>
          <NavLink
            to="/map"
            className={({ isActive }) =>
              isActive ? "underline" : "hover:underline"
            }
          >
            Map
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              isActive ? "underline" : "hover:underline"
            }
          >
            History
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
