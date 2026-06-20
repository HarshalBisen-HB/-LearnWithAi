"use client";
import React, { use, useEffect, useState } from 'react'
import { db } from '@/configs/db'
import { UserAnswer } from '@/configs/schema'
import { eq } from 'drizzle-orm';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown, Download, LayoutDashboard, BookOpen, RotateCcw, TrendingUp, Target, Award } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


function FeedBack({ params }) {
    const router = useRouter();
    const { interviewId } = use(params);
    const [feedbackData, setFeedbackData] = useState([]);
    const [overallStats, setOverallStats] = useState({
        totalQuestions: 0,
        averageRating: 0
    });
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    useEffect(() => {
        GetFeedback();
    }, [interviewId])

    const GetFeedback = async () => {
        const result = await db.select()
            .from(UserAnswer)
            .where(eq(UserAnswer.mockId, interviewId))
            .orderBy(UserAnswer.id);

        console.log("Feedback data:", result);
        setFeedbackData(result);
        calculateStats(result);
    }

    const calculateStats = (data) => {
        if (data.length === 0) return;

        const totalQuestions = data.length;
        const totalRating = data.reduce((sum, item) => sum + (parseFloat(item.rating) || 0), 0);
        const averageRating = (totalRating / totalQuestions).toFixed(1);

        setOverallStats({
            totalQuestions,
            averageRating
        });
    }

    const getRatingBadgeClass = (rating) => {
        const numRating = parseFloat(rating);
        if (numRating >= 8) return 'bg-green-500 text-white';
        if (numRating >= 6) return 'bg-blue-500 text-white';
        if (numRating >= 4) return 'bg-orange-500 text-white';
        return 'bg-red-500 text-white';
    }

    const getRatingLabel = (rating) => {
        const numRating = parseFloat(rating);
        if (numRating >= 8) return 'Excellent';
        if (numRating >= 6) return 'Good';
        if (numRating >= 4) return 'Average';
        return 'Needs Improvement';
    }

    const generatePDF = async () => {
        setIsGeneratingPDF(true);

        try {
            // Dynamic import to avoid SSR issues
            const jsPDF = (await import('jspdf')).default;
            const doc = new jsPDF();

            // PDF Settings
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 20;
            const lineHeight = 7;
            let currentY = margin;

            // Helper function to add new page if needed
            const checkPageBreak = (requiredSpace = 25) => {
                if (currentY + requiredSpace > pageHeight - margin) {
                    doc.addPage();
                    currentY = margin;
                    return true;
                }
                return false;
            };

            // Helper function to wrap text
            const splitTextToSize = (text, maxWidth) => {
                return doc.splitTextToSize(text || "", maxWidth);
            };

            // Helper function to add text with proper spacing
            const addTextLines = (lines, x, color = [80, 80, 80]) => {
                doc.setTextColor(...color);
                lines.forEach(line => {
                    checkPageBreak(10);
                    doc.text(line, x, currentY);
                    currentY += lineHeight;
                });
            };

            // Title
            doc.setFontSize(24);
            doc.setTextColor(40, 40, 40);
            doc.text('Interview Performance Report', pageWidth / 2, currentY, { align: 'center' });
            currentY += 20;

            // Date
            doc.setFontSize(12);
            doc.setTextColor(100, 100, 100);
            const currentDate = new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            doc.text(`Generated on: ${currentDate}`, pageWidth / 2, currentY, { align: 'center' });
            currentY += 25;

            // Overall Statistics Box
            checkPageBreak(40);
            doc.setDrawColor(34, 197, 94);
            doc.setFillColor(240, 253, 244);
            doc.roundedRect(margin, currentY, pageWidth - 2 * margin, 35, 3, 3, 'FD');

            currentY += 12;
            doc.setFontSize(16);
            doc.setTextColor(34, 197, 94);
            doc.text('Overall Performance Summary', pageWidth / 2, currentY, { align: 'center' });

            currentY += 12;
            doc.setFontSize(14);
            doc.setTextColor(40, 40, 40);
            doc.text(`Overall Score: ${overallStats.averageRating}/10`, margin + 10, currentY);
            doc.text(`Total Questions: ${overallStats.totalQuestions}`, pageWidth / 2 + 10, currentY);

            currentY += 20;

            // Questions Section
            checkPageBreak(30);
            doc.setFontSize(18);
            doc.setTextColor(40, 40, 40);
            doc.text('Question-wise Breakdown', margin, currentY);
            currentY += 15;

            // Process each question
            feedbackData.forEach((item, index) => {
                // Calculate required space for this question
                const questionLines = splitTextToSize(item.question, pageWidth - 2 * margin - 70);
                const userAnsLines = splitTextToSize(item.userAns || "No answer provided", pageWidth - 2 * margin - 10);
                const correctAnsLines = splitTextToSize(item.correctAns, pageWidth - 2 * margin - 10);
                const feedbackLines = splitTextToSize(item.feedback, pageWidth - 2 * margin - 10);

                const requiredSpace = 25 + (questionLines.length * lineHeight) + (userAnsLines.length * lineHeight) +
                    (correctAnsLines.length * lineHeight) + (feedbackLines.length * lineHeight) + 40;

                checkPageBreak(Math.min(requiredSpace, 80));

                // Question Header Box
                doc.setDrawColor(200, 200, 200);
                doc.setFillColor(248, 250, 252);
                const headerHeight = Math.max(15, (questionLines.length * lineHeight) + 8);
                doc.roundedRect(margin, currentY, pageWidth - 2 * margin, headerHeight, 2, 2, 'FD');

                // Question Text
                doc.setFontSize(13);
                doc.setTextColor(40, 40, 40);
                currentY += 10;
                questionLines.forEach((line, idx) => {
                    doc.text(`${idx === 0 ? `Q${index + 1}. ` : ''}${line}`, margin + 5, currentY);
                    currentY += lineHeight;
                });

                // Rating (positioned at the end of question box)
                const ratingColor = parseFloat(item.rating) >= 8 ? [34, 197, 94] :
                    parseFloat(item.rating) >= 6 ? [59, 130, 246] :
                        parseFloat(item.rating) >= 4 ? [249, 115, 22] : [239, 68, 68];
                doc.setTextColor(...ratingColor);
                doc.setFontSize(11);
                doc.text(`${item.rating}/10 - ${getRatingLabel(item.rating)}`, pageWidth - margin - 60, currentY - (lineHeight * Math.max(1, questionLines.length - 1)) - 2);

                currentY += 8;

                // Your Answer Section
                checkPageBreak(15 + (userAnsLines.length * lineHeight));
                doc.setFontSize(12);
                doc.setFont(undefined, 'bold');
                doc.setTextColor(220, 38, 38);
                doc.text('Your Answer:', margin, currentY);
                currentY += 8;

                doc.setFont(undefined, 'normal');
                addTextLines(userAnsLines, margin + 5, [80, 80, 80]);
                currentY += 5;

                // Correct Answer Section
                checkPageBreak(15 + (correctAnsLines.length * lineHeight));
                doc.setFont(undefined, 'bold');
                doc.setTextColor(34, 197, 94);
                doc.text('Correct Answer:', margin, currentY);
                currentY += 8;

                doc.setFont(undefined, 'normal');
                addTextLines(correctAnsLines, margin + 5, [80, 80, 80]);
                currentY += 5;

                // Feedback Section
                checkPageBreak(15 + (feedbackLines.length * lineHeight));
                doc.setFont(undefined, 'bold');
                doc.setTextColor(217, 119, 6);
                doc.text('Feedback:', margin, currentY);
                currentY += 8;

                doc.setFont(undefined, 'normal');
                addTextLines(feedbackLines, margin + 5, [80, 80, 80]);
                currentY += 15; // Space between questions
            });

            // Footer with recommendations
            checkPageBreak(40);
            doc.setDrawColor(99, 102, 241);
            doc.setFillColor(238, 242, 255);
            doc.roundedRect(margin, currentY, pageWidth - 2 * margin, 30, 3, 3, 'FD');

            currentY += 10;
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(99, 102, 241);
            doc.text('Recommendations for Improvement', pageWidth / 2, currentY, { align: 'center' });

            currentY += 10;
            doc.setFont(undefined, 'normal');
            doc.setFontSize(11);
            doc.setTextColor(80, 80, 80);
            const avgRating = parseFloat(overallStats.averageRating);
            let recommendation = "";

            if (avgRating >= 8) {
                recommendation = "Excellent performance! Keep practicing to maintain this high standard.";
            } else if (avgRating >= 6) {
                recommendation = "Good job! Focus on areas where you scored lower to improve further.";
            } else if (avgRating >= 4) {
                recommendation = "Average performance. Consider reviewing fundamental concepts and practicing more.";
            } else {
                recommendation = "Needs improvement. Focus on studying core concepts and take practice tests.";
            }

            const recLines = splitTextToSize(recommendation, pageWidth - 2 * margin - 10);
            recLines.forEach(line => {
                doc.text(line, pageWidth / 2, currentY, { align: 'center' });
                currentY += lineHeight;
            });

            // Save the PDF
            doc.save(`Interview_Report_${interviewId}_${new Date().toISOString().split('T')[0]}.pdf`);

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4'>
            <div className='max-w-6xl mx-auto mt-5'>
                {/* Header Section */}
                <div className='bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-8 mb-8 shadow-xl'>
                    <div className='text-center'>
                        <div className='text-5xl mb-4'>🎉</div>
                        <h1 className='text-4xl font-bold mb-4'>Congratulations!</h1>
                        <p className='text-xl opacity-90 mb-8'>Here is your interview performance summary</p>

                        {/* Score Circle */}
                        <div className='flex justify-center items-center gap-5 flex-wrap'>
                            <div className='relative'>
                                <div className='w-32 h-32 rounded-full border-8 border-white/30 flex items-center justify-center bg-white/10 backdrop-blur-sm'>
                                    <div className='text-center'>
                                        <div className='text-3xl font-bold'>{overallStats.averageRating}/10</div>
                                        <div className='text-sm opacity-80'>Overall</div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Grid - Only Questions */}
                            <div className='grid grid-cols-1 gap-6 text-center'>
                                <div className='bg-white/10 backdrop-blur-sm rounded-lg p-4'>
                                    <div className='text-2xl font-bold'>{overallStats.totalQuestions}</div>
                                    <div className='text-sm opacity-80'>Questions</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Questions Section */}
                <div className='bg-white rounded-xl p-8 shadow-lg mb-8'>
                    <div className='flex items-center gap-3 mb-6'>
                        <BookOpen className='text-blue-500' size={28} />
                        <h2 className='text-2xl font-bold text-gray-800'>Question-wise Breakdown</h2>
                    </div>

                    <div className='space-y-4'>
                        {feedbackData && feedbackData.map((item, index) => (
                            <div key={index} className='border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300'>
                                <Collapsible>
                                    <CollapsibleTrigger className='w-full p-6 bg-gray-50 hover:bg-gray-100 transition-colors duration-200'>
                                        <div className='flex items-center justify-between gap-4'>
                                            <div className='flex items-center gap-4 text-left flex-1'>
                                                <span className='font-medium text-gray-800'>{item.question}</span>
                                            </div>
                                            <div className='flex items-center gap-3'>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRatingBadgeClass(item.rating)}`}>
                                                    {item.rating}/10
                                                </span>
                                                <ChevronsUpDown className='h-5 w-5 text-gray-400' />
                                            </div>
                                        </div>
                                    </CollapsibleTrigger>

                                    <CollapsibleContent>
                                        <div className='p-6 bg-white space-y-4'>
                                            {/* Rating */}
                                            <div className='flex items-center gap-3'>
                                                <TrendingUp className='text-blue-500' size={20} />
                                                <span className='font-semibold text-gray-700'>Rating:</span>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRatingBadgeClass(item.rating)}`}>
                                                    {item.rating}/10 - {getRatingLabel(item.rating)}
                                                </span>
                                            </div>

                                            {/* Your Answer */}
                                            <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                                                <div className='flex items-center gap-2 mb-2'>
                                                    <div className='w-3 h-3 bg-red-500 rounded-full'></div>
                                                    <span className='font-semibold text-red-800'>Your Answer</span>
                                                </div>
                                                <p className='text-red-700 text-sm leading-relaxed'>
                                                    {item.userAns || "No answer provided"}
                                                </p>
                                            </div>

                                            {/* Correct Answer */}
                                            <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
                                                <div className='flex items-center gap-2 mb-2'>
                                                    <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                                                    <span className='font-semibold text-green-800'>Correct Answer</span>
                                                </div>
                                                <p className='text-green-700 text-sm leading-relaxed'>
                                                    {item.correctAns}
                                                </p>
                                            </div>

                                            {/* Feedback */}
                                            <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
                                                <div className='flex items-center gap-2 mb-2'>
                                                    <div className='w-3 h-3 bg-yellow-500 rounded-full'></div>
                                                    <span className='font-semibold text-yellow-800'>Feedback</span>
                                                </div>
                                                <p className='text-yellow-700 text-sm leading-relaxed'>
                                                    {item.feedback}
                                                </p>
                                            </div>
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className=' rounded-xl p-8 '>
                    <h3 className='text-xl font-bold text-gray-800 mb-6 text-center'>Next Steps</h3>
                    <div className='flex flex-wrap justify-center gap-4'>
                        <button
                            onClick={generatePDF}
                            disabled={isGeneratingPDF || feedbackData.length === 0}
                            className='flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg'
                        >
                            <Download size={20} />
                            {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}
                        </button>
                        <Link href='/resources'>
                            <button className='flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg'>
                                <BookOpen size={20} />
                                Study Resources
                            </button>
                        </Link>

                        <button onClick={() => router.replace('/dashboard')} className='flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg'>
                            <LayoutDashboard size={20} />
                            Go Home
                        </button>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default FeedBack;