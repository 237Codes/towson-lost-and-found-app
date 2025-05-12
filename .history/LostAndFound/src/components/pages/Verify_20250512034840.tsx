import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";

const Verify = () => {
  const [itemId, setItemId] = useState<string | null>(null);
  const [type, setType] = useState<"claim" | "found" | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    verificationTip: "",
    preferredContactMethod: "Email",
    dropoff: "",
    locationDetail: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setItemId(params.get("id"));
    const typeParam = params.get("type");
    if (typeParam === "claim" || typeParam === "found") {
      setType(typeParam);
    }
    setLoading(false);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemId || !type) return;

    const apiEndpoint =
      type === "claim"
        ? "http://localhost:3001/api/items/verify-claim"
        : "http://localhost:3001/api/items/verify-found";

    const payload =
      type === "claim"
        ? {
            itemId,
            name: formData.name,
            email: formData.email,
            details: formData.message,
            verificationTip: formData.verificationTip,
            preferredContactMethod: formData.preferredContactMethod,
          }
        : {
            itemId,
            name: formData.name,
            email: formData.email,
            message: formData.message,
            dropoff: formData.dropoff,
            locationDetail: formData.locationDetail,
          };

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Submission failed.");
      }

      toast({
        title: "Success",
        description: "Your submission has been received!",
      });

      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Something went wrong.",
      });
    }
  };

  if (loading) {
    return <div className="p-6 text-yellow-500">Loading form...</div>;
  }

  if (!itemId || !type) {
    return (
      <div className="p-6 text-red-600 font-semibold">
        Invalid or missing verification parameters.
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto p-6 bg-white text-gray-900 shadow-xl rounded-xl mt-10 border border-gray-200">
      <h1 className="text-3xl font-bold text-center mb-2">
        {type === "claim" ? "Claim Verification" : "Found Item Form"}
      </h1>
      <p className="text-center text-gray-600 mb-6">
        {type === "claim"
          ? "Please describe why you believe this item belongs to you. Your response will help us verify ownership."
          : "Please share details about where you found the item so the owner can be contacted."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="hidden" name="itemId" value={itemId} />

        <div>
          <label className="block font-semibold text-sm mb-1">Your Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-sm mb-1">Your Email</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-sm mb-1">
            {type === "claim"
              ? "How can you prove it's yours?"
              : "Where did you find the item?"}
          </label>
          <textarea
            name="message"
            rows={4}
            required
            value={formData.message}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        {type === "claim" && (
          <>
            <div>
              <label className="block font-semibold text-sm mb-1">
                Optional: Any other proof or identifying detail?
              </label>
              <textarea
                name="verificationTip"
                rows={2}
                value={formData.verificationTip}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block font-semibold text-sm mb-1">
                Preferred Contact Method
              </label>
              <select
                name="preferredContactMethod"
                value={formData.preferredContactMethod}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="Email">Email</option>
                <option value="Phone">Phone</option>
              </select>
            </div>
          </>
        )}

        {type === "found" && (
          <>
            <div>
              <label className="block font-semibold text-sm mb-1">
                Where did you drop it off? (optional)
              </label>
              <input
                name="dropoff"
                value={formData.dropoff}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block font-semibold text-sm mb-1">
                Exact spot description (optional)
              </label>
              <input
                name="locationDetail"
                value={formData.locationDetail}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className={`w-full py-2 rounded-md text-white font-semibold shadow-sm transition-all ${
            type === "claim"
              ? "bg-[#FFB800] hover:bg-yellow-600"
              : "bg-black hover:bg-gray-900"
          }`}
        >
          {type === "claim" ? "Submit Claim Request" : "Submit Found Notice"}
        </button>
      </form>

      <p className="text-center text-xs text-gray-500 mt-4">
        Powered by Towson University Lost & Found
      </p>
    </main>
  );
};

export default Verify;
