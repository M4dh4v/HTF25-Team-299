import React, { useState } from "react";
import Header from "./components/Header";
import HomePage from "./components/Pages/HomePage";
import AboutPage from "./components/Pages/AboutPage";
import ContactPage from "./components/Pages/ContactPage";

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>("home");

  return (
    <div className="min-h-screen w-full bg-black text-white font-sans">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
        {currentPage === "about" && <AboutPage />}
        {currentPage === "contact" && <ContactPage />}
        {currentPage === "home" && <HomePage />}
      </div>
    </div>
  );
};

export default App;
