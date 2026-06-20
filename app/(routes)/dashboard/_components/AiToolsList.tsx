import { Divide } from "lucide-react";
import React from "react";
import AiToolCard from "./AiToolCard";

export const aiToolsList = [
  {
    name: "AI Career Q&A Agent",
    desc: "Got questions? Get instant answers!",
    icon: "/chatbot.png",
    button: "Ask Now",
    path: "/ai-tools/ai-chat",
  },

  {
    name: "AI Resume Analyzer",
    desc: "Enhance your resume",
    icon: "/resume.png",
    button: "Analyze Now",
    path: "/ai-tools/ai-resume-analyzer",
  },

  {
    name: "Career RoadMap Generator",
    desc: "Build your roadmap",
    icon: "/roadmap.png",
    button: "Generate New",
    path: "/ai-tools/ai-roadmap-agent",
  },
];
function AiToolsList() {
  return (
    <div className="p-6 bg-white border rounded-xl shadow-sm">
      <h2 className="font-bold text-2xl text-black">Available AI tools</h2>
      <p className="text-gray-600 mb-6 text-sm">Let these smart tools guide you on your career journey</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-7 mt-4">
        {aiToolsList.map((tool: any, index) => (
          <AiToolCard key={index} tool={tool} />
        ))}
      </div>
    </div>
  );
}

export default AiToolsList;
