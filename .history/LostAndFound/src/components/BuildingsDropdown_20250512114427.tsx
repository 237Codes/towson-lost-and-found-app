/**
 * BuildingsDropdown Component
 * ---------------------------
 * Renders a toggleable dropdown menu listing campus buildings.
 * - Clicking the "Buildings" button reveals a styled list of building links.
 * - Used for navigation to building-specific lost & found pages.
 */

import { useState } from "react";

const BuildingsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative flex flex-row items-center">
      <div>
        <button className="hover:text-yellow-600" onClick={toggleDropdown}>
          Buildings
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-2 w-60 space-y-4 rounded-lg bg-black px-8 py-10 text-white shadow-lg">
            <ul className="list-none p-0">
              <li className="mb-4">
                <a
                  href="/buildings/stephens-hall"
                  className="hover:text-yellow-600"
                >
                  Stephens Hall
                </a>
              </li>
              <li className="mb-4">
                <a
                  href="/buildings/science-complex"
                  className="hover:text-yellow-600"
                >
                  Science Complex
                </a>
              </li>
              <li className="mb-4">
                <a
                  href="/buildings/health-professions"
                  className="hover:text-yellow-600"
                >
                  Health Professions
                </a>
              </li>
              <li className="mb-4">
                <a
                  href="/buildings/university-union"
                  className="hover:text-yellow-600"
                >
                  University Union
                </a>
              </li>
              <li className="mb-4">
                <a
                  href="/buildings/center-for-the-arts"
                  className="hover:text-yellow-600"
                >
                  Center for the Arts
                </a>
              </li>
              <li className="mb-4">
                <a
                  href="/buildings/liberal-arts-building"
                  className="hover:text-yellow-600"
                >
                  Liberal Arts Building
                </a>
              </li>
              <li className="mb-4">
                <a
                  href="/buildings/york-road"
                  className="hover:text-yellow-600"
                >
                  York Rd
                </a>
              </li>
              <li className="mb-4">
                <a
                  href="/buildings/hawkins-hall"
                  className="hover:text-yellow-600"
                >
                  Hawkins Hall
                </a>
              </li>
              <li className="mb-4">
                <a
                  href="/buildings/psychology-building"
                  className="hover:text-yellow-600"
                >
                  Psychology Building
                </a>
              </li>
              <li className="mb-4">
                <a
                  href="/buildings/ten-west"
                  className="hover:text-yellow-600"
                >
                  Ten West
                </a>
              </li>
              <li>
                <a
                  href="/buildings/west-village-commons"
                  className="hover:text-yellow-600"
                >
                  West Village Commons
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuildingsDropdown;
