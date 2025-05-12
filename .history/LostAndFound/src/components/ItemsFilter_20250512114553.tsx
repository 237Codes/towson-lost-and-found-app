/**
 * ItemsFilter Component
 * ---------------------
 * Provides search and advanced filtering for items by category, color, and location.
 * - Includes a toggleable filter panel and inline search bar.
 * - Controlled via props for full parent-state synchronization.
 * - Conditionally renders location filter if provided.
 */

import { useState } from "react";
import { Filter, Search } from "lucide-react";

interface ItemsFilterProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  selectedColor: string;
  setSelectedColor: React.Dispatch<React.SetStateAction<string>>;
  selectedLocation?: string;
  setSelectedLocation?: React.Dispatch<React.SetStateAction<string>>;
}

const categories = [
  "Electronics", "Clothing", "ID Cards", "Keys", "Accessories", "Backpacks/Bags",
  "Books/Notebooks", "Jewelry", "Eyewear", "Water Bottles", "Headphones/Earbuds",
  "Chargers/Cables", "Footwear", "Sports Equipment", "Musical Instruments", "Wallets",
  "Cash", "Other"
];

const colors = [
  { name: "Beige", value: "#f5f5dc" },
  { name: "Black", value: "#000" },
  { name: "Blue", value: "#0000ff" },
  { name: "Brown", value: "#8b0000" },
  { name: "Gray", value: "#808080" },
  { name: "Green", value: "#008000" },
  { name: "Multi", value: "linear-gradient(45deg, red, blue)" },
  { name: "Orange", value: "orange" },
  { name: "Pink", value: "pink" },
  { name: "Purple", value: "purple" },
  { name: "Red", value: "red" },
  { name: "Turquoise", value: "turquoise" },
  { name: "White", value: "#fff" },
  { name: "Yellow", value: "yellow" }
];

const locations = [
  "Stephens Hall", "Science Complex", "Health Professions", "University Union",
  "Center For The Arts", "Liberal Arts Building", "York Rd", "Hawkins Hall",
  "Psychology Building", "Other"
];

const ItemsFilter = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedColor,
  setSelectedColor,
  selectedLocation,
  setSelectedLocation
}: ItemsFilterProps) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="mb-8">
      <div className="mx-auto flex max-w-3xl items-center rounded-lg border border-gray-300 bg-white px-3 py-2">
        <Search size={20} className="mr-2 text-gray-400" />
        <input
          id="search-input"
          type="text"
          placeholder="Search items by name, category, location..."
          className="w-full border-none bg-transparent focus:outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShowFilters((prev) => !prev)}
          className="flex items-center space-x-1 rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
        >
          <Filter size={16} />
          <span>Filter</span>
        </button>
      </div>

      {showFilters && (
        <div className="mx-auto mt-4 max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-4 border border-gray-300 p-4 rounded-lg bg-white shadow-sm">
          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border rounded-md p-2"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Color Filter */}
          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <select
              id="color"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value.toLowerCase())}
              className="w-full border rounded-md p-2"
            >
              <option value="">All Colors</option>
              {colors.map((color) => (
                <option key={color.name} value={color.name.toLowerCase()}>{color.name}</option>
              ))}
            </select>
          </div>

          {/* Location Filter (only if provided) */}
          {typeof selectedLocation !== "undefined" && setSelectedLocation && (
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <select
                id="location"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full border rounded-md p-2"
              >
                <option value="">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ItemsFilter;
