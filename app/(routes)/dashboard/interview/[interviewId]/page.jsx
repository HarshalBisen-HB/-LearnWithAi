"use client";
import React, { use, useEffect, useState } from "react"; // ✅ include `use`
import { eq } from "drizzle-orm";
import { db } from "@/configs/db";
import { MockInterviewTable } from "@/configs/schema";
import { Lightbulb, WebcamIcon } from "lucide-react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function Interview({ params }) {
    const { interviewId } = use(params); // ✅ unwrap the params Promise

    const [interviewData, setInterviewData] = useState();
    const [webCamEnabled, setWebCamEnabled] = useState(false);

    useEffect(() => {
        console.log("interviewId:", interviewId);
        getInterviewDetails();
    }, [interviewId]);

    const getInterviewDetails = async () => {
        const result = await db
            .select()
            .from(MockInterviewTable)
            .where(eq(MockInterviewTable.mockId, interviewId));
        console.log("Interview data:", result);
        setInterviewData(result[0]);
    };

    return (
        <div className="my-10">
            <h2 className="font-bold text-2xl">Let's Get Started</h2>
            <div className="grid grid-cols-1 md:grid-cols-2  gap-10">

                {interviewData ? (
                    <div className="flex flex-col my-5 gap-5">
                        <div className="flex flex-col  gap-5 p-5 rounded-lg border">
                            <h2 className="text-lg">
                                <strong>Job Role/Job Position:</strong> {interviewData.jobPosition}
                            </h2>
                            <h2 className="text-lg">
                                <strong>Job Description/Tech Stack:</strong> {interviewData.jobDesc}
                            </h2>
                            <h2 className="text-lg">
                                <strong>Years of Experience:</strong> {interviewData.jobExperience} years
                            </h2>
                        </div>
                        <div className="p-5 border rounded-lg border-yellow-300 bg-yellow-100">
                            <h2 className="flex gap-2 items-center"><Lightbulb /><strong>Information</strong></h2>
                            <h2>Enable video web cam and microphone to start your Ai generated Mock interview, Note:we never record your video, web cam access you can disable at any time if you want</h2>
                        </div>
                    </div>
                ) : (
                    <p className="text-muted-foreground my-5">Loading interview details...</p>
                )}

                <div>
                    {webCamEnabled ? (
                        <Webcam
                            onUserMedia={() => setWebCamEnabled(true)}
                            onUserMediaError={() => setWebCamEnabled(false)}
                            mirrored
                            style={{ height: 300, width: 300 }}
                        />
                    ) : (
                        <>
                            <WebcamIcon className="h-72 w-full my-7 p-20 bg-secondary rounded-lg border" />
                            <Button variant="ghost" className="w-full" onClick={() => setWebCamEnabled(true)}>
                                Enable web Cam and Microphone
                            </Button>
                        </>
                    )}
                </div>
            </div>
            <div className="flex justify-end items-end mt-10">
                <Link href={`/dashboard/interview/${interviewId}/startInterview`}>
                    <Button>Start Interview</Button>
                </Link>
            </div>


        </div>
    );
}

export default Interview;
