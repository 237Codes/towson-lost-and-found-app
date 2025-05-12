/**
 * Footer Component
 * ----------------
 * Displays the site footer with copyright text and contact link.
 * - Responsive layout with centered or justified content.
 * - Includes dynamic year rendering.
 */

const Footer = () => {
  return (
    <footer className="bg-black text-white py-6 px-4">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row justify-between items-center text-sm space-y-2 sm:space-y-0">
        <p>&copy; {new Date().getFullYear()} Towson Lost & Found. All rights reserved.</p>

        <div className="flex space-x-4">
          <a href="/contact" className="hover:text-yellow-400">Contact</a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
