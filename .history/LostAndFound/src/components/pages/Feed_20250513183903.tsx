/**
 * FeedPage Component
 * ------------------
 * Displays all lost and found items on campus.
 * - Fetches lost and found items from the API.
 * - Allows filtering by search, category, color, and location.
 * - Toggles between "Lost" and "Found" tabs.
 * - Shows a loading state, error message, or item grid based on fetch result.
 */

import { useEffect, useState } from "react";
import ItemsFilter from "@/components/ItemsFilter";
import ItemsGrid from "@/components/ItemsGrid";
import type { Item as ItemType } from "@/components/ItemsGrid";

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState<"lost" | "found">("lost");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [lostItems, setLostItems] = useState<ItemType[]>([]);
  const [foundItems, setFoundItems] = useState<ItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch lost and found items on initial mount
  useEffect(() => {
    const baseUrl = import.meta.env['PUBLIC_API_BASE_URL'] || '';

    const fetchItems = async () => {
      try {
        const [lostRes, foundRes] = await Promise.all([
          fetch(`${baseUrl}/api/items?type=lost`),
          fetch(`${baseUrl}/api/items?type=found`),
        ]);

        if (!lostRes.ok || !foundRes.ok) throw new Error("Fetch failed");

        const lostJson = await lostRes.json();
        const foundJson = await foundRes.json();

        // Normalize item format from API
        const convertItems = (
          items: any[],
          type: "lost" | "found"
        ): ItemType[] =>
          items.map((item) => ({
            id: String(item.id),
            name: item.name,
            category: item.category,
            location: item.location,
            date: item.date,
            description: item.description,
            contact: item.contact,
            image: item.image || undefined,
            type,
            colors: item.color
              ? item.color.split(",").map((c: string) => c.trim().toLowerCase())
              : [],
          }));

        setLostItems(convertItems(lostJson.lost, "lost"));
        setFoundItems(convertItems(foundJson.found, "found"));
        setError(null);
      } catch (err) {
        console.error("❌ Error fetching items:", err);
        setError("Failed to load items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Apply filters
  const filterItems = (items: ItemType[]) =>
    items.filter((item) => {
      const matchesSearch = [item.name, item.description, item.category, item.location]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesCategory =
        !selectedCategory || item.category === selectedCategory;

      const matchesColor =
        !selectedColor ||
        item.colors?.some((c) => c === selectedColor.toLowerCase());

      const matchesLocation =
        !selectedLocation || item.location === selectedLocation;

      return (
        matchesSearch && matchesCategory && matchesColor && matchesLocation
      );
    });

  const filteredLost = filterItems(lostItems);
  const filteredFound = filterItems(foundItems);

  return (
    <div className="min-h-screen bg-white text-gray-800 px-6 py-10 dark:bg-black dark:text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold text-center mb-8 font-sans">
          Lost & Found Feed
        </h1>

        <div className="flex justify-center mb-8 space-x-0 rounded-lg overflow-hidden border border-gray-300 w-fit mx-auto shadow-sm">
          <button
            className={`px-6 py-2 text-lg font-semibold transition-all duration-200 ${
              activeTab === "lost"
                ? "bg-yellow-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200"
            }`}
            onClick={() => setActiveTab("lost")}
          >
            Lost
          </button>
          <button
            className={`px-6 py-2 text-lg font-semibold transition-all duration-200 ${
              activeTab === "found"
                ? "bg-yellow-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200"
            }`}
            onClick={() => setActiveTab("found")}
          >
            Found
          </button>
        </div>

        <div className="mb-6">
          <ItemsFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
          />
        </div>

        {loading ? (
          <p className="text-center text-lg text-gray-500 mt-16 animate-pulse">
            Loading items...
          </p>
        ) : error ? (
          <p className="text-center text-red-500 mt-16">{error}</p>
        ) : (
          <ItemsGrid
            activeTab={activeTab}
            filteredLostItems={filteredLost}
            filteredFoundItems={filteredFound}
          />
        )}
      </div>
    </div>
  );
}
