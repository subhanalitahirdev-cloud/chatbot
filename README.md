# UpvaveGPT Chatbot

An AI-powered chatbot built with Next.js and Google's Gemini AI, designed to provide information about Upvave's web development services.

![Chatbot Demo](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js) ![Gemini AI](https://img.shields.io/badge/Gemini-2.5--Flash-blue?logo=google)

## Features

- 🤖 **AI-Powered Responses** - Uses Google Gemini 2.5 Flash for intelligent, contextual answers
- 💬 **Real-time Streaming** - Responses stream in real-time for a smooth UX
- 🎨 **Modern UI** - Beautiful chat interface with Lottie animations
- 💡 **Prompt Suggestions** - Pre-built prompts to help users get started
- 📝 **Markdown Support** - Rich text formatting in AI responses
- 🔄 **Chat History** - Maintains conversation context

## Tech Stack

- **Framework**: Next.js 16.1
- **AI**: Google Gemini AI (`@google/genai`)
- **Styling**: Tailwind CSS 4
- **Animations**: Lottie React
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 20+
- Google AI API Key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your API key:
   ```env
   GOOGLE_API_KEY=your_api_key_here
   ```

4. (Optional) Add company context in `llm.txt` at the project root for customized responses.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the chatbot.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts      # Gemini AI streaming endpoint
│   ├── components/
│   │   ├── Bubble.tsx        # Chat message bubble
│   │   ├── PromptSuggestionRow.tsx
│   │   └── PromptSuggestionButton.tsx
│   └── page.tsx              # Main chat interface
├── public/
│   └── lottie/               # Animation files
└── llm.txt                   # Company context for AI
```

## API Reference

### POST /api/chat

Send messages to the AI chatbot.

**Request Body:**
```json
{
  "messages": [
    { "role": "user", "content": "What is Upvave?" }
  ]
}
```

**Response:** Streamed text response

## License

Private - Upvave
