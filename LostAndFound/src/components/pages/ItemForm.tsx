/**
 * ItemForm Component
 * ------------------
 * Handles reporting of lost or found items through a dynamic form.
 * - Accepts a `type` prop to conditionally render for "lost" or "found".
 * - Collects item details including name, category, colors, location, description, image, and contact info.
 * - Supports:
 *    - Optional image upload (converted to base64),
 *    - Custom location entry if "Other" is selected,
 *    - Dynamic color checkboxes,
 *    - Validations like confirmation checkbox.
 * - On submit: sends JSON payload to `/api/items`.
 */

import { useState } from 'react';
import { toast } from "@/hooks/use-toast";

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
    customLocation: '',
    date: '',
    dropoff: '',
    contactMethod: 'Email',
    canContact: false,
    verificationTip: '',
    confirm: false,
    photo_base64: ''
  });

  // Category options for dropdown
  const categories = [
    "Electronics",
    "Clothing",
    "ID Cards",
    "Keys",
    "Accessories",
    "Backpacks/Bags",
    "Books/Notebooks",
    "Jewelry",
    "Eyewear",
    "Water Bottles",
    "Headphones/Earbuds",
    "Chargers/Cables",
    "Footwear",
    "Sports Equipment",
    "Musical Instruments",
    "Wallets",
    "Cash",
    "Other"
  ];  

  // Predefined color options
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

  // Towson location options
  const locations = [
    "Stephens Hall",
    "Science Complex",
    "Health Professions",
    "University Union",
    "Center For The Arts",
    "Liberal Arts Building",
    "York Rd",
    "Hawkins Hall",
    "Psychology Building",
    "Other"
  ];

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    console.log("📨 handleSubmit triggered!");
    e.preventDefault();
  
    // Log data being submitted
    console.log("Submitting formData:", { ...formData, type });
  
    try {
      const response = await fetch("http://localhost:3001/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, type }),
      });
  
      const data = await response.json();
      console.log("Server response:", data);
  
      if (!response.ok) {
        throw new Error(data?.message || "Failed to submit item.");
      }
  
      toast({
        title: "Item submitted!",
        description: `Your ${type} item was successfully reported.`,
      });
  
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Error submitting item",
        description: error instanceof Error ? error.message : "Something went wrong.",
      });
    }
  };  

  // Generic input change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Toggle color chips
  const handleColorChange = (color: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  // Image upload as base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        photo_base64: reader.result?.toString() || ''
      }));
    };
    reader.readAsDataURL(file);
  };  

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      <InputField label="Full Name" id="name" name="name" value={formData.name} onChange={handleChange} required />
      <InputField label="TU Email" id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
      <InputField label="Phone Number (optional)" id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
      <InputField label="Item Name" id="itemName" name="itemName" value={formData.itemName} onChange={handleChange} required />

      <SelectField label="Category" name="category" value={formData.category} onChange={handleChange} required options={categories} />
      <SelectField label={`Location ${type === 'lost' ? 'Lost' : 'Found'}`} name="location" value={formData.location} onChange={handleChange} required options={locations} />
      {formData.location === "Other" && (<InputField label="Enter Custom Location" id="customLocation" name="customLocation" value={formData.customLocation || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev) => ({ ...prev, customLocation: e.target.value }))}required />)}  
      
      <InputField label={`Date ${type === 'lost' ? 'Lost' : 'Found'}`} id="date" name="date" type="date" value={formData.date} onChange={handleChange} required max={new Date().toISOString().split("T")[0]} />

      <ColorCheckboxGroup selected={formData.colors} onChange={handleColorChange} colors={colors} />

      <InputField label="Brand (optional)" id="brand" name="brand" value={formData.brand} onChange={handleChange} />
      <TextareaField label="Detailed Description" id="description" name="description" value={formData.description} onChange={handleChange} required />
      
      <InputField label="Upload Image (optional)" id="photo" name="photo" type="file" accept="image/*" onChange={handleImageUpload}/>

      {type === "found" && (
        <SelectField
          label="Where Item Has Been Dropped Off (if any)"
          name="dropoff"
          value={formData.dropoff}
          onChange={handleChange}
          options={locations}
        />
      )}

      <SelectField label="Preferred Contact Method" name="contactMethod" value={formData.contactMethod} onChange={handleChange} options={["Email", "Phone"]} />
      <CheckboxField label="I am willing to be contacted for pickup details" id="canContact" name="canContact" checked={formData.canContact} onChange={handleChange} />
      <InputField label="Optional Verification Tip" id="verificationTip" name="verificationTip" value={formData.verificationTip} onChange={handleChange} />

      <CheckboxField label="I confirm this information is accurate." id="confirm" name="confirm" checked={formData.confirm} onChange={handleChange} required />

      <button type="submit" className="w-full py-2 px-4 text-white bg-yellow-500 hover:bg-yellow-600 rounded-md shadow-sm">
        Submit
      </button>
    </form>
  );
};

// Reusable Components

const InputField = ({ label, ...props }: any) => (
  <div>
    <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      {...props}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
    />
  </div>
);

const TextareaField = ({ label, ...props }: any) => (
  <div>
    <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">{label}</label>
    <textarea
      {...props}
      rows={4}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
    />
  </div>
);

const SelectField = ({ label, options, ...props }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      {...props}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
    >
      <option value="">Select an option</option>
      {options.map((opt: string) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const CheckboxField = ({ label, ...props }: any) => (
  <div className="flex items-center">
    <input {...props} type="checkbox" className="h-4 w-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500" />
    <label htmlFor={props.id} className="ml-2 block text-sm text-gray-700">{label}</label>
  </div>
);

const ColorCheckboxGroup = ({ selected, onChange, colors }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">Color(s)</label>
    <div className="mt-2 grid grid-cols-2 gap-2">
      {colors.map((color: any) => (
        <label key={color.name} className="flex items-center space-x-2">
          <input
            type="checkbox"
            value={color.name}
            checked={selected.includes(color.name)}
            onChange={() => onChange(color.name)}
            className="rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
          />
          <span>{color.name}</span>
          <span
            className="w-4 h-4 rounded-full border border-gray-300"
            style={{
              backgroundColor: color.value.includes("gradient") ? undefined : color.value,
              backgroundImage: color.value.includes("gradient") ? color.value : "none"
            }}
          />
        </label>
      ))}
    </div>
  </div>
);