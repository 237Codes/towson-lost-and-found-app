import Nav from "./Nav";

import Search from "./Search";
import TowsonLogo from "./TowsonLogo";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-b-[#cc9900] bg-black px-8 py-4 capitalize text-white">
      <div className="container flex h-12 items-center justify-between space-x-4">
        <div className="flex space-x-4">
          <TowsonLogo />
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Nav />
        </div>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 items-center justify-end space-x-4">
          <Search />
        </div>
      </div>
    </header>
  );
};

export default Header;
