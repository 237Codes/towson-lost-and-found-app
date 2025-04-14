import ItemCard from "./ItemCard";

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

const ItemsGrid: React.FC<{
  activeTab: "lost" | "found";
  filteredLostItems: ItemProps[];
  filteredFoundItems: ItemProps[];
}> = ({ activeTab, filteredLostItems, filteredFoundItems }) => {
  return (
    <div className="mx-auto mb-8 max-w-7xl">
      <h2 className="mb-4 text-xl font-semibold">
        {activeTab === "lost" ? "Reported Lost Items" : "Reported Found Items"}
      </h2>

      {activeTab === "lost" && filteredLostItems.length === 0 && (
        <p className="text-center text-gray-500">
          No lost items match your search.
        </p>
      )}

      {activeTab === "found" && filteredFoundItems.length === 0 && (
        <p className="text-center text-gray-500">
          No found items match your search.
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {activeTab === "lost" &&
          filteredLostItems.map((item: ItemProps) => (
            <ItemCard key={item.id} item={item} />
          ))}

        {activeTab === "found" &&
          filteredFoundItems.map((item: ItemProps) => (
            <ItemCard key={item.id} item={item} />
          ))}
      </div>
    </div>
  );
};

export default ItemsGrid;
