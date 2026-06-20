"use client";
import React, { use, useEffect, useState } from 'react'
import { eq } from "drizzle-orm";
import { db } from "@/configs/db";
import { MockInterviewTable } from "@/configs/schema";
import QuestionsSection from './_components/QuestionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
function StartInterview({ params }) {
    const { interviewId } = use(params);
    const [interviewData, setInterviewData] = useState();
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState();
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    useEffect(() => {
        getInterviewDetails();
    }, [interviewId])

    const getInterviewDetails = async () => {
        const result = await db
            .select()
            .from(MockInterviewTable)
            .where(eq(MockInterviewTable.mockId, interviewId));


        const jsonMockResp = JSON.parse(result[0].jsonMockResp);
        console.log("jsonMockResp:", jsonMockResp);
        setMockInterviewQuestion(jsonMockResp);
        setInterviewData(result[0]);
    };
    return (
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5 border border-gray-300 rounded-lg p-3'>
                {/* Questions */}
                <QuestionsSection
                    mockInterviewQuestion={mockInterviewQuestion}
                    activeQuestionIndex={activeQuestionIndex}
                />

                {/* video /audio recording */}
                <RecordAnswerSection
                    mockInterviewQuestion={mockInterviewQuestion}
                    activeQuestionIndex={activeQuestionIndex}
                    interviewData={interviewData}
                />
            </div>
            <div className='flex justify-end gap-5 mt-5'>
                {activeQuestionIndex > 0 &&
                    <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}>Previous Question</Button>}
                {activeQuestionIndex != mockInterviewQuestion?.length - 1 &&
                    <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>Next Question</Button>}
                {activeQuestionIndex == mockInterviewQuestion?.length - 1 &&
                   <Link href={'/dashboard/interview/'+interviewData?.mockId+'/feedback'}><Button>End</Button></Link> }


            </div>

        </div>
    )
}

export default StartInterview