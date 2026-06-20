
// -------------------Correct hangling with this just routing issur
// import { inngest } from "@/inngest/client";
// import { currentUser } from "@clerk/nextjs/server";
// import axios from "axios";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//     const user = await currentUser();
    
//     try {
//         const { roadmapId, userInput } = await req.json();

//         if (!userInput) {
//             return NextResponse.json({ error: "Missing user input" }, { status: 400 });
//         }

//         console.log("Sending event to Inngest with data:", { userInput, roadmapId, userEmail: user?.primaryEmailAddress?.emailAddress });

//         const resultId = await inngest.send({
//             name: 'AiRoadMapAgent',
//             data: {
//                 userInput: userInput,
//                 roadmapId: roadmapId,
//                 userEmail: user?.primaryEmailAddress?.emailAddress
//             },
//         });

//         console.log("Inngest send result:", JSON.stringify(resultId, null, 2));
//         const runId = resultId?.ids[0];
//         console.log("Extracted runId:", runId);
        
//         if (!runId) {
//             return NextResponse.json({ error: "Failed to get run ID" }, { status: 500 });
//         }

//         let runStatus;
//         let attempts = 0;
//         const maxAttempts = 60; // Reduced to 30 seconds (60 * 500ms)

//         while (attempts < maxAttempts) {
//             try {
//                 runStatus = await getRuns(runId);
//                 console.log(`Attempt ${attempts + 1}: Run status:`, runStatus?.status);
                
//                 // Handle API errors from Inngest
//                 if (runStatus?.error) {
//                     console.error("Inngest API error:", runStatus.error);
//                     return NextResponse.json({ 
//                         error: "Inngest API error",
//                         details: runStatus.error 
//                     }, { status: 500 });
//                 }
                
//                 // Handle null response from getRuns
//                 if (runStatus === null) {
//                     console.log("getRuns returned null - API call failed");
//                     attempts++;
//                     await new Promise(resolve => setTimeout(resolve, 500));
//                     continue;
//                 }
                
//                 if (runStatus?.status === 'Completed') {
//                     console.log("Run completed successfully!");
//                     break;
//                 }
                
//                 if (runStatus?.status === 'Failed') {
//                     console.error("Inngest function failed:", runStatus);
//                     return NextResponse.json({ 
//                         error: "Inngest function failed",
//                         details: runStatus?.error || "Function execution failed"
//                     }, { status: 500 });
//                 }
                
//                 await new Promise(resolve => setTimeout(resolve, 500));
//                 attempts++;
                
//             } catch (pollError) {
//                 console.error("Error while polling:", pollError);
//                 attempts++;
//                 await new Promise(resolve => setTimeout(resolve, 1000));
//             }
//         }

//         if (attempts >= maxAttempts) {
//             console.error("Request timeout - final status:", runStatus?.status);
//             return NextResponse.json({ 
//                 error: "Request timeout - function took too long to complete",
//                 lastStatus: runStatus?.status || "unknown"
//             }, { status: 504 });
//         }

//         console.log("Final run data:", JSON.stringify(runStatus, null, 2));
        
//         // Extract the actual content from the response
//         let roadmapData = null;
//         let success = false;
        
//         try {
//             // The function now returns a structured response
//             if (runStatus?.output) {
//                 const output = runStatus.output;
                
//                 if (output.success) {
//                     roadmapData = output.roadmap;
//                     success = true;
//                 } else {
//                     return NextResponse.json({ 
//                         error: "Function execution failed",
//                         details: output.message || output.error || "Unknown error"
//                     }, { status: 500 });
//                 }
//             } else {
//                 return NextResponse.json({ 
//                     error: "No output received from function",
//                     details: "Function completed but returned no data"
//                 }, { status: 500 });
//             }
            
//         } catch (extractError) {
//             console.error("Error extracting content:", extractError);
//             return NextResponse.json({ 
//                 error: "Error processing function response",
//                 details: extractError instanceof Error ? extractError.message : "Unknown extraction error"
//             }, { status: 500 });
//         }
        
