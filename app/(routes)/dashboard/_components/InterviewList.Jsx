"use client";
import { db } from "@/configs/db";
import { MockInterviewTable } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import InterviewItemCard from "./InterviewItemCard";

function InterviewList() {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);

  useEffect(() => {
    user && GetInterviewList();
  }, [user])

  const GetInterviewList = async () => {
    const result = await db
      .select()
      .from(MockInterviewTable)
      .where(eq(
        MockInterviewTable.userEmail,
        user?.primaryEmailAddress?.emailAddress
      ))
      .orderBy(desc(MockInterviewTable.id));

    console.log("r", result);
    setInterviewList(result);
  };

  return (
    <div className="w-full">
      <h2 className="font-bold text-2xl mb-1 text-black">Previous Interviews</h2>
      <p className="text-gray-600 mb-6 text-sm">Review your past performance and feedback</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interviewList && interviewList.length > 0 ? (
          interviewList.map((interview, index) => (
            <InterviewItemCard interview={interview} key={index} />
          ))
        ) : (
          <p className="text-gray-500 col-span-full py-10 text-center border-2 border-dashed rounded-xl">No interviews found. Start your first one above!</p>
        )}
      </div>
    </div>
  );
}

export default InterviewList;