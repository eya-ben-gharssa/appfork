'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Chat() {
  const [message, setMessage] = useState('')
  const [chat, setChat] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

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
        
        // Add bot response to chat
        setChat(prev => [...prev, `Bot: ${data.response}`])
        
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

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4">
        {chat.map((line, index) => (
          <div key={index} className={`p-2 rounded-lg ${line.startsWith('You:') ? 'bg-blue-100 ml-auto max-w-[80%]' : 'bg-gray-100 mr-auto max-w-[80%]'}`}>
            {line}
          </div>
        ))}
        
        {isLoading && <div className="text-center text-gray-500">Thinking...</div>}
        
      </div>
      
      <div className="flex space-x-2 p-4 border-t">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message"
          disabled={isLoading}
        />
        <Button onClick={sendMessage} disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </div>
  )
}
