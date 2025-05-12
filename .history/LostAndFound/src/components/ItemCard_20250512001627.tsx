import React, { useState } from "react";

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
  const [showModal, setShowModal] = useState(false);

  const redirectPath =
    item.type === "lost"
      ? `/verify-found?id=${item.id}&type=found`
      : `/verify-claim?id=${item.id}&type=claim`;

  const confirmText =
    item.type === "lost"
      ? "Are you sure you found this item?"
      : "Are you sure you want to claim this item?";

  const handleConfirm = () => {
    setShowModal(false);
    window.location.href = redirectPath;
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <>
      {/* Main Card */}
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

          <div className="pt-3 flex justify-end">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowModal(true);
              }}
              className={`rounded-md px-3 py-1 text-sm font-medium text-white ${
                item.type === "lost"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {item.type === "lost" ? "Found" : "Claim"}
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full text-center">
            <p className="text-gray-800 text-lg font-semibold mb-4">{confirmText}</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleConfirm}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Yes
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ItemCard;
