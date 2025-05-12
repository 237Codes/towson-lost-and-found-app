/**
 * Search Component
 * ----------------
 * Renders a search input and submit button for keyword queries.
 * - Tracks input state locally and logs search term on submit.
 * - Accessible form with proper ARIA labeling.
 * - Styled with Towson-themed yellow and responsive layout.
 */

import React, { useState } from "react";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Search term:", searchTerm);
  };
  return (
    <div className="search-section">
      <i
        className="ri-search-line text-white"
        aria-label="Search icon"
        aria-hidden="true"
      ></i>

      <form
        action="/search/index.html"
        onSubmit={handleSearchSubmit}
        className="search_form_desktop flex items-center space-x-2"
      >
        <label
          htmlFor="site-search-desktop"
          aria-hidden="true"
          className="sr-only"
        >
          Search
        </label>

        <input
          type="search"
          id="site-search-desktop"
          name="q"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search..."
          className="search_input rounded-md border border-gray-300 px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#cc9900]"
          aria-label="Search the Towson University website"
          onFocus={(e) => e.target.value === "Search" && (e.target.value = "")}
          onBlur={(e) => e.target.value === "" && (e.target.value = "Search")}
        />

        <button
          type="submit"
          className="search_submit_word rounded-md bg-[#cc9900] px-4 py-2 text-white transition-colors hover:bg-[#b8860b]"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default Search;
