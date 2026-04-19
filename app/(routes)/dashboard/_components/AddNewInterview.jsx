"use client";
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { chatSession } from '@/configs/GeminiAiModel';
import { LoaderCircle } from 'lucide-react';
import { db } from '@/configs/db';
import { MockInterviewTable } from '@/configs/schema';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { useRouter } from 'next/navigation';

function AddNewInterview() {
    const [openDialog, setOpenDialog] = useState(false);
    const [jobPosition, setJobPosition] = useState();
    const [jobDesc, setJobDesc] = useState();
    const [jobExp, setJobExp] = useState();
    const [loading, setLoading] = useState(false);
    const [jsonResponse, setJsonResponse] = useState();
    const { user } = useUser();
    const router = useRouter();

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const prompt = `Job position: ${jobPosition}, job description: ${jobDesc}, years of experience: ${jobExp}. Based on this, generate 8 interview questions with answers in JSON format. Output should be a JSON array where each object contains 'question' and 'answer' fields only.`;

        try {
            const result = await chatSession.sendMessage(prompt);
            const rawText = await result.response.text();

            const cleaned = rawText
                .replace('```json', '')
                .replace('```', '')
                .trim();

            const match = cleaned.match(/\[\s*{[\s\S]*?}\s*\]/);
            if (!match) throw new Error("No valid JSON array found in response.");

            const jsonArray = match[0];
            const parsed = JSON.parse(jsonArray);
            const prettyJson = JSON.stringify(parsed, null, 2);
            setJsonResponse(prettyJson);

            const dbResp = await db.insert(MockInterviewTable).values({
                mockId: uuidv4(),
                jsonMockResp: prettyJson,
                jobPosition,
                jobDesc,
                jobExperience: jobExp,
                userEmail: user?.primaryEmailAddress?.emailAddress,
                createdBy: user?.primaryEmailAddress?.emailAddress,
                createdAt: moment().format('DD-MM-YYYY')
            }).returning({ mockId: MockInterviewTable.mockId });

            console.log("Inserted ID:", dbResp);

            setOpenDialog(false);
            router.push('/dashboard/interview/' + dbResp[0]?.mockId);
        } catch (err) {
            console.error("Error:", err);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div
                className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
                onClick={() => setOpenDialog(true)}
            >
                <h1 className='text-3xl text-center'>+ Add New</h1>
            </div>

            <Dialog open={openDialog}>
                <DialogContent className='max-w-2xl'>
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>Tell us more about your job Interview</DialogTitle>
                        <DialogDescription>
                            Add Details about your job position/role, job description and years of experience
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={onSubmit}>
                        <div className='mt-7 my-3'>
                            <label>Job Role/Job Position</label>
                            <Input
                                placeholder='Ex. Full Stack Developer'
                                required
                                onChange={(e) => setJobPosition(e.target.value)}
                            />
                        </div>

                        <div className='my-3'>
                            <label>Job Description</label>
                            <Textarea
                                placeholder='Ex. React, Node.js, MongoDB etc'
                                required
                                onChange={(e) => setJobDesc(e.target.value)}
                            />
                        </div>

                        <div className='my-3'>
                            <label>Years of Experience</label>
                            <Input
                                placeholder='0'
                                type='number'
                                max={10}
                                required
                                onChange={(e) => setJobExp(e.target.value)}
                            />
                        </div>

                        <div className='flex gap-5 justify-end'>
                            <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>
                                Cancel
                            </Button>
                            <Button type='submit' disabled={loading}>
                                {loading ? (
                                    <>
                                        <LoaderCircle className='animate-spin mr-2' />
                                        Generating From AI
                                    </>
                                ) : (
                                    'Start Interview'
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default AddNewInterview;