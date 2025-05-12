import { useEffect, useState } from "react";
import { CalendarDays, MapPin, Palette, PhoneCall, Tag } from "lucide-react";

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
    <div className="max-w-4xl mx-auto px-6 py-12 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
      <h1 className="text-5xl font-bold mb-6 text-center text-gray-900 dark:text-white">
        {item.name}
      </h1>

      {item.image && (
        <div className="mb-8">
          <img
            src={item.image}
            alt={item.name}
            className="w-full max-h-[500px] object-cover rounded-xl shadow-lg"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800 dark:text-gray-100">
        <DetailField icon={<Tag size={18} />} label="Category" value={item.category || "N/A"} />
        <DetailField icon={<MapPin size={18} />} label="Location" value={item.location} />
        <DetailField icon={<CalendarDays size={18} />} label="Date" value={new Date(item.date).toLocaleDateString()} />
        <DetailField icon={<PhoneCall size={18} />} label="Contact Method" value={item.contact} />
        {item.colors && item.colors.length > 0 && (
          <div className="md:col-span-2">
            <div className="text-sm text-gray-500 flex items-center space-x-2">
              <Palette size={18} />
              <span>Color(s)</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
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

      <div className="pt-10 mt-8 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 mb-2">Description</p>
        <p className="whitespace-pre-line text-lg leading-relaxed text-gray-700 dark:text-gray-200">
          {item.description}
        </p>
      </div>
    </div>
  );
}

const DetailField = ({ icon, label, value }: { icon: JSX.Element; label: string; value: string }) => (
  <div>
    <div className="text-sm text-gray-500 flex items-center space-x-2">
      {icon}
      <span>{label}</span>
    </div>
    <p className="text-base font-medium mt-1">{value}</p>
  </div>
);
