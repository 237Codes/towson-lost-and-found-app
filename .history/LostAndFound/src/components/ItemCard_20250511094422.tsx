import React from "react";

interface ItemProps {
  id: string;
  name: string;
  category: string;
  location: string;
  date: string;
  description: string;
  image?: string;
  contact: string;
  type: "lost" | "found";
}

interface ItemCardProps {
  item: ItemProps;
  onRemove?: (id: string) => void;
}

const ItemCard = ({ item }: ItemCardProps) => {
  const handleAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // prevent the <a> from firing

    const confirmMsg =
      item.type === "lost"
        ? "Are you sure you found this item?"
        : "Are you sure you want to claim this item?";

    if (!confirm(confirmMsg)) return;

    const redirectPath =
      item.type === "lost"
        ? `/verify-found?id=${item.id}&type=found`
        : `/verify-claim?id=${item.id}&type=claim`;

    window.location.href = redirectPath;
  };

  return (
    <div
      onClick={() => (window.location.href = `/item/${item.id}`)}
      className="rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white overflow-hidden cursor-pointer"
    >
      {item.image && (
        <img
          src={item.image}
          alt={item.name}
          className="h-48 w-full object-cover"
        />
      )}
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
        <div className="text-sm text-gray-500">
          <span className="block">📍 {item.location}</span>
          <span className="block">
            📅{" "}
            {new Date(item.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="block">📞 {item.contact}</span>
        </div>
        <span
          className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
            item.category === "Electronics"
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {item.category}
        </span>

        <div className="pt-6">
          <a
            href={`/verify?id=${item.id}&type=${item.type === "found" ? "claim" : "found"}`}
            className="block w-full rounded-md bg-yellow-600 px-6 py-3 text-white font-semibold text-center shadow hover:bg-yellow-700 transition"
          >
            {item.type === "found" ? "Claim This Item" : "I Found This Item"}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
