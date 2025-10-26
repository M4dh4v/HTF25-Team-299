import React from "react";

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage }) => (
  <header className="mb-8">
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center">
        <img src="/logo.png" alt="Logo" className="h-10 w-auto mr-3" />
      </div>
      <div className="flex gap-3">
        {["home", "about", "contact"].map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentPage === page
                ? "bg-green-600 hover:bg-green-700"
                : "bg-neutral-800 hover:bg-neutral-700"
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
      <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text pb-2">
        Generate Viral Captions with AI
      </h1>
      <p className="text-lg text-gray-400">
        Upload your video, get an instant transcript, and generate AI-powered
        captions in any style or language.
      </p>
    </div>
  </header>
);

export default Header;
