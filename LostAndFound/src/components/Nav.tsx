import BuildingsDropdown from "./BuildingsDropdown";

const Nav = () => {
  return (
    <nav className="flex flex-row space-x-4">
      <BuildingsDropdown />
      <a href="/report-lost" className="hover:text-[#cc9900]">
        Report Lost
      </a>
      <a href="/report-found" className="hover:text-[#cc9900]">
        Report Found
      </a>
      <a href="/" className="hover:text-[#cc9900]">
        Contact
      </a>
    </nav>
  );
};

export default Nav;
