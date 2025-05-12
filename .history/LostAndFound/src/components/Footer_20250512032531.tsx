const Footer = () => {
  return (
    <footer className="bg-black text-white py-6 px-4">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row justify-between items-center text-sm space-y-2 sm:space-y-0">
        <p>&copy; {new Date().getFullYear()} Towson Lost & Found. All rights reserved.</p>

        {/* Optional links: uncomment if needed
        <div className="flex space-x-4">
          <a href="/privacy" className="hover:text-yellow-400">Privacy</a>
          <a href="/terms" className="hover:text-yellow-400">Terms</a>
          <a href="/contact" className="hover:text-yellow-400">Contact</a>
        </div>
        */}
      </div>
    </footer>
  );
};

export default Footer;
