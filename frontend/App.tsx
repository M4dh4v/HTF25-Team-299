import React, { useState, useRef } from "react";
import { CaptionStyle } from "./types";
import Header from "./components/Header";
import HomePage from "./components/Pages/HomePage";
import AboutPage from "./components/Pages/AboutPage";
import ContactPage from "./components/Pages/ContactPage";

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>("home");

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

        {currentPage === "about" && <AboutPage />}
        {currentPage === "contact" && <ContactPage />}
        {currentPage === "home" && <HomePage />}
      </div>
    </div>
  );
};

export default App;
