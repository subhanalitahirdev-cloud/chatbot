import React from 'react'
import Image from 'next/image'
import {useChat} from '@ai-sdk/react';
import {Message} from 'ai';
const Home = () => {
  const noMessage = true;
  const {input,append,isLoading,messages,handleInputChange,handleSubmit} = useChat();
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
    <div className='chatbot-section'>
      <Image
        src="https://sbxxykwqkbzufkjtdtfp.supabase.co/storage/v1/object/public/portfolio-images/Upvave_Logo_Complete-removebg-preview.png"
        alt="Upvave Logo"
        width={200}
        height={200}
        className={noMessage ? '' : 'populated'}
      />
      <section>
        {noMessage?(<>
        <p className='starter-text'>At Upvave, we are on a mission to Master the Web Solutions. As a dynamic startup based in Lahore, we specialize in providing cutting-edge web solutions that help businesses and individuals thrive in the digital world. While our team has traditionally operated remotely, we are now transitioning to on-site operations, fostering a collaborative environment that drives innovation</p>
        <br/>
        {/*<PromptSuggestion /> */}
        </>):(<>
        {/*Show bubble */}
        {/*<loading/> */}
        <input type="text" className='question-box' onChange={handleInputChange} onSubmit={handleSubmit} value={input} placeholder='Write something...' />
        </>)}

      </section>
    </div>
  )
}

export default Home