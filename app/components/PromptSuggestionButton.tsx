import React from 'react';

interface PromptSuggestionButtonProps {
  onClick: () => void;
  text: string;
}

const PromptSuggestionButton: React.FC<PromptSuggestionButtonProps> = ({ onClick, text }) => {
  return (
    <button className='prompt-suggestion-button' onClick={onClick}>
      {text}
    </button>
  );
};

export default PromptSuggestionButton;