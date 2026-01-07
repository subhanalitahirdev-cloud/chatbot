import React from 'react';

interface BubbleProps {
  message: {
    role: 'user' | 'assistant';
    content: string;
  };
}

const Bubble: React.FC<BubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`chatbot-message ${isUser ? 'user-message' : 'bot-message'}`}>
      <div className='message-content'>
        {message.content}
      </div>
    </div>
  );
};

export default Bubble;