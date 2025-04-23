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
    <div className="flex flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-md transition-all hover:shadow-lg">
      <div className="mb-2 h-40 w-full overflow-hidden rounded-md bg-gray-100">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200">
            <span className="text-gray-500">No image</span>
          </div>
        )}
      </div>
      <h3 className="mb-1 text-lg font-bold">{item.name}</h3>
      <div className="mb-1 flex items-center text-sm text-gray-600">
        <span className="mr-2 font-medium">Category:</span> {item.category}
      </div>
      <div className="mb-1 flex items-center text-sm text-gray-600">
        <span className="mr-2 font-medium">Location:</span> {item.location}
      </div>
      <div className="mb-2 flex items-center text-sm text-gray-600">
        <span className="mr-2 font-medium">Date:</span> {item.date}
      </div>
      <p className="mb-3 text-sm">{item.description}</p>
      <div className="mt-auto text-sm text-gray-600">
        <span className="font-medium">Contact:</span> {item.contact}
      </div>
    </div>
  );
};

export default ItemCard;
