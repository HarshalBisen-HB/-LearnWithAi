import React from "react";
import AddNewInterview from "./AddNewInterview";

function WelcomeBanner() {
  return (
    <div
      className="flex flex-col gap-5 rounded-xl p-8"
      style={{
        background:
          "linear-gradient(0deg, rgba(251, 193, 162, 1) 0%, rgba(148, 187, 233, 1) 100%)",
      }}
    >
      <div className="flex flex-col text-black">
        <h1 className="text-4xl font-bold mb-2">Welcome</h1>
        <h2 className="text-2xl font-semibold mb-2">
          We're excited to have you here
        </h2>
        <p className="text-lg mb-4 opacity-90">
          Unlock your potential with intelligent career guidance. From resume analysis to interview prep, LearnMate transforms your career journey.
        </p>

        {/* Quote */}
        <p className="text-sm italic text-gray-800 mb-6 border-l-4 border-black pl-4">
          "Practice like you’ve never won. Perform like you’ve never lost."
        </p>
        
        <div className="flex items-center gap-4">
          <AddNewInterview />
        </div>
      </div>
    </div>
  );
}

export default WelcomeBanner;
