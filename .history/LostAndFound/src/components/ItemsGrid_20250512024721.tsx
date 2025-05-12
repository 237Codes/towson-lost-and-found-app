import { useEffect, useState } from "react";
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
  type: "lost" | "found";
  colors?: string[];
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

  const [visibleLost, setVisibleLost] = useState<Item[]>(filteredLostItems);
  const [visibleFound, setVisibleFound] = useState<Item[]>(filteredFoundItems);

  useEffect(() => {
    setVisibleLost(filteredLostItems);
  }, [filteredLostItems]);

  useEffect(() => {
    setVisibleFound(filteredFoundItems);
  }, [filteredFoundItems]);

  const items = isLost ? visibleLost : visibleFound;

  return (
    <div className="mx-auto mb-8 max-w-7xl px-4">
      <h2 className="mb-4 text-xl font-semibold">
        {isLost ? "Reported Lost Items" : "Reported Found Items"}
      </h2>

      {items.length === 0 ? (
        <p className="text-center text-gray-500">
          No {isLost ? "lost" : "found"} items match your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {items.map((item) => (
            <div className="w-full min-w-[280px]"> {/* ⬅️ Card wrapper with fixed max-width */}
              <ItemCard key={item.id} item={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemsGrid;
