import { useState } from 'react';
import axios from "axios";

interface ItemFormProps {
    type: 'lost' | 'found';
}

export const ItemForm = ({ type }: ItemFormProps) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        itemName: '',
        category: '',
        colors: [] as string[],
        brand: '',
        description: '',
        location: '',
        date: '',
        dropoff: '',
        contactMethod: 'Email',
        canContact: false,
        verificationTip: '',
        confirm: false
    });

    const categories = [
        "Electronics",
        "Clothing",
        "ID Cards",
        "Keys",
        "Accessories",
        "Other"
    ];

    const colors = [
        { name: "Beige", value: "#f5f5dc" },
        { name: "Black", value: "#000" },
        { name: "Blue", value: "#0000ff" },
        { name: "Brown", value: "#8b0000" },
        { name: "Gray", value: "#808080" },
        { name: "Green", value: "#008000" },
        { name: "Multi", value: "linear-gradient(45deg, red, blue)" },
        { name: "Orange", value: "orange" },
        { name: "Pink", value: "pink" },
        { name: "Purple", value: "purple" },
        { name: "Red", value: "red" },
        { name: "Turquoise", value: "turquoise" },
        { name: "White", value: "#fff" },
        { name: "Yellow", value: "yellow" }
    ];

    const locations = [
        "York",
        "Arts",
        "LA",
        "Business",
        "Science",
        "Health"
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          const response = await axios.post("/api/report-item", {
            ...formData,
            type, // lost or found
          });
      
          if (response.status === 200) {
            alert("Item reported successfully!");
            // Reset form after successful submission
            setFormData({
              name: '',
              email: '',
              phone: '',
              itemName: '',
              category: '',
              colors: [],
              brand: '',
              description: '',
              location: '',
              date: '',
              dropoff: '',
              contactMethod: 'Email',
              canContact: false,
              verificationTip: '',
              confirm: false
            });
          } else {
            alert("Failed to report item. Please try again.");
          }
        } catch (error: any) {
          console.error("Failed to report item:", error);
          if (error.response?.data?.message) {
            alert(error.response.data.message);
          } else {
            alert("Something went wrong. Please try again later.");
          }
        }
      };          

      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const target = e.target as any; // <-- safely treat it as any
      
        const { name, type, value, checked } = target;
      
        setFormData(prev => ({
          ...prev,
          [name]: type === 'checkbox' ? checked : value
        }));
      };        

    const handleColorChange = (color: string) => {
        setFormData(prev => ({
            ...prev,
            colors: prev.colors.includes(color)
                ? prev.colors.filter(c => c !== color)
                : [...prev.colors, color]
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                    required
                />
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    TU Email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                    required
                />
            </div>

            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number (optional)
                </label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                />
            </div>

            <div>
                <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">
                    Item Name
                </label>
                <input
                    type="text"
                    id="itemName"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                    required
                />
            </div>

            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category
                </label>
                <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                    required
                >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Color(s)
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                    {colors.map(color => (
                        <label key={color.name} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                value={color.name}
                                checked={formData.colors.includes(color.name)}
                                onChange={() => handleColorChange(color.name)}
                                className="rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                            />
                            <span>{color.name}</span>
                            <span
                                className="w-4 h-4 rounded-full border border-gray-300"
                                style={{
                                    backgroundColor: color.value,
                                    backgroundImage: color.value.includes('gradient') ? color.value : 'none'
                                }}
                            />
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                    Brand (optional)
                </label>
                <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="e.g. Nike, Apple"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Detailed Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                    required
                />
            </div>

            <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location {type === 'lost' ? 'Lost' : 'Found'}
                </label>
                <select
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                    required
                >
                    <option value="">Select a location</option>
                    {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Date {type === 'lost' ? 'Lost' : 'Found'}
                </label>
                <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                    required
                />
            </div>

            <div>
                <label htmlFor="dropoff" className="block text-sm font-medium text-gray-700">
                    Where Item Has Been Dropped Off (if any)
                </label>
                <input
                    type="text"
                    id="dropoff"
                    name="dropoff"
                    value={formData.dropoff}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                />
            </div>

            <div>
                <label htmlFor="contactMethod" className="block text-sm font-medium text-gray-700">
                    Preferred Contact Method
                </label>
                <select
                    id="contactMethod"
                    name="contactMethod"
                    value={formData.contactMethod}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                >
                    <option value="Email">Email</option>
                    <option value="Phone">Phone</option>
                </select>
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="canContact"
                    name="canContact"
                    checked={formData.canContact}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                />
                <label htmlFor="canContact" className="ml-2 block text-sm text-gray-700">
                    I am willing to be contacted for pickup details
                </label>
            </div>

            <div>
                <label htmlFor="verificationTip" className="block text-sm font-medium text-gray-700">
                    Optional Verification Tip (e.g. sticker, engraving)
                </label>
                <input
                    type="text"
                    id="verificationTip"
                    name="verificationTip"
                    value={formData.verificationTip}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                />
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="confirm"
                    name="confirm"
                    checked={formData.confirm}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                    required
                />
                <label htmlFor="confirm" className="ml-2 block text-sm text-gray-700">
                    I confirm this information is accurate.
                </label>
            </div>

            <div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                    Submit
                </button>
            </div>
        </form>
    );
}; 