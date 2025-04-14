interface TabSwitchProps {
  activeTab: "lost" | "found";
}

const TabSwitch = ({ activeTab }: TabSwitchProps) => {
  return (
    <div className="mb-6 flex justify-center">
      <div className="flex rounded-md border border-gray-300">
        <a
          href="/report-lost"
          className={`px-6 py-2 ${activeTab === "lost"
            ? "bg-yellow-500 text-white"
            : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
        >
          Report Lost Item
        </a>
        <a
          href="/report-found"
          className={`px-6 py-2 ${activeTab === "found"
            ? "bg-yellow-500 text-white"
            : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
        >
          Report Found Item
        </a>
      </div>
    </div>
  );
};

export default TabSwitch;