//         // Format response to match frontend expectations
//         const formattedResponse = {
//             success: success,
//             content: roadmapData,
//             role: "assistant",
//             type: "roadmap",
//             roadmapId: roadmapId
//         };

//         console.log("Formatted response:", formattedResponse);
//         return NextResponse.json(formattedResponse);
        
//     } catch (error) {
//         console.error("API Error:", error);
//         return NextResponse.json({ 
//             error: "Internal server error",
//             details: error instanceof Error ? error.message : "Unknown error"
//         }, { status: 500 });
//     }
// }

// export async function getRuns(runId: string) {
//     try {
//         const url = `${process.env.INNGEST_SERVER_HOST}/v1/runs/${runId}`;
//         console.log("Fetching from URL:", url);
        
//         const result = await axios.get(url, {
//             headers: {
//                 'Authorization': `Bearer ${process.env.INNGEST_SIGNING_KEY}`
//             },
//             timeout: 10000 // 10 second timeout
//         });
        
//         return result.data;
//     } catch (error) {
//         console.error("Error fetching runs:", error);
        
//         if (axios.isAxiosError(error)) {
//             console.error("Axios error response:", error.response?.data);
//             console.error("Axios error status:", error.response?.status);
//         }
        
//         return null;
//     }
// }

import { inngest } from "@/inngest/client";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const user = await currentUser();
     
    try {
        const { roadmapId, userInput } = await req.json();

        if (!userInput) {
            return NextResponse.json({ error: "Missing user input" }, { status: 400 });
        }

        console.log("Sending event to Inngest with data:", { 
            userInput, 
            roadmapId, 
            userEmail: user?.primaryEmailAddress?.emailAddress 
        });

        // Send the event to Inngest
        const resultId = await inngest.send({
            name: 'AiRoadMapAgent',
            data: {
                userInput: userInput,
                roadmapId: roadmapId,
                userEmail: user?.primaryEmailAddress?.emailAddress
            },
        });

        console.log("Inngest send result:", JSON.stringify(resultId, null, 2));
        
        // Return immediately after successfully sending to Inngest
        return NextResponse.json({
            success: true,
            message: "Roadmap generation started",
            roadmapId: roadmapId,
            runId: resultId?.ids[0],
            status: "processing"
        }, { status: 200 });
        
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ 
            error: "Internal server error",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}

// Separate endpoint to check status
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const runId = searchParams.get('runId');
        const roadmapId = searchParams.get('roadmapId');

        if (!runId && !roadmapId) {
            return NextResponse.json({ error: "Missing runId or roadmapId" }, { status: 400 });
        }

        if (runId) {
            // Check Inngest run status
            const runStatus = await getRuns(runId);
            
            if (!runStatus) {
                return NextResponse.json({ 
                    status: "unknown",
                    message: "Unable to fetch run status"
                });
            }

            if (runStatus.status === 'Completed') {
                return NextResponse.json({
                    status: "completed",
                    success: runStatus.output?.success || false,
                    roadmap: runStatus.output?.roadmap || null,
                    message: runStatus.output?.message || "Completed"
                });
            } else if (runStatus.status === 'Failed') {
                return NextResponse.json({
                    status: "failed",
                    error: runStatus.error || "Function execution failed"
                });
            } else {
                return NextResponse.json({
                    status: "processing",
                    message: "Roadmap is still being generated"
                });
            }
        }

        // If roadmapId is provided, check database or storage for completed roadmap
        // This is where you'd implement your database lookup
        // For now, return processing status
        return NextResponse.json({
            status: "processing",
            message: "Use runId for more accurate status checking"
        });

    } catch (error) {
        console.error("Status check error:", error);
        return NextResponse.json({ 
            error: "Error checking status",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}

async function getRuns(runId: string) {
    try {
        const url = `${process.env.INNGEST_SERVER_HOST}/v1/runs/${runId}`;
        console.log("Fetching from URL:", url);
        
        const { default: axios } = await import('axios');
        const result = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${process.env.INNGEST_SIGNING_KEY}`
            },
            timeout: 10000
        });
        
        return result.data;
    } catch (error) {
        console.error("Error fetching runs:", error);
        return null;
    }
}