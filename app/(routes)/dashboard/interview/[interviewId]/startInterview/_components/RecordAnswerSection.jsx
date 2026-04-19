"use client"
import Webcam from 'react-webcam'
import { useEffect, useState } from 'react'
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic } from 'lucide-react';
import { toast } from 'sonner';
import { chatSession } from '@/configs/GeminiAiModel';
import { UserAnswer } from '@/configs/schema';
import { useUser } from '@clerk/nextjs';
import { db } from '@/configs/db';
import moment from 'moment';

function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
  const [userAnswer, setUserAnswer] = useState('');
  const { user } = useUser();
  const [loading, setLoading] = useState(false);


  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });

  useEffect(() => {
    results.map((result) => (
      setUserAnswer(prevAns => prevAns + result?.transcript)
    ))
  }, [results])

  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      UpdateUserAnswer();
    }
  }, [userAnswer])

  const StartStopRecording = async () => {
    if (isRecording) {

      stopSpeechToText()
      // if (userAnswer?.length < 10) {
      //   setLoading(false);
      //   toast('Error while saving answer, please record again it should be more than 10 characters', {
      //     description: 'Your answer is too short.',
      //     duration: 2000,
      //   })
      //   return;
      // }

    }
    else {
      startSpeechToText()
    }
  }

  const UpdateUserAnswer = async () => {
    console.log("User Answer:", userAnswer);
    setLoading(true);
    const feedbackPrompt = "Question:" + mockInterviewQuestion[activeQuestionIndex]?.question + "User Answer:" + userAnswer + ",depends on the question and user answer for given interview question "
      + "please give us rating for answer and feedback as area of improvement if any" +
      "in just 3 to 4 lines to improve it in json format with rating field and feedback field"
      ;

    const result = await chatSession.sendMessage(feedbackPrompt);

    const mockJsonResp = (result.response.text()).replace('```json', '').replace('```', '')
    console.log("Mock JSON Response:", mockJsonResp);
    const JsonFeedbackResp = JSON.parse(mockJsonResp);

    const resp = await db.insert(UserAnswer).values({
      mockId: interviewData?.mockId,
      question: mockInterviewQuestion[activeQuestionIndex]?.question,
      correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
      userAns: userAnswer,
      feedback: JsonFeedbackResp?.feedback,
      rating: JsonFeedbackResp?.rating,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      createdAt: moment().format('DD-MM-YYYY')
    })

    if (resp) {
     toast.success('Answer saved successfully!', {
    style: {
      background: '#10B981', // Green background
      color: '#ffffff',      // White text
    },
  })
  setUserAnswer('');
  setResults([]);

    }

    setResults([]);
    setLoading(false);


  }




  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='flex flex-col my-10 justify-center items-center bg-secondary rounded-lg p-5 '>
        <Image src={'/webcam.png'} width={200} height={200} alt='webcam'
          className='absolute' />
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: '100%',
            zIndex: 10,
          }}
        />
      </div>
      <Button
        disabled={loading}
        variant="default" className="my-10"
        onClick={StartStopRecording}>
        {isRecording ?
          <h2 className='text-red-500 flex gap-2'><Mic />Stop Recording</h2>
          : 'Record Answer'}

      </Button>

      <Button onClick={() => console.log(userAnswer)}>Show User Answer</Button>

    </div>
  )
}

export default RecordAnswerSection