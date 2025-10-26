import React from "react";

const ContactPage: React.FC = () => (
  <div className="flex justify-center items-start min-h-screen p-4">
    <div className="max-w-4xl w-full">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-400 to-purple-500 text-transparent bg-clip-text">
        Contact Us
      </h2>
      <div className="bg-neutral-800 rounded-lg p-6 space-y-6">
        <p className="text-gray-300">
          Have questions or feedback? We'd love to hear from you!
        </p>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-green-400 mb-2">Email</h3>
            <p className="text-gray-300">support@captiongenerator.com</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-green-400 mb-2">
              Support
            </h3>
            <p className="text-gray-300">Available 24/7 to assist you.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-green-400 mb-2">
              Feedback
            </h3>
            <p className="text-gray-300">Your feedback helps us improve!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ContactPage;
