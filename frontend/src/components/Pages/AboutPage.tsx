import React from "react";

const AboutPage: React.FC = () => (
  <div className="max-w-4xl mx-auto">
    <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">
      About Us
    </h2>
    <div className="bg-gray-800 rounded-lg p-6 space-y-4">
      <p className="text-gray-300">
        Welcome to the Automated Caption Generator — your ultimate tool for
        creating engaging captions.
      </p>
      <p className="text-gray-300">
        Our AI automatically transcribes video content and generates captions in
        multiple styles and languages.
      </p>
      <p className="text-gray-300">
        Ideal for social media, education, or entertainment — reach a wider
        audience effortlessly.
      </p>
    </div>
  </div>
);

export default AboutPage;
