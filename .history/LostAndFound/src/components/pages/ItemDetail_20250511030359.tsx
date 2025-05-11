// src/components/pages/ItemDetail.tsx
import { useEffect, useState } from "react";

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
    <div className="max-w-4xl mx-auto px-6 py-12 bg-white dark:bg-black rounded-xl shadow-lg">
      <h1 className="text-4xl font-bold mb-6 text-center">{item.name}</h1>

      {item.image && (
        <div className="mb-6">
          <img
            src={item.image}
            alt={item.name}
            className="w-full max-h-[400px] object-cover rounded-lg shadow-md"
          />
        </div>
      )}

      <div className="space-y-4 text-gray-800 dark:text-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Category</p>
            <p className="font-medium">{item.category || "N/A"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium">{item.location}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-medium">{new Date(item.date).toLocaleDateString()}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Contact Method</p>
            <p className="font-medium">{item.contact}</p>
          </div>

          {Array.isArray(item.colors) && item.colors.length > 0 && (
            <div>
              <p className="text-sm text-gray-500">Color(s)</p>
              <div className="flex flex-wrap gap-2 mt-1">
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

        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 mb-1">Description</p>
          <p className="whitespace-pre-line text-gray-700 dark:text-gray-200">{item.description}</p>
        </div>
      </div>
    </div>
  );
}
