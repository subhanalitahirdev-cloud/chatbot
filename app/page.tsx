"use client";
import React, { useEffect, useRef, useState } from 'react';
import Lottie from 'lottie-react';
import animationData from '../public/lottie/Bot2.json';
import loaderData from '../public/lottie/Loader.json';
import { IoMdSend } from "react-icons/io";
import Bubble from './components/Bubble';
import PromptSuggestionRow from './components/PromptSuggestionRow';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Home = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialMessages = messages.length > 0;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const append = async (message: Message) => {
    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to send message');
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';
      let messageAdded = false;

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          assistantMessage += chunk;

          if (!messageAdded) {
            setMessages((prev) => [...prev, { role: 'assistant', content: chunk }]);
            messageAdded = true;
          } else {
            setMessages((prev) => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1] = {
                role: 'assistant',
                content: assistantMessage,
              };
              return newMessages;
            });
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, there was an error processing your request.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrompt = (promptText: string) => {
    append({
      content: promptText,
      role: 'user',
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    append({
      content: input,
      role: 'user',
    });
    setInput('');
  };



  return (
    <div className='chatbot-wrapper'>
      <div className='chatbot-container'>
        {/* Header */}
        <div className='chatbot-header'>
          <div className='chatbot-avatar'>
            <Lottie animationData={animationData} loop={true} style={{ width: '100%', height: '100%' }} />
          </div>
          <div className='chatbot-header-text'>
            <h1>UpvaveGPT</h1>
            <p>Your AI Assistant</p>
          </div>
        </div>

        {/* Messages Area */}
        <div className='chatbot-messages'>
          {!hasInitialMessages ? (
            <div className='welcome-section'>
              <div className='welcome-avatar'>
                <Lottie animationData={animationData} loop={true} style={{ width: '150px', height: '150px' }} />
              </div>
              <h2>Welcome to UpvaveGPT</h2>
              <p>You can now get any information related to Upvave on this chatbot.</p>
              <p className='welcome-subtitle'>Try asking one of these:</p>
              <PromptSuggestionRow onPromptClick={handlePrompt} />
            </div>
          ) : (
            <>
              {messages.map((message: Message, index: number) => (
                <Bubble key={`message-${index}`} message={message} />
              ))}
              {isLoading && (
                <div className='chatbot-message bot-message loading-message'>
                  <div className='loader-animation'>
                    <Lottie animationData={loaderData} loop={true} style={{ width: '32px', height: '32px' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className='chatbot-input-section'>
          <form onSubmit={handleSubmit} className='chatbot-form'>
            <input
              type='text'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Type your message...'
              className='chatbot-input'
              disabled={isLoading}
            />
            <button
              type='submit'
              className='chatbot-send-button'
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? (
                <Lottie animationData={loaderData} loop={true} style={{ width: '20px', height: '20px' }} />
              ) : (
                <IoMdSend size={20} />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;