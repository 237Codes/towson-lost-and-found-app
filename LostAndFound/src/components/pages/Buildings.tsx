import { useEffect, useState } from "react";
import axios from "axios";
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

interface ItemProps {
  id: string;
  name: string;
  category: string;
  location: string;
  date: string;
  description: string;
  image?: string;
  contact: string;
}

const BuildingPage = (props: Props) => {
  const [lostItems, setLostItems] = useState<ItemProps[]>([]);
  const [foundItems, setFoundItems] = useState<ItemProps[]>([]);
  const [activeTab, setActiveTab] = useState<"lost" | "found">("lost");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const [lostResponse, foundResponse] = await Promise.all([
          axios.get('http://localhost:3001/lost-items'),
          axios.get('http://localhost:3001/found-items')
        ]);
  
        setLostItems(lostResponse.data.map((item: any) => ({
          id: item.id,
          name: item.itemName,
          category: item.category,
          location: item.location,
          date: item.date,
          description: item.description,
          image: item.imageUrl,
          contact: item.contactEmail,
        })));
  
        setFoundItems(foundResponse.data.map((item: any) => ({
          id: item.id,
          name: item.itemName,
          category: item.category,
          location: item.location,
          date: item.date,
          description: item.description,
          image: item.imageUrl,
          contact: item.contactEmail,
        })));
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchItems();
  }, []);  

  // Filter items based on search query
  const filteredLostItems = lostItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFoundItems = foundItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col p-4">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="mb-4 text-center text-3xl font-bold">{props.title}</h1>
        <p className="mb-6 text-center text-lg">{props.description}</p>

        {/* Contact Info */}
        <div className="mx-auto mb-6 flex max-w-2xl flex-col items-center justify-center rounded-lg bg-gray-50 p-4 shadow-sm">
          {props.imageUrl && (
            <img
              src={props.imageUrl}
              alt={props.imageAlt || "Building image"}
              className="mb-4 h-48 w-full rounded-lg object-cover shadow-md"
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

      {/* Tab Navigation */}
      <div className="mb-6 flex justify-center">
        <div className="flex rounded-md border border-gray-300">
          <button
            onClick={() => setActiveTab("lost")}
            className={`px-6 py-2 ${activeTab === "lost" ? "bg-yellow-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
          >
            Lost Items
          </button>
          <button
            onClick={() => setActiveTab("found")}
            className={`px-6 py-2 ${activeTab === "found" ? "bg-yellow-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
          >
            Found Items
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <ItemsFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Items Grid */}
      <ItemsGrid
        activeTab={activeTab}
        filteredLostItems={filteredLostItems}
        filteredFoundItems={filteredFoundItems}
      />

      {/* Report Section */}
      <div className="mx-auto mt-4 flex w-full max-w-4xl justify-center space-x-4">
        <a href="/report-lost" className="rounded-md bg-yellow-500 px-6 py-3 font-medium text-white hover:bg-yellow-600">
          Report Lost Item
        </a>
        <a href="/report-found" className="rounded-md bg-black px-6 py-3 font-medium text-white hover:bg-black/80">
          Report Found Item
        </a>
      </div>
    </div>
  );
};

export default BuildingPage;