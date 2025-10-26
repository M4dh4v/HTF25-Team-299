import React from "react";

const ContactPage: React.FC = () => (
  <div className="max-w-4xl mx-auto">
    <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">
      Contact Us
    </h2>
    <div className="bg-gray-800 rounded-lg p-6 space-y-6">
      <p className="text-gray-300">
        Have questions or feedback? We'd love to hear from you!
      </p>
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-indigo-400 mb-2">Email</h3>
          <p className="text-gray-300">support@captiongenerator.com</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-indigo-400 mb-2">
            Support
          </h3>
          <p className="text-gray-300">Available 24/7 to assist you.</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-indigo-400 mb-2">
            Feedback
          </h3>
          <p className="text-gray-300">Your feedback helps us improve!</p>
        </div>
      </div>
    </div>
  </div>
);

export default ContactPage;
