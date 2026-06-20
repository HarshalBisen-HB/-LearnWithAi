import React from "react";
import WelcomeBanner from "./_components/welcomeBanner";
import AiTools from "./_components/AiToolsList";
import History from "./_components/History";
import InterviewList from "./_components/InterviewList";

function Dashboard() {
  return (
    <div className="flex flex-col gap-8">
      <WelcomeBanner />
      
      <div className="p-5 border rounded-xl bg-white shadow-sm">
        <InterviewList />
      </div>

      <AiTools />
      
      <History />
    </div>
  );
}

export default Dashboard;
