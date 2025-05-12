/**
 * ItemDetail Component
 * --------------------
 * Displays detailed information about a specific lost or found item.
 * - Fetches item data from API using item ID.
 * - Shows image, name, metadata (date, location, contact, etc.).
 * - Supports user confirmation via Towson-themed modal:
 *    - "Claim This Item" if found,
 *    - "I Found This Item" if lost.
 */

import React, { useEffect, useState } from "react";
import { CalendarDays, MapPin, Palette, PhoneCall } from "lucide-react";

interface Item {
  id: string;
  name: string;
  category: string;
  location: string;
  date: string;
  description: string;
  image?: string;
  contact: string; // "Email" or "Phone"
  email?: string;
  phone?: string;
  type: "lost" | "found";
  colors?: string[];
}

interface Props {
  id: string;
}

export default function ItemDetail({ id }: Props) {
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/items/${id}`);
        if (!res.ok) throw new Error("Item not found");
        const data = await res.json();

        const itemData = data.item;
        setItem({
          ...itemData,
          colors: itemData.color
            ? itemData.color.split(",").map((c: string) => c.trim().toLowerCase())
            : [],
        });
      } catch (err) {
        setError("Could not load item details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchItem();
  }, [id]);

  const handleConfirm = () => {
    if (!item) return;
    const redirectPath =
      item.type === "found"
        ? `/verify-claim?id=${item.id}&type=claim`
        : `/verify-found?id=${item.id}&type=found`;
    window.location.href = redirectPath;
  };

  if (loading)
    return <p className="text-center mt-12 text-gray-500">Loading item...</p>;
  if (error)
    return <p className="text-center mt-12 text-red-500">{error}</p>;
  if (!item) return null;

  const confirmText =
    item.type === "found"
      ? "Are you sure you want to claim this item?"
      : "Are you sure you found this item?";

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 py-12 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left: Image */}
          <div className="space-y-4">
            <div className="w-full aspect-[4/5] bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shadow-md flex items-center justify-center">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400 text-lg">
                  No image available
                </div>
              )}
            </div>
          </div>

          {/* Right: Details */}
          <div className="flex flex-col justify-between">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {item.name}
              </h1>

              <div className="flex flex-wrap items-center text-base text-yellow-600 font-semibold space-x-3 mb-2">
                <span className="uppercase tracking-widest">
                  {item.type === "lost" ? "Lost Item" : "Found Item"}
                </span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm font-medium">
                  Category: {item.category}
                </span>
              </div>

              <div className="text-base text-gray-700 dark:text-gray-300 space-y-2 pt-3 leading-relaxed">
                <ItemMeta icon={<MapPin size={18} />} label="Location" value={item.location} />
                <ItemMeta icon={<CalendarDays size={18} />} label="Date" value={new Date(item.date).toLocaleDateString()} />
                <ItemMeta icon={<PhoneCall size={18} />} label="Contact Method" value={item.contact} />
                <ItemMeta
                  icon={<PhoneCall size={18} />}
                  label="Contact"
                  value={
                    item.contact === "Email" && item.email ? (
                      <a
                        href={`mailto:${item.email}`}
                        className="text-yellow-700 hover:underline"
                      >
                        {item.email}
                      </a>
                    ) : item.phone || "Contact info not provided"
                  }
                />
              </div>

              {item.colors && item.colors.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-1 flex items-center space-x-2">
                    <Palette size={16} />
                    <span>Color(s)</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.colors.map((color) => (
                      <span
                        key={color}
                        className="inline-block rounded-full px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Towson-themed Action Button */}
            <div className="pt-6">
              <button
                onClick={() => setShowModal(true)}
                className="block w-full rounded-md bg-yellow-600 px-6 py-3 text-white font-semibold text-center shadow hover:bg-yellow-700 transition"
              >
                {item.type === "found" ? "Claim This Item" : "I Found This Item"}
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-12 border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Description
          </h2>
          <p className="whitespace-pre-line text-gray-700 dark:text-gray-300 leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full text-center">
            <p className="text-gray-800 text-lg font-semibold mb-4">{confirmText}</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleConfirm}
                className="bg-[#FFB800] text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Yes
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Reusable metadata display row
const ItemMeta = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode; // <-- was string
}) => (
  <p className="flex items-center space-x-2">
    {icon}
    <span className="text-gray-700 dark:text-gray-200">
      <strong>{label}:</strong> {value}
    </span>
  </p>
);
