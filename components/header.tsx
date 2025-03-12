"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  // Function to handle smooth scrolling
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsOpen(false);
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-gradient-to-r from-slate-900 to-slate-800 text-white py-4 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Image src="https://static.vecteezy.com/system/resources/previews/004/688/136/original/rs-logo-letter-design-icon-rs-letters-with-colorful-creative-swoosh-lines-vector.jpg" alt="Logo" width={40} height={40} className="rounded-full" />
          <h1 className="text-2xl font-bold hover:text-pink-500 transition">Coder Army @Rishabh</h1>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          {[
            { name: "Home", id: "home" },
            { name: "Algorithms", id: "algorithms" },
            { name: "Streak", id: "streak" },
            { name: "Partners", id: "about" },
            { name: "AlgoRace" , id:"algorace"}
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="hover:text-pink-500 transition"
            >
              {item.name}
            </button>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-14 left-0 w-full bg-slate-900 py-4 shadow-md"
          >
            <ul className="flex flex-col items-center space-y-4">
              {[
                { name: "Home", id: "home" },
                { name: "Algorithms", id: "algorithms" },
                { name: "Streak", id: "streak" },
                { name: "AlgoRace", id: "about" },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className="hover:text-pink-500 transition text-lg"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
