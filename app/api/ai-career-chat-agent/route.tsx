
import { inngest } from "@/inngest/client";
import axios from "axios";
import { NextResponse } from "next/server";
import Markdown from 'react-markdown'

export async function POST(req: any) {
    try {
        const { userInput } = await req.json();

        if (!userInput) {
            return NextResponse.json({ error: "Missing user input" }, { status: 400 });
        }

        const resultId = await inngest.send({
            name: 'AiCareerAgent',
            data: {
                userInput: userInput,
            },
        });

        console.log("Inngest send result:", JSON.stringify(resultId, null, 2));
        const runId = resultId?.ids[0];
        console.log("Extracted runId:", runId);
        
        if (!runId) {
            return NextResponse.json({ error: "Failed to get run ID" }, { status: 500 });
        }

        let runStatus;
        let attempts = 0;
        const maxAttempts = 60; // 30 seconds timeout with 500ms intervals

        while (attempts < maxAttempts) {
            try {
                runStatus = await getRuns(runId);
                console.log(`Attempt ${attempts + 1}: Full runStatus:`, runStatus);
                
                // Handle null response from getRuns
                if (runStatus === null) {
                    console.log("getRuns returned null - API call failed");
                    attempts++;
                    await new Promise(resolve => setTimeout(resolve, 500));
                    continue;
                }
                
                // Access the nested data structure correctly
                const runData = runStatus.data?.[0];
                console.log(`Attempt ${attempts + 1}: Run status:`, runData?.status);
                
                if (runData?.status === 'Completed') {
                    console.log("Run completed successfully!");
                    break;
                }
                
                if (runData?.status === 'Failed') {
                    return NextResponse.json({ 
                        error: "Inngest function failed" 
                    }, { status: 500 });
                }
                
                await new Promise(resolve => setTimeout(resolve, 500));
                attempts++;
            } catch (pollError) {
                console.error("Error while polling:", pollError);
                attempts++;
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        if (attempts >= maxAttempts) {
            return NextResponse.json({ 
                error: "Request timeout - function took too long to complete" 
            }, { status: 504 });
        }

        // Extract the actual content from the response
        const runData = runStatus.data?.[0]; // Access nested data structure
        console.log("Full run data:", JSON.stringify(runData, null, 2));
        
        let actualContent = "No response received";
        
        // Based on your terminal output, the content is in output.output[0].content
        if (runData?.output?.output?.[0]?.content) {
            actualContent = runData.output.output[0].content;
        } else if (runData?.output?.raw) {
            try {
                // Fallback: Parse the raw JSON string if direct access fails
                const rawData = JSON.parse(runData.output.raw);
                actualContent = rawData?.candidates?.[0]?.content?.parts?.[0]?.text || "No content found in response";
            } catch (parseError) {
                console.error("Error parsing raw response:", parseError);
                actualContent = "Error parsing response";
            }
        }
        
        // Format response to match frontend expectations
        const formattedResponse = {
            content: actualContent,
            role: "assistant",
            type: "text"
        };

        console.log("Formatted response:", formattedResponse);
        return NextResponse.json(formattedResponse);
        
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ 
            error: "Internal server error" 
        }, { status: 500 });
    }
}

export async function getRuns(runId: string) {
    try {
        const url = `${process.env.INNGEST_SERVER_HOST}/v1/events/${runId}/runs`;
        console.log("Fetching from URL:", url);
        console.log("Using runId:", runId);
        console.log("INNGEST_SERVER_HOST:", process.env.INNGEST_SERVER_HOST);
        
        const result = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${process.env.INNGEST_SIGNING_KEY}`
            },
        });
        
        console.log("Raw API response:", result.status, result.statusText);
        console.log("Response data:", JSON.stringify(result.data, null, 2));
        
        return result.data;
    } catch (error) {
        console.error("Error fetching runs - Full error:", error);
        if (typeof error === "object" && error !== null && "response" in error) {
            // @ts-ignore
            console.error("Error response:", (error as any).response?.data);
            // @ts-ignore
            console.error("Error status:", (error as any).response?.status);
        }
        return null; // Return null instead of throwing to continue debugging
    }
}