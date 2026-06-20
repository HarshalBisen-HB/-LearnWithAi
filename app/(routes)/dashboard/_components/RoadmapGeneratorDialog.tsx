// import React, { useState } from 'react'

// import { Input } from '@/components/ui/input'
// import { Button } from '@/components/ui/button'
// import { Loader2Icon, SparkleIcon } from 'lucide-react'
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } 
// from "@/components/ui/dialog"
// import axios from 'axios'
// import { v4 } from 'uuid'
// import { useRouter } from 'next/navigation'


// function RoadmapGeneratorDialog({openDialog,setOpenDialog} : any){
//     const[userInput,setUserInput] = useState<string>();
//     const[loading,setLoading] = useState(false);
//     const router = useRouter();

//     const GenerateRoadmap = async()=>{
//         const roadmapId =  v4();
//         setLoading(true);
//         try{
//             const result = await axios.post('/api/ai-roadmap-agent',{
//                 roadmapId : roadmapId,
//                 userInput : userInput
//             });
//             console.log(result.data);
//             setOpenDialog(false);
//             router.push(`/ai-tools/ai-roadmap-agent/${roadmapId}`);
//             //router.push('/ai-tools/ai-roadmap-agent/'+roadmapId)
            
//         }catch(e){
//             console.log(e);
//         }finally{
//             setLoading(false);
//         }
//     }
    
    
//     return (
//         <Dialog open = {openDialog} onOpenChange={setOpenDialog}>
//         {/* <DialogTrigger>Open</DialogTrigger> */}
//         <DialogContent>
//             <DialogHeader>
//             <DialogTitle>Enter Position/Skills to Generate RoadMap</DialogTitle>
//             <DialogDescription asChild>
//                 <div className='mt-5'>
//                     <Input placeholder = 'e.g. Full Stack Developer' 
//                     onChange={(event)=>setUserInput(event?.target.value)}/>
//                 </div>
//             </DialogDescription>
//             </DialogHeader>
//             <DialogFooter>
//                 <Button variant={'outline'}>Cancel</Button>
//                 <Button onClick={GenerateRoadmap}
//                     disabled = {loading || !userInput}
//                 >{loading?<Loader2Icon className='animate-spin' />: <SparkleIcon />} Generate</Button>
//             </DialogFooter>
//         </DialogContent>
//         </Dialog>
//     )
// }

// export default RoadmapGeneratorDialog


import React, { useState } from 'react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2Icon, SparkleIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} 
from "@/components/ui/dialog"
import axios from 'axios'
import { v4 } from 'uuid'
import { useRouter } from 'next/navigation'

interface RoadmapGeneratorDialogProps {
    openDialog: boolean;
    setOpenDialog: (open: boolean) => void;
}

function RoadmapGeneratorDialog({ openDialog, setOpenDialog }: RoadmapGeneratorDialogProps) {
    const [userInput, setUserInput] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const GenerateRoadmap = async () => {
        if (!userInput?.trim()) {
            console.log('User input is required');
            return;
        }

        const roadmapId = v4();
        setLoading(true);
        
        try {
            console.log('Generating roadmap with ID:', roadmapId);
            
            const result = await axios.post('/api/ai-roadmap-agent', {
                roadmapId: roadmapId,
                userInput: userInput.trim()
            });
            
            console.log('API Response:', result.data);
            
            // Close dialog first
            setOpenDialog(false);
            
            // Clear input
            setUserInput('');
            
            // Add a small delay before navigation to ensure dialog closes
            setTimeout(() => {
                const targetUrl = `/ai-tools/ai-roadmap-agent/${roadmapId}`;
                console.log('Navigating to:', targetUrl);
                router.push(targetUrl);
            }, 100);
            
        } catch (error) {
            console.error('Error generating roadmap:', error);
            
            // Show error to user (you might want to add a toast notification here)
            if (axios.isAxiosError(error)) {
                console.error('API Error:', error.response?.data);
            }
        } finally {
            setLoading(false);
        }
    }

    const handleCancel = () => {
        setOpenDialog(false);
        setUserInput(''); // Clear input on cancel
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(event.target.value);
    }

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Enter Position/Skills to Generate RoadMap</DialogTitle>
                    <DialogDescription asChild>
                        <div className='mt-5'>
                            <Input 
                                placeholder='e.g. Full Stack Developer' 
                                value={userInput}
                                onChange={handleInputChange}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !loading && userInput?.trim()) {
                                        GenerateRoadmap();
                                    }
                                }}
                            />
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button 
                        variant={'outline'} 
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={GenerateRoadmap}
                        disabled={loading || !userInput?.trim()}
                    >
                        {loading ? (
                            <>
                                <Loader2Icon className='animate-spin mr-2' />
                                Generating...
                            </>
                        ) : (
                            <>
                                <SparkleIcon className='mr-2' />
                                Generate
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default RoadmapGeneratorDialog