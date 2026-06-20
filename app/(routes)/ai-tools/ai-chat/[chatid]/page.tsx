// "use client"
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { LoaderCircle, Send } from 'lucide-react'
// import React, { useEffect, useState } from 'react'
// import EmptyState from './_components/EmptyState'
// import axios from 'axios'

// type messages={
//     content: string;
//     role: string;
//     type: string;
// }

// function AiChat(){
//     const [userInput, setUserInput] = useState<string>();
//     const [loading, setLoading] = useState(false);
//     const[messageList, setMessageList] = useState<messages[]>([{
//         content : 'User Msg',
//         role : 'user',
//         type : 'text'
//         },
//     {
//         content : 'AI Msg',
//         role : 'assistant',
//         type : 'text'
//     }]);

//     const onSend = async () => {
//         setLoading(true);
//         setMessageList(prev=>[...prev,{
//             content : userInput ?? "",
//             role : 'user',
//             type : 'text'
//         }])

//         // const result = await axios.post('/api/ai-career-chat-agent', {
//         //     userInput: userInput,
//         // });
//         // // change kra h 1 : 31 : 02
//         // console.log(result.data);
//         // setMessageList(prev=>[...prev,result.data])
//         // setLoading(false);
//         try {
//             const result = await axios.post('/api/ai-career-chat-agent', {
//                 userInput: userInput,
//             });
//         console.log("result.data", result.data);
//         setMessageList(prev => [...prev, result.data]);
//         } catch (error) {
//         console.error("API call failed", error);
//         }
//         setLoading(false);

//     }

//     console.log("messageList", messageList);

//     useEffect(() => {
//         // save messages into database
//     },[messageList])

//     return (
//         <div className='px-10 md:px-24 lg:px-36 xl:px-48'>
//             <div className='flex items-center justify-between gap-8'>
//                 <div>
//                     <h2 className='font-bold text-lg'>AI Career QA Chat</h2>
//                     <p>Smarter career decisions start here — get tailored advice, real-time market insights </p>
//                 </div>
//                 <Button>+ New Chat</Button>
//             </div>

//             <div className='flex flex-col h-[75vh]'>
//                 {messageList?.length<=0 && <div className='mt-5'>
//                     {/* {Empty state options} */}
//                     <EmptyState selectedQuestion = {(question:string)=>setUserInput(question)}/>
//                 </div>}
//                 <div className='flex-1'>
//                     {messageList?.map((message, index) => (
//                         <div>
//                         <div key = {index} className={`flex mb-2 ${message.role == 'user' ? 'justify-end' : 'justify-start'}`} >
//                             <div className={`p-3 rounded-lg gap-2 ${message.role =='user'?
//                             'bg-gray-200 text-black rounded-lg':"bg-gray-50 text-black"}`}>
//                                 {message.content}
//                             </div>
//                         </div>
//                             {loading && messageList.length-1 == index && <div className='flex justify-start p-3 rounded-lg gap-2 bg-gray-200 text-black mb-2'>
//                                 <LoaderCircle className='animate-spin'/>
//                             </div>}
//                         </div>
//                     ))}
//                 </div>

//                 <div className='flex justify-between items-center gap-6'>
//                     {/* {Message input} */}
//                     <Input placeholder='Type Here' value = {userInput}
//                     onChange = {(event) => setUserInput(event.target.value)}/>
//                     <Button onClick={onSend} disabled={loading}><Send /> </Button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default AiChat

"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle, Send } from "lucide-react";
import React, { useEffect, useState } from "react";
import EmptyState from "../_components/EmptyState";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid"; // Importing uuid for unique IDs
import { useRouter } from "next/navigation";

type messages = {
  content: string;
  role: string;
  type: string;
};

