import { Filter, Search } from "lucide-react";

interface ItemsFilterProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const ItemsFilter = ({ searchQuery, setSearchQuery }: ItemsFilterProps) => {
  return (
    <div className="mb-8">
      <div className="mx-auto flex max-w-3xl items-center rounded-lg border border-gray-300 bg-white px-3 py-2">
        <Search size={20} className="mr-2 text-gray-400" />
        <input
          type="text"
          placeholder="Search items by name, category, location..."
          className="w-full border-none bg-transparent focus:outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="flex items-center space-x-1 rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200">
          <Filter size={16} />
          <span>Filter</span>
        </button>
      </div>
    </div>
  );
};

export default ItemsFilter;
