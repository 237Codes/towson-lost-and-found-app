import { useEffect, useState } from "react";
import ItemsFilter from "@/components/ItemsFilter";
import ItemsGrid from "@/components/ItemsGrid";
import type { Item as ItemType } from "@/components/ItemsGrid";

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState<"lost" | "found">("lost");
  const [searchQuery, setSearchQuery] = useState("");
  const [lostItems, setLostItems] = useState<ItemType[]>([]);
  const [foundItems, setFoundItems] = useState<ItemType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const [lostRes, foundRes] = await Promise.all([
          fetch("http://localhost:3001/api/items?type=lost"),
          fetch("http://localhost:3001/api/items?type=found"),
        ]);

        const lostJson = await lostRes.json();
        const foundJson = await foundRes.json();

        const convertIdToString = (items: any[]): ItemType[] =>
          items.map((item) => ({
            id: String(item.id),
            name: item.name,
            category: item.category,
            location: item.location,
            date: item.date,
            description: item.description,
            contact: item.contact,
            image: item.image || undefined,
          }));

        setLostItems(convertIdToString(lostJson.lost || []));
        setFoundItems(convertIdToString(foundJson.found || []));
      } catch (err) {
        console.error("Failed to fetch items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const filterItems = (items: ItemType[]) =>
    items.filter((item) =>
      [item.name, item.description, item.category, item.location]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

  const filteredLost = filterItems(lostItems);
  const filteredFound = filterItems(foundItems);

  return (
    <div className="min-h-screen bg-white text-gray-800 px-6 py-10">
      <div className="mx-auto max-w-6xl">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-8 font-sans">
        Lost & Found Feed
      </h1>

        <div className="flex justify-center mb-8 space-x-0 rounded-lg overflow-hidden border border-gray-300 w-fit mx-auto shadow-sm">
          <button
            className={`px-6 py-2 text-lg font-semibold transition-all duration-200 ${
              activeTab === "lost"
                ? "bg-yellow-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("lost")}
          >
            Lost
          </button>
          <button
            className={`px-6 py-2 text-lg font-semibold transition-all duration-200 ${
              activeTab === "found"
                ? "bg-yellow-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("found")}
          >
            Found
          </button>
        </div>

        <div className="mb-6">
          <ItemsFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        {loading ? (
          <p className="text-center text-lg text-gray-500 mt-16 animate-pulse">Loading items...</p>
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