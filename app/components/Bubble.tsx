import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
        {isUser ? (
          message.content
        ) : (
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ node, ...props }) => <p style={{ margin: '8px 0' }} {...props} />,
              ul: ({ node, ...props }) => <ul style={{ marginLeft: '20px', margin: '10px 0' }} {...props} />,
              ol: ({ node, ...props }) => <ol style={{ marginLeft: '20px', margin: '10px 0' }} {...props} />,
              li: ({ node, ...props }) => <li style={{ margin: '5px 0' }} {...props} />,
              h1: ({ node, ...props }) => <h2 style={{ margin: '15px 0 10px 0', fontWeight: 'bold' }} {...props} />,
              h2: ({ node, ...props }) => <h3 style={{ margin: '15px 0 10px 0', fontWeight: 'bold' }} {...props} />,
              h3: ({ node, ...props }) => <h4 style={{ margin: '12px 0 8px 0', fontWeight: 'bold' }} {...props} />,
              strong: ({ node, ...props }) => <strong style={{ fontWeight: 'bold' }} {...props} />,
              code: (props) => 
                props.inline ? (
                  <code style={{ backgroundColor: '#f0f0f0', padding: '2px 6px', borderRadius: '3px', fontSize: '0.9em' }} {...props} />
                ) : (
                  <code style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px', display: 'block', overflow: 'auto', margin: '8px 0' }} {...props} />
                ),
              blockquote: ({ node, ...props }) => <blockquote style={{ borderLeft: '4px solid #ccc', paddingLeft: '10px', marginLeft: '0', color: '#666' }} {...props} />,
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
};

export default Bubble;