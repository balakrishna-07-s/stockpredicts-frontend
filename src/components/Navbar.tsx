
import { Link } from "react-router-dom";
import { Home, Search, Newspaper, Info, Mail } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
      <div className="container mx-auto">
        <div className="flex justify-between items-center py-4 px-4 md:px-0">
          <Link to="/" className="font-bold text-xl flex items-center gap-2">
            <Search className="h-5 w-5" />
            <span>Stock Market Price Predictor</span>
          </Link>
          
          <div className="hidden md:flex space-x-6">
            <NavLink to="/" icon={<Home className="h-4 w-4" />} label="Home" />
            <NavLink to="/news" icon={<Newspaper className="h-4 w-4" />} label="Stock News" />
            <NavLink to="/about" icon={<Info className="h-4 w-4" />} label="About" />
            <NavLink to="/contact" icon={<Mail className="h-4 w-4" />} label="Contact Us" />
          </div>
          
          <div className="md:hidden flex items-center">
            <div className="dropdown dropdown-end">
              <button className="btn btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <ul className="dropdown-content menu p-2 shadow bg-primary rounded-box w-52">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/news">Stock News</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => {
  return (
    <Link 
      to={to} 
      className="flex items-center gap-1 hover:text-white transition-colors duration-200"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default Navbar;
