import React from 'react';

interface BubbleProps {
  message: {
    role: 'user' | 'assistant';
    content: string;
  };
}

const Bubble: React.FC<BubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  // Function to parse markdown and return React elements
  const parseMarkdown = (text: string) => {
    const parts: React.ReactNode[] = [];
    const lines = text.split('\n');
    
    let listItems: string[] = [];
    let inList = false;
    
    lines.forEach((line, lineIdx) => {
      const trimmedLine = line.trim();
      
      // Handle bullet points and numbered lists
      if (trimmedLine.startsWith('•') || /^\d+\.\s/.test(trimmedLine)) {
        if (!inList) {
          inList = true;
          listItems = [];
        }
        listItems.push(trimmedLine.replace(/^[•\d+\.\s]+/, '').trim());
        return;
      }
      
      // End list if we hit a non-list line
      if (inList && trimmedLine && !trimmedLine.startsWith('•') && !/^\d+\.\s/.test(trimmedLine)) {
        parts.push(
          <ul key={`list-${lineIdx}`} style={{ marginLeft: '20px', margin: '10px 0' }}>
            {listItems.map((item, idx) => (
              <li key={idx}>{parseInlinMarkdown(item)}</li>
            ))}
          </ul>
        );
        inList = false;
        listItems = [];
      }
      
      // Headers
      if (trimmedLine.startsWith('#')) {
        const headerText = trimmedLine.replace(/#/g, '').trim();
        parts.push(
          <h3 key={lineIdx} style={{ margin: '15px 0 5px 0', fontWeight: 'bold' }}>
            {parseInlinMarkdown(headerText)}
          </h3>
        );
        return;
      }
      
      // Regular paragraphs
      if (trimmedLine) {
        parts.push(
          <p key={lineIdx} style={{ margin: '8px 0' }}>
            {parseInlinMarkdown(trimmedLine)}
          </p>
        );
      } else if (parts.length > 0) {
        parts.push(<div key={lineIdx} style={{ height: '5px' }} />);
      }
    });
    
    // Handle remaining list items
    if (inList && listItems.length > 0) {
      parts.push(
        <ul key="final-list" style={{ marginLeft: '20px', margin: '10px 0' }}>
          {listItems.map((item, idx) => (
            <li key={idx}>{parseInlinMarkdown(item)}</li>
          ))}
        </ul>
      );
    }
    
    return parts;
  };
  
  // Parse inline markdown like bold text
  const parseInlinMarkdown = (text: string) => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    const boldRegex = /\*\*(.*?)\*\*/g;
    let match;
    
    while ((match = boldRegex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      // Add bold text
      parts.push(
        <strong key={`bold-${match.index}`}>{match[1]}</strong>
      );
      lastIndex = boldRegex.lastIndex;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    return parts.length > 0 ? parts : text;
  };
  
  return (
    <div className={`chatbot-message ${isUser ? 'user-message' : 'bot-message'}`}>
      <div className='message-content'>
        {isUser ? message.content : parseMarkdown(message.content)}
      </div>
    </div>
  );
};

export default Bubble;