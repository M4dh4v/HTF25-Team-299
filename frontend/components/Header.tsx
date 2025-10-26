import React from "react";

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage }) => (
  <header className="mb-8">
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1"></div>
      <div className="flex gap-3">
        {["home", "about", "contact"].map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentPage === page
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            {page === "home"
              ? "Home"
              : page === "about"
              ? "About Us"
              : "Contact Us"}
          </button>
        ))}
      </div>
    </div>

    <div className="text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text pb-2">
        Automated Caption Generator
      </h1>
      <p className="text-lg text-gray-400 max-w-2xl mx-auto">
        Upload your video, get an instant transcript, and generate AI-powered
        captions in any style.
      </p>
    </div>
  </header>
);

export default Header;
