import React from "react";

const AboutPage: React.FC = () => (
  <div className="flex justify-center items-start min-h-screen p-4">
    <div className="max-w-4xl w-full">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
        About Us
      </h2>
      <div className="bg-neutral-800 rounded-lg p-6 space-y-6">
        <p className="text-gray-300">
          Welcome to{" "}
          <span className="font-semibold text-emerald-500">No Cap</span>, your
          ultimate AI-powered caption generator designed to create viral-worthy
          captions in a flash! Whether you're a social media guru, content
          creator, or just someone looking to spice up your posts, No Cap is
          here to help you write captions that hit the mark every time.
        </p>
        <p className="text-gray-300">
          Powered by the latest in AI technology, our tool crafts clever,
          engaging captions that are ready to make waves on any platform.
        </p>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-emerald-500 mb-2">
              Ishaan Prasad
            </h3>
            <p className="text-gray-300">
              Founder of McManiac | 2nd Year CSE Student, CBIT. <br />
              Ishaan is the visionary behind McManiac, combining his love for AI
              and video games has created a gameing network which hosts over
              10,000+ players a month.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-emerald-500 mb-2">
              Siva Madhav
            </h3>
            <p className="text-gray-300">
              Lead Developer at Teleparadim | CSE with Specialization in AIML,
              KMIT.
              <br />
              Madhav is the mastermind who ensures No Cap’s AI engine generates
              viral-ready, relevant captions with precision while single
              handedly managing all backend content.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-emerald-500 mb-2">
              Pranav Chandra
            </h3>
            <p className="text-gray-300">
              CSE Student, Gitam University.
              <br /> Pranav is a key member of the development team, constantly
              optimizing No Cap’s AI to enhance its accuracy and performance and
              leads the front end development for this project.
            </p>
          </div>
        </div>
        <p className="text-gray-300">
          At <span className="font-semibold text-emerald-500">No Cap</span>, we
          believe in the power of words to connect, inspire, and entertain. Our
          mission is simple: to provide content creators, influencers, and
          businesses with the best AI-powered caption generator that turns any
          idea into a viral sensation.
        </p>
        <p className="text-gray-300">
          No more writer’s block. No more searching for the perfect words. Just
          quick, creative, and viral-ready captions—at your fingertips.
        </p>
      </div>
    </div>
  </div>
);

export default AboutPage;
