"use client";
import React from 'react'
import Image from 'next/image'
import {useChat} from '@ai-sdk/react';
import Lottie from 'lottie-react';
import animationData from '../public/lottie/Bot2.json'
import loaderData from '../public/lottie/Loader.json'
import { IoMdSend } from "react-icons/io";
// import {Message} from 'ai';
const Home = () => {
  const noMessage = true;
  const [submitting,setSubmitting] = React.useState(false);
  // const {input,append,isLoading,messages,handleInputChange,handleSubmit} = useChat();
  // function handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
  //   setInput(event.target.value);
  // }
  // function handleSubmit(event: React.FormEvent<HTMLInputElement>): void {
  //   event.preventDefault();
  //   if (input.trim() === '') return;
  //   // Here you would typically send the input to the chat API or update state
  //   // For now, just clear the input
  //   setInput('');
  // }
  const recommedations = [
    "What is Upvave?",
    "What services does Upvave offer?",
    "How can Upvave help my business grow?",
    "Tell me about Upvave's web development process.",
  ]
  return (
    <div className='w-full h-screen bg-white flex justify-center items-center'>
      <div className='w-[25rem] h-100 bg-black rounded-xl shadow-md p-5 flex flex-col justify-start items-center'>
          <div className='h-[80%] w-full flex justify-center flex-col overflow-hidden'>
            {noMessage?(<>
            <div className='w-full flex justify-center'>
              <Lottie animationData={animationData} loop={true} style={{width: '150px',height: '150px'}} />
            </div>
            <p className='text-center font-[10px]'>You can now get any information related to Upvave on this chatbot.</p>
            <div className='w-full m-2 h-auto flex flex-wrap'>
              {recommedations.map((item, index) => (
                <div key={index} className='text-[0.80rem] p-2 bg-white text-black rounded-xl m-1 cursor-pointer hover:bg-gray-200'>
                  {item}
                </div>
              ))}
            </div>
            <br/>
            {/*<PromptSuggestion /> */}
            </>):(<>
            {/*Show bubble */}
            {/*<loading/> */}
            {/* <input type="text" className='question-box' onChange={handleInputChange} onSubmit={handleSubmit} value={input} placeholder='Write something...' /> */}
            </>)}
          </div>
          <div className='w-full flex gap-2'>
            <input type="text" placeholder='Write Something...' className='p-2 w-[80%] h-auto outline-0 border-2 border-white rounded-xl' />
            <button onClick={()=>{
              setSubmitting((prev)=>!prev);
            }} className='p-2 bg-white rounded font-4xl cursor-pointer w-10 flex justify-center items-center text-black' >{submitting?<Lottie animationData={loaderData} loop={true}/>:<IoMdSend/>}</button>
          </div>
      </div>
    </div>
  )
}

export default Home