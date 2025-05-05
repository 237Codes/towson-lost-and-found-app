import ItemCard from "./ItemCard";

export interface Item {
  id: string;
  name: string;
  category: string;
  location: string;
  date: string;
  description: string;
  image?: string;
  contact: string;
}

interface ItemsGridProps {
  activeTab: "lost" | "found";
  filteredLostItems: Item[];
  filteredFoundItems: Item[];
}

const ItemsGrid: React.FC<ItemsGridProps> = ({
  activeTab,
  filteredLostItems,
  filteredFoundItems,
}) => {
  const isLost = activeTab === "lost";
  const items = isLost ? filteredLostItems : filteredFoundItems;

  return (
    <div className="mx-auto mb-8 max-w-7xl">
      <h2 className="mb-4 text-xl font-semibold">
        {isLost ? "Reported Lost Items" : "Reported Found Items"}
      </h2>

      {items.length === 0 ? (
        <p className="text-center text-gray-500">
          No {isLost ? "lost" : "found"} items match your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemsGrid;
