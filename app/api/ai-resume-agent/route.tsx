// import { NextRequest, NextResponse } from "next/server";
// import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
// import { inngest } from "@/inngest/client";
// import axios from "axios";
// import { currentUser } from "@clerk/nextjs/server";

// export async function POST(request:NextRequest) {
//     const formData = await request.formData();
//     const resumeFile:any = formData.get("resumeFile");
//     const recordId = formData.get("recordId");
//     const user = await currentUser();
//     const loader = new WebPDFLoader(resumeFile);
//     const docs = await loader.load();
//     console.log("Loaded documents:", docs[0]); // raw pdf text

//     const arrayBuffer = await resumeFile.arrayBuffer();
//     const base64 = Buffer.from(arrayBuffer).toString('base64');

//     const resultId = await inngest.send({
//         name: 'AiResumeAgent',
//         data: {
//             recordId: recordId,
//             base64ResumeFile : base64,
//             pdfText: docs[0]?.pageContent, // raw pdf text
//             aiAgentType : '/ai-tools/ai-resume-analyzer',
//             userEmail : user?.primaryEmailAddress?.emailAddress
//         },
//     });

//     const runId = resultId?.ids[0];

//     let runStatus;

//     while(true){
//         runStatus = await getRuns(runId);
//         console.log(runStatus?.data);
//         if(runStatus?.data[0]?.status === 'Completed')
//             break;
//         await new Promise(resolve => setTimeout(resolve, 500)); // Wait for 1 second before checking again
//     }

//     //console.log(NextResponse.json(runStatus.data?.[0].output[0]))
//     // return NextResponse.json(runStatus.data?.[0].output?.output[0])
//     const finalOutput = runStatus.data?.[0]?.output?.[0];
//     if (!finalOutput) {
//     return NextResponse.json({ error: "No output received" }, { status: 500 });
//     }
//     return NextResponse.json(finalOutput);
// }


// export async function getRuns(runId: string) {
//     const result = await axios.get(`${process.env.INNGEST_SERVER_HOST}/v1/events/${runId}/runs`, {
//     headers: {
//         'Authorization': `Bearer ${process.env.INNGEST_SIGNING_KEY}`
//         // 'Content-Type': 'application/json',
//     },
// });

//     return result.data;
// }

import { NextRequest, NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { inngest } from "@/inngest/client";
import axios from "axios";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const resumeFile: any = formData.get("resumeFile");
        const recordId = formData.get("recordId");
        const user = await currentUser();

        if (!resumeFile || !recordId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Load and extract PDF text
        const loader = new WebPDFLoader(resumeFile);
        const docs = await loader.load();
        console.log("PDF text extracted successfully");

        // Convert file to base64
        const arrayBuffer = await resumeFile.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');

        // Send event to Inngest
        const resultId = await inngest.send({
            name: 'AiResumeAgent',
            data: {
                recordId: recordId,
                base64ResumeFile: base64,
                pdfText: docs[0]?.pageContent,
                aiAgentType: '/ai-tools/ai-resume-analyzer',
                userEmail: user?.primaryEmailAddress?.emailAddress
            },
        });

        const runId = resultId?.ids[0];
        console.log("Inngest job started with runId:", runId);

        if (!runId) {
            return NextResponse.json({ error: "Failed to start job" }, { status: 500 });
        }

        // Poll for completion
        let runStatus;
        let attempts = 0;
        const maxAttempts = 120; // 60 seconds max wait time

        while (attempts < maxAttempts) {
            try {
                runStatus = await getRuns(runId);
                console.log(`Attempt ${attempts + 1}: Status = ${runStatus?.data?.[0]?.status}`);
                
                if (runStatus?.data?.[0]?.status === 'Completed') {
                    break;
                } else if (runStatus?.data?.[0]?.status === 'Failed') {
                    console.error("Inngest job failed:", runStatus?.data?.[0]?.error);
                    return NextResponse.json({ error: "Job failed" }, { status: 500 });
                }
                
                await new Promise(resolve => setTimeout(resolve, 500));
                attempts++;
            } catch (error) {
                console.error("Error checking run status:", error);
                attempts++;
            }
        }

        if (attempts >= maxAttempts) {
            return NextResponse.json({ error: "Job timeout" }, { status: 408 });
        }

        // Extract the result from the completed job
        const jobOutput = runStatus?.data?.[0]?.output;
        console.log("Job completed. Full output:", JSON.stringify(jobOutput, null, 2));

        if (!jobOutput) {
            return NextResponse.json({ error: "No output received from job" }, { status: 500 });
        }

        // The output structure should match what your Inngest function returns
        const response = {
            success: true,
            recordId: jobOutput.recordId,
            imageUrl: jobOutput.imageUrl,
            aiReport: jobOutput.aiReport,
            message: "Resume analyzed successfully"
        };

        console.log("API Response:", response);
        return NextResponse.json(response);

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ 
            error: "Internal server error", 
            details: error instanceof Error ? error.message : "Unknown error" 
        }, { status: 500 });
    }
}

export async function getRuns(runId: string) {
    try {
        const result = await axios.get(`${process.env.INNGEST_SERVER_HOST}/v1/events/${runId}/runs`, {
            headers: {
                'Authorization': `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
                'Content-Type': 'application/json',
            },
            timeout: 10000, // 10 second timeout
        });

        return result.data;
    } catch (error) {
        console.error("Error fetching run status:", error);
        throw error;
    }
}