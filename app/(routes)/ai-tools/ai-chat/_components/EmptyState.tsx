import React from 'react'
const questionsList = [
    'What skills do I need to become a data scientist?',
    'How can I improve my resume for a software engineering position?',
]

function EmptyState({selectedQuestion} : any) {
    return (
        <div>
            <h2 className='font-bold text-xl text-center'>Ask Anything to AI Career Agent</h2>
            <div>
                {questionsList.map((question, index) => (
                    <h2 className='p-4 text-center border rounded-lg my-3 hover:border-primary cursor-pointer'
                        key = {index}
                        onClick = {() => selectedQuestion(question)}>
                        {question}</h2>    
                ))}
            </div>
        </div>
    )
}

export default EmptyState