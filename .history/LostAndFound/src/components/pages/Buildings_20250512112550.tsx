/**
 * BuildingPage Component
 * ----------------------
 * Displays a specific building's information along with its associated lost and found items.
 * - Dynamically fetches items based on the building title.
 * - Allows filtering by search query, category, and color.
 * - Provides navigation between "Lost" and "Found" tabs.
 * - Shows building image, address, and contact number.
 */

import { useEffect, useState } from "react";
import ItemsFilter from "@/components/ItemsFilter";
import ItemsGrid from "@/components/ItemsGrid";
import { Map, Phone } from "lucide-react";

interface Props {
  imageUrl?: string;
  imageAlt?: string;
  title: string;
  description: string;
  address: string;
  number: string;
}

interface Item {
  id: string;
  name: string;
  category: string;
  location: string;
  date: string;
  description: string;
  image?: string;
  contact: string;
  type: "lost" | "found";
  colors?: string[];
}

const BuildingPage = (props: Props) => {
  const [activeTab, setActiveTab] = useState<"lost" | "found">("lost");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [lostItems, setLostItems] = useState<Item[]>([]);
  const [foundItems, setFoundItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch lost/found items for this building
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const isDev = import.meta.env['DEV'];
        const baseUrl = isDev ? "http://localhost:3001" : "";
        const res = await fetch(`${baseUrl}/api/items?location=${encodeURIComponent(props.title)}`);
        const data = await res.json();

        // Normalize raw API data into Item[] shape
        const normalize = (items: any[], type: "lost" | "found"): Item[] =>
          items.map(item => ({
            id: String(item.id),
            name: item.name,
            category: item.category,
            location: item.location,
            date: item.date,
            description: item.description,
            contact: item.contact,
            type,
            image: item.image && !item.image.startsWith("data:image")
              ? `data:image/jpeg;base64,${item.image}`
              : item.image,
            colors: item.color
              ? item.color.split(",").map((c: string) => c.trim().toLowerCase())
              : []
          }));

        setLostItems(normalize(data.lost || [], "lost"));
        setFoundItems(normalize(data.found || [], "found"));
      } catch (err) {
        console.error("Error fetching items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [props.title]);

  // Reset filters when the page (building) changes
  useEffect(() => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedColor("");
  }, [props.title]);

  const filterItems = (items: Item[]) =>
    items.filter(item => {
      const matchesSearch = [item.name, item.description, item.category, item.location]
        .some(field => field?.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      const matchesColor = !selectedColor || item.colors?.includes(selectedColor.toLowerCase());

      return matchesSearch && matchesCategory && matchesColor;
    });

  const filteredLostItems = filterItems(lostItems);
  const filteredFoundItems = filterItems(foundItems);

  return (
    <div className="flex min-h-screen flex-col p-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-4 text-center text-3xl font-bold">{props.title}</h1>
        <p className="mb-6 text-center text-lg">{props.description}</p>

        <div className="mx-auto mb-6 flex max-w-2xl flex-col items-center justify-center rounded-lg bg-gray-50 p-4 shadow-sm">
          {props.imageUrl && (
            <img
              src={props.imageUrl}
              alt={props.imageAlt || "Building image"}
              className="mb-4 max-h-80 w-full rounded-lg object-contain object-center shadow-md"
            />
          )}
          <div className="mt-4 flex w-full flex-col space-y-3 md:flex-row md:items-center md:justify-center md:space-x-8 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Map size={20} className="text-yellow-500" />
              <p className="text-gray-700">{props.address}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Phone size={20} className="text-yellow-500" />
              <p className="text-gray-700">{props.number}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex justify-center">
        <div className="flex rounded-md border border-gray-300">
          <button
            onClick={() => setActiveTab("lost")}
            className={`px-6 py-2 ${
              activeTab === "lost"
                ? "bg-yellow-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Lost Items
          </button>
          <button
            onClick={() => setActiveTab("found")}
            className={`px-6 py-2 ${
              activeTab === "found"
                ? "bg-yellow-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Found Items
          </button>
        </div>
      </div>

      {/* Search + Grid */}
      <ItemsFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
      />
      {loading ? (
        <p className="text-center text-gray-500">Loading items...</p>
      ) : (
        <ItemsGrid
          activeTab={activeTab}
          filteredLostItems={filteredLostItems}
          filteredFoundItems={filteredFoundItems}
        />
      )}

      {/* Actions */}
      <div className="mx-auto mt-4 flex w-full max-w-4xl justify-center space-x-4">
        <a
          href="/report-lost"
          className="rounded-md bg-yellow-500 px-6 py-3 font-medium text-white hover:bg-yellow-600"
        >
          Report Lost Item
        </a>
        <a
          href="/report-found"
          className="rounded-md bg-black px-6 py-3 font-medium text-white hover:bg-black/80"
        >
          Report Found Item
        </a>
      </div>
    </div>
  );
};

export default BuildingPage;
