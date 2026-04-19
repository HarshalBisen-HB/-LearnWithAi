"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { aiToolsList } from "./AiToolsList";
import Link from "next/link"; // ✅ Fix this line
import { Skeleton } from "@/components/ui/skeleton";

function History() {
  const [userHistory, setUserHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GetHistory();
  }, []);

  const GetHistory = async () => {
    setLoading(true);
    const result = await axios.get("/api/history");
    console.log(result.data);
    setUserHistory(result.data);
    setLoading(false);
  };

  const GetAgentName = (path: string) => {
    const agent = aiToolsList.find((item) => item.path == path);
    return agent;
  };
  return (
    <div className="p-6 border bg-white rounded-xl shadow-sm">
      <h2 className="font-bold text-2xl text-black">Previous History</h2>
      <p className="text-gray-600 mb-6 text-sm">Review your previous interactions and generated results</p>

      {loading && (
        <div>
          {[1, 2, 3, 4, 5].map((_, index) => (
            <div key={index} className="my-2">
              <Skeleton className="h-[50px] mt-4 w-full rounded-md" />
            </div>
          ))}
        </div>
      )}

      {userHistory?.length == 0 && !loading ? (
        <div className="flex items-center justify-center mt-5 flex-col mt-6">
          <Image src={"/idea.png"} alt="bulb" width={50} height={50} />
          <h2> You do not have any history</h2>
          <Button className="mt-5">Explore AI Tools</Button>
        </div>
      ) : (
        <div>
          {userHistory?.map((history: any, index: number) => (
            <Link
              key={index}
              href={history?.aiAgentType + "/" + history?.recordId}
              className="flex justify-between items-center my-3 border p-3 rounded-lg space-y-5"
            >
              <div className="flex gap-5">
                <Image
                  src={GetAgentName(history?.aiAgentType)?.icon || "/idea.png"}
                  alt={"image"}
                  width={20}
                  height={20}
                />
                <h2>{GetAgentName(history?.aiAgentType)?.name}</h2>
              </div>
              <h2>{history.createdAt}</h2>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;

// "use client";
// import React, { useEffect, useState } from 'react'
// import Image from 'next/image';
// import { Button } from '@/components/ui/button';
// import axios from 'axios';
// import { aiToolsList } from './AiTools';

// function History() {
//     const [userHistory, setUserHistory] = useState<any[]>([]);

//     useEffect(()=>{
//         GetHistory();
//     },[])

//     const GetHistory = async()=>{
//         const result = await axios.get('/api/history');
//         console.log(result.data);
//         // Ensure we're setting an array
//         setUserHistory(Array.isArray(result.data) ? result.data : []);
//     }

//     const GetAgentName = (path : string) =>{
//         const agent = aiToolsList.find(item => item.path == path)
//         return agent
//     }

//     return (
//         <div className='mt-5 p-5 border rounded-xl'>
//             <h2 className='font-bold text-lg'>Previous History</h2>
//             <p className=''>What Your Previously work on, You can find here.</p>

//             {userHistory?.length == 0 ?
//                 <div className='flex items-center justify-center mt-5 flex-col mt-6'>
//                     <Image src={'/idea.png'} alt='bulb' width={50} height={50}/>
//                     <h2> You do not have any history</h2>
//                     <Button className='mt-5'>Explore AI Tools</Button>
//                 </div>
//                 :
//                 <div>
//                     {userHistory?.map((history:any,index:number) =>(
//                         <div key = {index} className='flex gap-5'>
//                             <Image src = {GetAgentName(history?.aiAgentType)?.icon} alt = {'image'}
//                                 width={20}
//                                 height={20}
//                             />
//                             <h2>{GetAgentName(history?.aiAgentType)?.name}</h2>
//                         </div>
//                     ))}
//                 </div>
//             }
//         </div>
//     )
// }

// export default History
