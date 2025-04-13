'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useChatContext } from '@/context/chatContext'
import Link from "next/link"
import { PlusIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid'
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';



export default function Chat() {
  const [message, setMessage] = useState('')
  const [chat, setChat] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { setLatestRequestId } = useChatContext()

  const sendMessage = async () => {
    if (message.trim()) {
      // Add user message to chat
      setChat([...chat, `You: ${message}`])
      
      // Start loading state
      setIsLoading(true)
      
      // Get response from mood API
      try {
        const response = await fetch('http://127.0.0.1:8000/mood', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ feeling: message }),
        })
        
        if (!response.ok) {
          throw new Error('Failed to get response')
        }
        
        const data = await response.json()

        if (data.request_id) {
          setLatestRequestId(data.request_id)
        }
        // Add bot response to chat
        setChat(prev => [...prev, `${data.response}`])
        
        // Set context info if available
      } catch (error) {
        console.error('Error getting response:', error)
        setChat(prev => [...prev, `Bot: Sorry, I couldn't process that right now.`])
      } finally {
        setIsLoading(false)
      }
      
      setMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }
// Add this function above the return statement
const startNewChat = () => {
  setChat([]);
};


  return (
    <div className="flex flex-col">
    <div className="flex justify-between items-start mb-6">
    {/* Welcome Message */}
    <div className="text-left">
      <h2 className="text-3xl font-bold text-blue-400 mb-2">Welcome, I&apos;m here to listen.</h2>
      <p className="text-lg text-gray-700 max-w-xl">
        Feel free to share anything on your mind — this is a safe space.
      </p>
    </div>

    {/* Logout Button */}
<div className="flex space-x-3">
  <button
    onClick={startNewChat}
    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-400 hover:to-blue-300 text-white font-semibold px-5 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
  >
    New Chat
    <PlusIcon className="h-5 w-5 text-white" />
  </button>

  <Link
    href="/signin"
    className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-400 hover:from-red-400 hover:to-red-300 text-white font-semibold px-5 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
  >
    Logout
    <ArrowRightOnRectangleIcon className="h-5 w-5 text-white" />
  </Link>
</div>
  </div>
      {/* Chat Messages Box */}
      <div className="bg-gradient-to-b from-white via-blue-50 to-whiteborder rounded-xl shadow-md p-4 mb-4 overflow-y-auto space-y-4" style={{ height: '500px' }}>
        {chat.map((line, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg break-words ${
              line.startsWith('You:')
                ? 'bg-blue-100 ml-auto max-w-[60%]'
                : 'bg-gray-100 mr-auto max-w-[60%]'
            }`}
          >
            {line}
          </div>
        ))}
  
        {isLoading && <div className="text-center text-gray-500">Thinking...</div>}
      </div>
  
      {/* Input Area */}
      <div className="flex space-x-2 p-4 border-t">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="What's on your mind? I'm here to listen — feel free to share anything."
          disabled={isLoading}
        />
    <Button
      onClick={sendMessage}
      disabled={isLoading}
      className={`flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-all duration-300 ${
        isLoading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {isLoading ? (
        'Sending...'
      ) : (
        <>
          Send
          <PaperAirplaneIcon className="h-5 w-5 text-white transform rotate-300" />
        </>
      )}
    </Button>
      </div>
    </div>
  );
}
