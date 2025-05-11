import React, { useEffect, useState } from "react";
import { CalendarDays, MapPin, Palette, PhoneCall} from "lucide-react";

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

interface Props {
  id: string;
}

export default function ItemDetail({ id }: Props) {
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/items/${id}`);
        if (!res.ok) throw new Error("Item not found");
        const data = await res.json();
        setItem(data.item);
      } catch (err) {
        setError("Could not load item details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchItem();
  }, [id]);

  if (loading) return <p className="text-center mt-12 text-gray-500">Loading item...</p>;
  if (error) return <p className="text-center mt-12 text-red-500">{error}</p>;
  if (!item) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Image display */}
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

        {/* Right: Item info */}
        <div className="flex flex-col justify-between">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {item.name}
            </h1>

            <div className="flex items-center text-sm text-yellow-600">
              <span className="uppercase tracking-wide font-semibold">
                {item.type === "lost" ? "Lost Item" : "Found Item"}
              </span>
              <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-xs">
                Category: {item.category}
              </span>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1 pt-3">
              <ItemMeta icon={<MapPin size={16} />} label="Location" value={item.location} />
              <ItemMeta icon={<CalendarDays size={16} />} label="Date" value={new Date(item.date).toLocaleDateString()} />
              <ItemMeta icon={<PhoneCall size={16} />} label="Contact Method" value={item.contact} />
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

          {/* Action Button */}
          <div className="pt-6">
            <button className="w-full rounded-md bg-yellow-600 px-6 py-3 text-white font-semibold text-center shadow hover:bg-yellow-700 transition">
              Claim This Item
            </button>
          </div>
        </div>
      </div>

      {/* Description section */}
      <div className="mt-12 border-t pt-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Description
        </h2>
        <p className="whitespace-pre-line text-gray-700 dark:text-gray-300 leading-relaxed">
          {item.description}
        </p>
      </div>
    </div>
  );
}

const ItemMeta = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <p className="flex items-center space-x-2">
    {icon}
    <span className="text-gray-700 dark:text-gray-200">
      <strong>{label}:</strong> {value}
    </span>
  </p>
);