function AiChat() {
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [messageList, setMessageList] = useState<messages[]>([]);
  const { chatid }: any = useParams();
  const router = useRouter();
  console.log(chatid);

  useEffect(() => {
    // Fetch initial messages from the server
    chatid && GetMessageList();
  }, [chatid]);

  const GetMessageList = async () => {
    const result = await axios.get("/api/history?recordId=" + chatid);
    console.log(result.data);
    setMessageList(result?.data?.content);
  };

  const onSend = async () => {
    if (!userInput.trim()) return;

    setLoading(true);

    // Add user message immediately
    const userMessage = {
      content: userInput,
      role: "user",
      type: "text",
    };

    setMessageList((prev) => [...prev, userMessage]);
    const currentInput = userInput;
    setUserInput(""); // Clear input immediately

    try {
      const result = await axios.post("/api/ai-career-chat-agent", {
        userInput: currentInput,
      });

      console.log("API Response:", result.data);

      // Handle different response formats
      let aiResponse;
      if (result.data.error) {
        aiResponse = {
          content: `Error: ${result.data.error}`,
          role: "assistant",
          type: "text",
        };
      } else if (result.data.content) {
        // Response is already formatted
        aiResponse = result.data;
      } else {
        // Response might be raw text
        aiResponse = {
          content:
            typeof result.data === "string"
              ? result.data
              : JSON.stringify(result.data),
          role: "assistant",
          type: "text",
        };
      }

      setMessageList((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error sending message:", error);

      const errorMessage = {
        content:
          "Sorry, there was an error processing your request. Please try again.",
        role: "assistant",
        type: "text",
      };

      setMessageList((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      onSend();
    }
  };

  console.log("messageList", messageList);

  useEffect(() => {
    // save messages into database
    messageList.length > 0 && updateMessageList();
  }, [messageList]);

  const updateMessageList = async () => {
    const result = await axios.put("/api/history", {
      content: messageList,
      recordId: chatid,
    });
    console.log(result);
  };

  const onNewChat = async () => {
    const id = uuidv4(); // Generate a unique ID for the new chat session
    // create a new history entry for the user
    const result = await axios.post("/api/history", {
      recordId: id,
      content: [],
    });
    console.log(result);
    router.replace("/ai-tools/ai-chat/" + id); // Navigate to the tool's path with the unique ID
  };

  return (
    <div className="px-10 md:px-24 lg:px-36 xl:px-48 h-[75vh] overflow-auto">
      <div
        className="flex items-center justify-between gap-8 rounded-lg p-4"
        style={{
          background:
            "linear-gradient(0deg, rgba(251, 193, 162, 1) 0%, rgba(148, 187, 233, 1) 100%)",
        }}
      >
        <div>
          <h2 className="font-bold text-lg">AI Career QA Chat</h2>
          <p>
            Smarter career decisions start here — get tailored advice, real-time
            market insights{" "}
          </p>
        </div>
        <Button onClick={onNewChat}>+ New Chat</Button>
      </div>

      <div className="flex flex-col h-[75vh]">
        {messageList?.length <= 0 && (
          <div className="mt-5">
            <EmptyState
              selectedQuestion={(question: string) => setUserInput(question)}
            />
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {messageList?.map((message, index) => (
            <div key={index}>
              <div
                className={`flex mb-2 ${message.role == "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`p-3 rounded-lg max-w-[80%] ${
                    message.role == "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-black"
                  }`}
                >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start mb-2">
              <div className="p-3 rounded-lg bg-gray-100 text-black flex items-center gap-2">
                <LoaderCircle className="animate-spin w-4 h-4" />
                <span>Thinking...</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center gap-6 absolute bottom-5 w-[50%]">
          <Input
            className="bg-[#dae1ff]"
            placeholder="Type Here"
            value={userInput}
            onChange={(event) => setUserInput(event.target.value)}
            onKeyUp={handleKeyPress}
            disabled={loading}
          />
          <Button
            className="bg-blue-700 text-white"
            onClick={onSend}
            disabled={loading || !userInput.trim()}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AiChat;
