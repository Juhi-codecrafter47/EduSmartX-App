import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, Loader2, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isImage?: boolean;
  imageUrl?: string;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI study assistant. How can I help you with your JEE/NEET preparation today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const newUserMessage: Message = {
      id: String(Date.now()),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/solve_question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify({ question: inputValue }),
      });

      const data = await response.json();

      const newBotMessage: Message = {
        id: String(Date.now() + 1),
        content: data.solution || 'Sorry, I couldn’t find a solution for that.',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, newBotMessage]);
    } catch (error) {
      const errorBotMessage: Message = {
        id: String(Date.now() + 1),
        content: '⚠️ There was an error contacting the server. Please try again later.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newUserMessage: Message = {
      id: String(Date.now()),
      content: `Uploaded image: ${file.name}`,
      sender: 'user',
      isImage: true,
      imageUrl: URL.createObjectURL(file),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('file', file);

      // Send the image to the API
      const response = await fetch('http://127.0.0.1:8000/solve_question_from_image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      // Display the extracted question
      if (data.extracted_text) {
        const extractedTextMessage: Message = {
          id: String(Date.now() + 1),
          content: `📝 Extracted question: ${data.extracted_text}`,
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, extractedTextMessage]);
      }

      // Display the solution
      const newBotMessage: Message = {
        id: String(Date.now() + 2),
        content: data.solution || 'Sorry, I couldn\'t solve this problem.',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, newBotMessage]);
    } catch (error) {
      console.error('Error processing image:', error);
      const errorBotMessage: Message = {
        id: String(Date.now() + 1),
        content: '⚠️ There was an error processing your image. Please try again or type your question instead.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 md:px-8 pt-24 pb-12">
        <div className="flex flex-col h-[calc(100vh-12rem)] border rounded-lg shadow-lg bg-white overflow-hidden">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex items-start space-x-2 max-w-lg">
                  {msg.sender === 'bot' && (
                    <Avatar>
                      <AvatarFallback><Bot className="w-4 h-4" /></AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`p-3 rounded-lg text-sm whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    {msg.isImage ? (
                      <img src={msg.imageUrl} alt="uploaded" className="max-w-[200px] rounded-md" />
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2 p-3 text-sm bg-gray-100 rounded-lg">
                  <Loader2 className="animate-spin w-4 h-4" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Section */}
          <div className="border-t p-4 bg-muted flex items-center space-x-2">
            <Textarea
              className="flex-1 resize-none"
              rows={1}
              placeholder="Ask your JEE/NEET question here..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileUpload}
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              title="Upload Image"
            >
              <Image className="w-4 h-4" />
            </Button>
            <Button onClick={handleSendMessage} disabled={isLoading}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Chatbot;
