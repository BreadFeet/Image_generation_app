"use client";

import { useChat } from "ai/react";
import { useState, useEffect } from "react";

export default function Chat() {
  const { messages, append, isLoading } = useChat();

  const [ imageIsLoading, setImageIsLoading ] = useState(false);
  const [ image, setImage ] = useState<string | null>(null);

  const [ state, setState ] = useState({
    theme: "",
  });

  const [ size, setSize ] = useState<string | null>(null);
  const [ number, setNumber ] = useState(0);

  const themes = [
    { emoji: "💻", value: "Work" },
    { emoji: "✈️", value: "Holiday" },
    { emoji: "😄", value: "Hobby" },
    { emoji: "🍴", value: "Food" },
    { emoji: "⚽️", value: "Sports" },
  ];

  const sizes = [
    { value: "256x256" },
    { value: "512x512" },
    { value: "1024x1024" },
  ];

  const handleThemeChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [name]: value,
    });
  };

  const handleSizeChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setSize(value);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = event.target.value;
    setNumber(Number(num));
  };

  useEffect(() => {
    if (isLoading) {
      setImage(null);
    }
  }, [messages]);

  if (size &&  number & isLoading) {
    setSize(null);
    setNumber(0);
  };

  return(
    <main className="mx-auto w-full p-24 flex flex-col">
     <div className="p4 m-4">
       <div className="flex flex-col items-center justify-center space-y-8 text-white">
         <div className="space-y-2">
           <h2 className="text-3x1 font-bold"> Image Generation App </h2>
           <p className="text-zinc-500 dark:text-zinc-400">
             Choose theme to generate a prompt for image.
           </p>
         </div>

         {/* Theme radio button code */}
         <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
           <h3 className="text-x1 font-semibold"> Theme </h3>
           <div className="flex flex-wrap justify-center">
             {themes.map(({ value, emoji }) => (
               <div
                 key={value}
                 className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
               >
                 <input
                   id={value}
                   type="radio"
                   value={value}
                   name="theme"
                   onChange={handleThemeChange}
                 />
                 <label className="ml-2" htmlFor={value}>
                   {`${emoji} ${value}`}
                 </label>
               </div>
             ))}
           </div>
         </div>

         {/* Generate prompt button */}
         <button
           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disable:opacity-50"
           disabled={!state.theme || isLoading}
           onClick={() =>
             // Send a new message to the AI provider
             append({
               role: "user",
               content: `Generate a prompt describing a picture related to ${state.theme}.`,
             })
           }
         >
           Generate a prompt
         </button>

         {/* Generated text display */}
         <div
           hidden={
             // Message: Entire chat with AI provider
             messages.length === 0 ||
             messages[messages.length - 1]?.content.startsWith("Generate")
           }
           className="bg-opacity-25 bg-gray-700 rounded-lg p-4"
         >
           {messages[messages.length - 1]?.content}
         </div>

         {/* Image Options */}
         {!isLoading && messages.length >= 2 && (
           <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
             <h3 className="text-x1 font-semibold"> Image Options </h3>
             <p> Size </p>
             <div className="flex flex-wrap justify-center">
               {sizes.map(({value}) => (
                 <div
                   key={value}
                   className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
                 >
                   <input
                     id={value}
                     type="radio"
                     name="size"
                     value={value}
                     onChange={handleSizeChange}
                   />
                   <label className="ml-2" htmlFor={value}>
                     {`${value}`}
                   </label>
                 </div>
               ))}
             </div>
             <div className="slidecontainer">
               <p>Number: <span id="demo">{`${number}`}</span></p>
               <input
                 className="slider"
                 type="range"
                 id="myRange"
                 min="0"
                 max="10"
                 value={number}
                 onInput={handleNumberChange}
               />
             </div>
           </div>
         )}

         {/* Generate image button */}
         <button
           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disable:opacity-50"
           hidden={!size || number == 0}
           onClick={async () => {
             setImageIsLoading(true);
             const response = await fetch("api/images", {
               method: "POST",
               headers: {
                 "Content-Type": "application/json",
               },
               body: JSON.stringify({
                 size: size,
                 number: number,
                 message: messages[messages.length - 1].content,
               }),
             });
             const data = await response.json();
             setImage(data);
             setImageIsLoading(false);
           }}
         >
           Generate an image
         </button>
         ;

         { imageIsLoading && (
           <div className="flex justify-end pr-4">
             <span className="animate-bounce text-black">Loading image ⏩⏩⏩ </span>
           </div>
         )}

         {image && (
           <div className="card w-full h-screen max-w-md py-0 mx-auto stretch">
             {image.map((img, idx) => (
               <div className="image-center">
                 <img
                   className="p-4"
                   key={idx}
                   src={`data: image/jpeg; base64, ${img}`}
                 />
               </div>
             ))}
           </div>
         )}

       </div>
     </div>
    </main>
  );
}