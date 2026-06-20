import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React from 'react'

function InterviewItemCard({ interview }) {

    const router = useRouter();

    const onStart = () => {
        router.push(`/dashboard/interview/${interview.mockId}`);
    }
    return (
        <div className='border shadow-sm rounded-lg p-3 mt-2'>
            <h2 className='font-bold text-blue-600 '>{interview.jobPosition}</h2>
            <h2>{interview.createdAt}</h2>

            <div className='flex justify-between items-center mt-2'>
                <Link href={`/dashboard/interview/${interview.mockId}/feedback`}>
                    <Button size="sm" variant="outline" >Feedback</Button>
                </Link>
                <Link href={`/dashboard/interview/${interview.mockId}`}>
                    <Button size="sm" onClick={onStart}>Start</Button>
                </Link>
            </div>

        </div>
    )
}

export default InterviewItemCard