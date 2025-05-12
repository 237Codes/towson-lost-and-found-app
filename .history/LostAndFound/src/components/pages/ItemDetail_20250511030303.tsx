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
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">{item.name}</h1>
      {item.image && (
        <img src={item.image} alt={item.name} className="mb-6 w-full rounded-lg shadow-md" />
      )}
      <p className="mb-2"><strong>Category:</strong> {item.category}</p>
      <p className="mb-2"><strong>Location:</strong> {item.location}</p>
      <p className="mb-2"><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</p>
      <p className="mb-2"><strong>Contact:</strong> {item.contact}</p>
      {Array.isArray(item.colors) && item.colors.length > 0 && (
        <p className="mb-2"><strong>Color(s):</strong> {item.colors.join(", ")}</p>
        )}
      <p className="mt-4 whitespace-pre-line">{item.description}</p>
    </div>
  );
}
