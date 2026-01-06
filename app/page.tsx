"use client";
import React from 'react'
import Image from 'next/image'
import {useChat} from '@ai-sdk/react';
import Lottie from 'lottie-react';
import animationData from '../public/lottie/Bot2.json'
import { IoMdSend } from "react-icons/io";
// import {Message} from 'ai';
const Home = () => {
  const noMessage = true;
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
  return (
    <div className='w-full h-screen bg-white flex justify-center items-center'>
      <div className='w-[20rem] h-100 bg-black rounded-xl shadow-md p-5 flex flex-col justify-start items-center'>
        {/* <Image
          src="https://sbxxykwqkbzufkjtdtfp.supabase.co/storage/v1/object/public/portfolio-images/Upvave_Logo_Complete-removebg-preview.png"
          alt="Upvave Logo"
          width={100}
          height={100}
          className={noMessage ? '' : 'populated'}
        /> */}
          {noMessage?(<>
          <Lottie animationData={animationData} loop={true} style={{width: '150px',height: '150px'}} />
          <p className='text-center'>You can now get any informaiton related to Upvave on this chat bot.</p>
          <br/>
          {/*<PromptSuggestion /> */}
          </>):(<>
          {/*Show bubble */}
          {/*<loading/> */}
          {/* <input type="text" className='question-box' onChange={handleInputChange} onSubmit={handleSubmit} value={input} placeholder='Write something...' /> */}
          </>)}
          <div className='relative top-10 flex gap-2'>
            <input type="text" placeholder='Write Something...' className='p-2 w-[80%] h-auto outline-0 border-2 border-white rounded-xl' />
            <button className='p-2 bg-white rounded font-4xl cursor-pointer w-10 flex justify-center items-center text-black'><IoMdSend/></button>
          </div>
      </div>
    </div>
  )
}

export default Home