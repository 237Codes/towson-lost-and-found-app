interface ItemProps {
  id: string;
  name: string;
  category: string;
  location: string;
  date: string;
  description: string;
  image?: string;
  contact: string;
}

const ItemCard = ({ item }: { item: ItemProps }) => {
  return (
    <article className="flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="mb-3 h-40 w-full overflow-hidden rounded-md bg-gray-100">
      {item.image && item.image.startsWith('data:image') ? (
        <img
          src={item.image.trim()}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-200">
          <span className="text-gray-500 text-sm">No image available</span>
        </div>
      )}
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>

      <ul className="text-sm text-gray-700 space-y-1 mb-2">
        <li>
          <span className="font-medium">Category:</span> {item.category}
        </li>
        <li>
          <span className="font-medium">Location:</span> {item.location}
        </li>
        <li>
          <span className="font-medium">Date:</span> {item.date}
        </li>
      </ul>

      <p className="text-sm text-gray-800 mb-3 line-clamp-3">{item.description}</p>

      <div className="mt-auto text-sm text-gray-600">
        <span className="font-medium">Contact:</span> {item.contact}
      </div>
    </article>
  );
};

export default ItemCard;
