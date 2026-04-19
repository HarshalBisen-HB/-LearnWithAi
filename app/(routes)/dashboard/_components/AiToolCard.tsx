"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link"; // ✅ Correct
import { v4 as uuidv4 } from "uuid"; // Importing uuid for unique IDs
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";
import ResumeUploadDialog from "./ResumeUploadDialog";
import RoadmapGeneratorDialog from "./RoadmapGeneratorDialog";

interface TOOL {
  name: string;
  desc: string;
  icon: string;
  button: string;
  path: string;
}

type AIToolProps = {
  tool: TOOL;
};

function AiToolCard({ tool }: AIToolProps) {
  const id = uuidv4();
  const { user } = useUser();
  const router = useRouter();
  const [openResumeUpload, setOpenResumeUpload] = useState(false);
  const [openRoadmapDialog, setOpenRoadmapDialog] = useState(false);

  const onClickButton = async () => {
    if (tool.name == "AI Resume Analyzer") {
      // Open the Resume Upload Dialog
      setOpenResumeUpload(true);
      return;
    }
    if (tool.path == "/ai-tools/ai-roadmap-agent") {
      setOpenRoadmapDialog(true);
      return;
    }

    // create a new history entry for the user
    const result = await axios.post("/api/history", {
      recordId: id,
      content: [],
      aiAgentType: tool.path,
    });
    console.log(result);
    router.push(tool.path + "/" + id); // Navigate to the tool's path with the unique ID
  }; // Assuming you have a user context or hook to get the current user
  return (
    <div className="p-5 bg-white rounded-xl shadow-xl">
      <Image src={tool.icon} alt={tool.name} width={60} height={60} />
      <h2 className="font-bold mt-2">{tool.name}</h2>
      <p className="text-gray-400">{tool.desc}</p>

      {/* <Link href={tool.path + "/" + id}> */}
      <Button
        className="w-full mt-3 hover:bg-[#dae1ff]   hover:text-black"
        onClick={onClickButton}
      >
        {tool.button}
      </Button>
      <ResumeUploadDialog
        openResumeUpload={openResumeUpload}
        setOpenResumeDialog={setOpenResumeUpload}
      />
      <RoadmapGeneratorDialog
        openDialog={openRoadmapDialog}
        setOpenDialog={() => setOpenRoadmapDialog(false)}
      />
    </div>
  );
}

export default AiToolCard;
