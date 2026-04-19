"use client"
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import RoadmapCanvas from '../_components/RoadmapCanvas';
import RoadmapGeneratorDialog from '@/app/(routes)/dashboard/_components/RoadmapGeneratorDialog';
// TODO: Ensure the file exists at the correct path, e.g., './_components/RoadmapCanvas'
// If the component file is named 'RoadmapCanvas.tsx' inside a '_components' folder, use:


function RoadmapGeneratorAgent(){
    const {roadmapId} = useParams();
    const[roadmapDetail,setRoadMapDetail] = useState<any>();
    const[openRoadmapDialog,setOpenRoadmapDialog] = useState(false);

    useEffect(()=>{
        roadmapId && GetRoadmapDetails();
    },[roadmapId])

    const GetRoadmapDetails =async() =>{
        const result = await axios.get('/api/history?recordId=' + roadmapId)
        console.log(result.data)
        setRoadMapDetail(result.data?.content)
    }
    return (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-5 '>
            <div className='border rounded-xl p-5'>
                <h2 className='font-bold text-2xl'>{roadmapDetail?.roadmapTitle}</h2>
                <p className='mt-3 text-gray-500'><strong>Description</strong>:<br></br> {roadmapDetail?.description}</p>
                <h2 className='mt-5 font-medium text-blue-600'>Duration : {roadmapDetail?.duration} </h2>

                <Button onClick = {()=>setOpenRoadmapDialog(true)}className='mt-5 w-full'> + Create Another Roadmap</Button>
            </div>
            <div className='md:col-span-2 w-full h-[80vh]'>
                <RoadmapCanvas initialNodes={roadmapDetail?.initialNodes} initialEdges={roadmapDetail?.initialEdges} />
            </div>
            <RoadmapGeneratorDialog 
                openDialog = {openRoadmapDialog}
                setOpenDialog = {()=>setOpenRoadmapDialog(false)}
                />
        </div>
    )
}

export default RoadmapGeneratorAgent