import ItemsFilter from "@/components/ItemsFilter";
import ItemsGrid from "@/components/ItemsGrid";
import { Map, Phone } from "lucide-react";
import { useState } from "react";

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
  const [activeTab, setActiveTab] = useState<"lost" | "found">("lost");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for lost items
  const lostItems: ItemProps[] = [
    {
      id: "l1",
      name: "Blue Backpack",
      category: "Bag",
      location: "Science Complex",
      date: "April 10, 2025",
      description:
        "Small blue Jansport backpack with a water bottle pocket. Contains notebooks and a calculator.",
      image: "/images/bluebackpack.webp",
      contact: "john.doe@example.com",
    },
    {
      id: "l2",
      name: "iPhone 16 Pro",
      category: "Electronics",
      location: "University Union",
      date: "April 12, 2025",
      description:
        "Black iPhone with a clear case. Lock screen has a picture of mountains.",
      image: "/images/iphone16.jpg",
      contact: "jane.smith@example.com",
    },
    {
      id: "l3",
      name: "Student ID Card",
      category: "Identification",
      location: "Liberal Arts Building",
      date: "April 9, 2025",
      description: "Student ID for Michael Johnson, ID #12345678.",
      contact: "michael.johnson@example.com",
    },
    {
      id: "l4",
      name: "Car Keys",
      category: "Keys",
      location: "Parking Lot C",
      date: "April 13, 2025",
      description: "Honda car keys with a small turtle keychain attached.",
      image: "/images/keys.jpg",
      contact: "sarah.williams@example.com",
    },
  ];

  // Mock data for found items
  const foundItems: ItemProps[] = [
    {
      id: "f1",
      name: "Water Bottle",
      category: "Personal Item",
      location: "Health Professions Building",
      date: "April 11, 2025",
      description: "Blue Hydro Flask with stickers. Found in Room 302.",
      image: "/images/bluewaterbottle.jpg",
      contact: "lost.found@university.edu",
    },
    {
      id: "f2",
      name: "Textbook",
      category: "Book",
      location: "Stephens Hall",
      date: "April 8, 2025",
      description:
        "Organic Chemistry textbook, 5th edition. Name 'Alex' written inside cover.",
      image: "/images/textbook.jpg",
      contact: "lost.found@university.edu",
    },
    {
      id: "f3",
      name: "Glasses",
      category: "Accessories",
      location: "Center for the Arts",
      date: "April 12, 2025",
      description: "Black-framed prescription glasses in a brown case.",
      image: "/images/glasses.jpg",
      contact: "lost.found@university.edu",
    },
    {
      id: "f4",
      name: "Umbrella",
      category: "Personal Item",
      location: "Psychology Building",
      date: "April 10, 2025",
      description: "Compact black umbrella with wooden handle.",
      contact: "lost.found@university.edu",
    },
  ];

  // Filter items based on search query
  const filteredLostItems = lostItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredFoundItems = foundItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
            className={`px-6 py-2 ${activeTab === "lost"
              ? "bg-yellow-500 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
          >
            Lost Items
          </button>
          <button
            onClick={() => setActiveTab("found")}
            className={`px-6 py-2 ${activeTab === "found"
              ? "bg-yellow-500 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
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
