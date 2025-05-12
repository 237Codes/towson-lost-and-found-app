/**
 * TabSwitch Component
 * -------------------
 * Renders a two-tab UI for switching between Login and Signup routes.
 * - Highlights the active tab using `activeTab` prop ("lost" or "found").
 * - Styled with Towson-themed yellow for active state.
 */

interface TabSwitchProps {
  activeTab: "lost" | "found";
}

const TabSwitch = ({ activeTab }: TabSwitchProps) => {
  return (
    <div className="mb-6 flex justify-center">
      <div className="flex rounded-md border border-gray-300">
        <a
          href="/login"
          className={`px-6 py-2 ${activeTab === "lost"
            ? "bg-yellow-500 text-white"
            : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
        >
          Login
        </a>
        <a
          href="/signup"
          className={`px-6 py-2 ${activeTab === "found"
            ? "bg-yellow-500 text-white"
            : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
        >
          Signup
        </a>
      </div>
    </div>
  );
};

export default TabSwitch;
