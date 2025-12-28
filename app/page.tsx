'use client'

import { useState, useRef, useEffect } from 'react'
import { format } from 'date-fns'

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
  status?: 'sending' | 'sent' | 'delivered' | 'read'
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! 👋 Welcome to our business. How can I assist you today?',
      sender: 'ai',
      timestamp: new Date(),
      status: 'read'
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [businessName, setBusinessName] = useState('My Business AI')
  const [showSettings, setShowSettings] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    const lowerMsg = userMessage.toLowerCase()

    // Business-related responses
    if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('how much')) {
      return "Our pricing varies depending on your needs. We offer:\n\n• Basic Plan: $29/month\n• Professional: $79/month\n• Enterprise: Custom pricing\n\nWould you like more details about any specific plan?"
    }

    if (lowerMsg.includes('hours') || lowerMsg.includes('open') || lowerMsg.includes('when')) {
      return "We're open:\n\n📅 Monday - Friday: 9:00 AM - 6:00 PM\n📅 Saturday: 10:00 AM - 4:00 PM\n📅 Sunday: Closed\n\nHow else can I help you?"
    }

    if (lowerMsg.includes('location') || lowerMsg.includes('address') || lowerMsg.includes('where')) {
      return "We're located at:\n\n📍 123 Business Street\nCity, State 12345\n\nYou can also reach us via:\n📞 Phone: (555) 123-4567\n📧 Email: contact@mybusiness.com"
    }

    if (lowerMsg.includes('appointment') || lowerMsg.includes('book') || lowerMsg.includes('schedule')) {
      return "I'd be happy to help you schedule an appointment! 📅\n\nPlease let me know:\n1. Your preferred date\n2. Preferred time\n3. Type of service needed\n\nOr visit our booking page for instant scheduling."
    }

    if (lowerMsg.includes('product') || lowerMsg.includes('service')) {
      return "We offer a wide range of products and services:\n\n✅ Product A - Premium quality\n✅ Product B - Best seller\n✅ Product C - New arrival\n✅ Custom solutions\n\nWhat are you interested in learning more about?"
    }

    if (lowerMsg.includes('support') || lowerMsg.includes('help') || lowerMsg.includes('problem')) {
      return "I'm here to help! 🤝\n\nFor technical support:\n• Email: support@mybusiness.com\n• Phone: (555) 123-4567\n• Live chat: Available on our website\n\nCould you tell me more about what you need assistance with?"
    }

    if (lowerMsg.includes('thank') || lowerMsg.includes('thanks')) {
      return "You're very welcome! 😊 Is there anything else I can help you with today?"
    }

    if (lowerMsg.includes('bye') || lowerMsg.includes('goodbye')) {
      return "Thank you for contacting us! Have a wonderful day! 👋\n\nFeel free to reach out anytime you need assistance."
    }

    // Default helpful response
    return "Thank you for your message! I'm your AI business assistant. I can help you with:\n\n• Pricing & Plans 💰\n• Business Hours ⏰\n• Location & Contact 📍\n• Appointments 📅\n• Products & Services 🛍️\n• Support 🤝\n\nWhat would you like to know more about?"
  }

  const handleSend = async () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent'
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    try {
      const aiResponse = await generateAIResponse(inputText)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        status: 'read'
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error generating response:', error)
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickReplies = [
    '💰 Pricing',
    '⏰ Business Hours',
    '📍 Location',
    '📅 Book Appointment'
  ]

  return (
    <div className="flex flex-col h-screen bg-[#ECE5DD]">
      {/* Header */}
      <div className="bg-[#075E54] text-white p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-2xl">
            🤖
          </div>
          <div>
            <h1 className="font-semibold text-lg">{businessName}</h1>
            <p className="text-xs text-gray-200">
              {isTyping ? 'typing...' : 'AI Assistant • Online'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-white hover:bg-[#064741] p-2 rounded-full transition"
        >
          ⚙️
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white border-b p-4 shadow">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Name:
          </label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25D366]"
            placeholder="Enter your business name"
          />
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] rounded-lg p-3 shadow ${
                message.sender === 'user'
                  ? 'bg-[#DCF8C6] text-gray-800'
                  : 'bg-white text-gray-800'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
              <div className="flex items-center justify-end space-x-1 mt-1">
                <span className="text-[10px] text-gray-500">
                  {format(message.timestamp, 'HH:mm')}
                </span>
                {message.sender === 'user' && (
                  <span className="text-xs text-gray-500">
                    {message.status === 'read' ? '✓✓' : '✓'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white rounded-lg p-3 shadow">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <div className="px-4 py-2 bg-white border-t overflow-x-auto">
        <div className="flex space-x-2">
          {quickReplies.map((reply, index) => (
            <button
              key={index}
              onClick={() => {
                setInputText(reply)
                setTimeout(handleSend, 100)
              }}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm whitespace-nowrap transition"
            >
              {reply}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t">
        <div className="flex items-end space-x-2">
          <div className="flex-1 bg-white border border-gray-300 rounded-full px-4 py-2 focus-within:border-[#25D366]">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full outline-none text-sm"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition ${
              inputText.trim()
                ? 'bg-[#25D366] hover:bg-[#128C7E]'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
