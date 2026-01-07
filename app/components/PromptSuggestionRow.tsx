import React from 'react';
import PromptSuggestionButton from './PromptSuggestionButton';

interface PromptSuggestionRowProps {
  onPromptClick: (prompt: string) => void;
}

const PromptSuggestionRow: React.FC<PromptSuggestionRowProps> = ({ onPromptClick }) => {
  const prompts = [
    "What is Upvave?",
    "What services does Upvave offer?",
    "How can Upvave help my business grow?",
    "How to contact with Upvave?",
  ];

  return (
    <div className='prompt-suggestion-row'>
      {prompts.map((prompt, index) => (
        <PromptSuggestionButton
          text={prompt}
          key={index}
          onClick={() => onPromptClick(prompt)}
        />
      ))}
    </div>
  );
};

export default PromptSuggestionRow;