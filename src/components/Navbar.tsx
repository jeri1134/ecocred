import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Leaf, Home, Zap, Heart, Gift } from "lucide-react";
import WalletButton from "./WalletButton";

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/actions", icon: Zap, label: "Actions" },
    { path: "/ecopet", icon: Heart, label: "EcoPet" },
    { path: "/rewards", icon: Gift, label: "Rewards" },
  ];

  return (
    <nav className="glass-card m-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Leaf className="h-8 w-8 text-green-400" />
          <span className="text-2xl font-bold text-white">EcoCred</span>
        </div>

        <div className="hidden md:flex space-x-1">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                location.pathname === path
                  ? "bg-white/20 text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{label}</span>
            </Link>
          ))}
        </div>

        <WalletButton />
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden mt-4 flex justify-center space-x-1">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-300 ${
              location.pathname === path
                ? "bg-white/20 text-white"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
