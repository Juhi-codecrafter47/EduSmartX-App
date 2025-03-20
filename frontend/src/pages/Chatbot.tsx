
import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, Loader2, Bot, User, ThumbsUp, ThumbsDown, Copy, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
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

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const newUserMessage: Message = {
      id: String(Date.now()),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, newUserMessage]);
    setInputValue('');

    simulateBotResponse(inputValue);
  };

  const simulateBotResponse = (userInput: string) => {
    setIsLoading(true);

    setTimeout(() => {
      let botResponse = '';

      if (userInput.toLowerCase().includes('newton') || userInput.toLowerCase().includes('law of motion')) {
        botResponse = `
          <h3>Newton's Laws of Motion</h3>
          
          <p>Newton's three laws of motion can be summarized as:</p>
          
          <ol>
            <li><strong>First Law (Law of Inertia):</strong> An object at rest stays at rest, and an object in motion stays in motion with the same speed and direction unless acted upon by an unbalanced force.</li>
            <li><strong>Second Law:</strong> The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass. F = ma</li>
            <li><strong>Third Law:</strong> For every action, there is an equal and opposite reaction.</li>
          </ol>
          
          <p>These laws form the foundation of classical mechanics and are crucial for solving problems in both JEE and NEET physics sections.</p>
          
          <p>Would you like me to provide some example problems applying these laws?</p>
        `;
      } else if (userInput.toLowerCase().includes('acid') && userInput.toLowerCase().includes('base')) {
        botResponse = `
          <h3>Acid-Base Concepts</h3>
          
          <p>There are three main theories that define acids and bases:</p>
          
          <ul>
            <li><strong>Arrhenius Theory:</strong> Acids produce H+ ions in water, bases produce OH- ions in water.</li>
            <li><strong>Brønsted-Lowry Theory:</strong> Acids are proton (H+) donors, bases are proton acceptors.</li>
            <li><strong>Lewis Theory:</strong> Acids are electron pair acceptors, bases are electron pair donors.</li>
          </ul>
          
          <p>pH is a measure of acidity or alkalinity, ranging from 0-14:</p>
          <ul>
            <li>pH < 7: Acidic</li>
            <li>pH = 7: Neutral</li>
            <li>pH > 7: Basic/Alkaline</li>
          </ul>
          
          <p>Remember, pH = -log[H+]</p>
        `;
      } else if (userInput.toLowerCase().includes('calculus') || userInput.toLowerCase().includes('derivative') || userInput.toLowerCase().includes('integration')) {
        botResponse = `
          <h3>Calculus Basics</h3>
          
          <p>Calculus has two main branches:</p>
          
          <ul>
            <li><strong>Differential Calculus:</strong> Involves finding rates of change (derivatives)</li>
            <li><strong>Integral Calculus:</strong> Involves finding areas under curves (integrals)</li>
          </ul>
          
          <p>Key formulas to remember:</p>
          
          <p><strong>Basic Derivatives:</strong></p>
          <ul>
            <li>d/dx(xⁿ) = n·xⁿ⁻¹</li>
            <li>d/dx(sin x) = cos x</li>
            <li>d/dx(cos x) = -sin x</li>
            <li>d/dx(eˣ) = eˣ</li>
            <li>d/dx(ln x) = 1/x</li>
          </ul>
          
          <p><strong>Basic Integrals:</strong></p>
          <ul>
            <li>∫xⁿ dx = xⁿ⁺¹/(n+1) + C (for n ≠ -1)</li>
            <li>∫sin x dx = -cos x + C</li>
            <li>∫cos x dx = sin x + C</li>
            <li>∫eˣ dx = eˣ + C</li>
            <li>∫(1/x) dx = ln|x| + C</li>
          </ul>
        `;
      } else if (userInput.toLowerCase().includes('photosynth') || userInput.toLowerCase().includes('plant')) {
        botResponse = `
          <h3>Photosynthesis</h3>
          
          <p>Photosynthesis is the process by which green plants, algae, and some bacteria convert light energy into chemical energy:</p>
          
          <p>6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂</p>
          
          <p>The process occurs in two main stages:</p>
          
          <ol>
            <li><strong>Light-dependent reactions:</strong> Occur in the thylakoid membrane and convert light energy into ATP and NADPH. Water is split, releasing oxygen.</li>
            <li><strong>Calvin cycle (Light-independent reactions):</strong> Uses ATP and NADPH from the light reactions to convert CO₂ into glucose. Takes place in the stroma.</li>
          </ol>
          
          <p>Chlorophyll a and b are the primary photosynthetic pigments that absorb light energy, predominantly blue and red wavelengths.</p>
        `;
      } else {
        botResponse = "I'm here to help with your JEE/NEET preparation. You can ask me questions about Physics, Chemistry, Mathematics, or Biology concepts. You can also upload images of problems you're struggling with, and I'll help you solve them. What subject or topic would you like to explore?";
      }

      const newBotMessage: Message = {
        id: String(Date.now() + 1),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prevMessages => [...prevMessages, newBotMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setMessages([...messages, newUserMessage]);

    setTimeout(() => {
      const newBotMessage: Message = {
        id: String(Date.now() + 1),
        content: "I've analyzed your uploaded image. It appears to contain a problem related to kinematics. Would you like me to explain how to approach this type of problem?",
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prevMessages => [...prevMessages, newBotMessage]);
    }, 2000);
  };

  const formatMessageContent = (content: string) => {
    return (
      <div dangerouslySetInnerHTML={{ __html: content }}></div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 pt-24 pb-12">
        <div className="flex-1 flex flex-col h-[calc(100vh-12rem)] shadow-lg rounded-xl border border-border overflow-hidden bg-white">
          <div className="p-4 border-b border-border/40 flex justify-between items-center bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Bot size={20} />
              </div>
              <div>
                <h2 className="font-semibold">AI Study Assistant</h2>
                <p className="text-xs text-muted-foreground">Online and ready to help</p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical size={20} />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={cn(
                  "flex gap-3 max-w-[90%]",
                  message.sender === 'user' ? "ml-auto" : ""
                )}
              >
                {message.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary mt-1">
                    <Bot size={16} />
                  </div>
                )}
                
                <div 
                  className={cn(
                    "p-3 rounded-lg",
                    message.sender === 'user'
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {message.isImage && message.imageUrl ? (
                    <div className="mb-2">
                      <img 
                        src={message.imageUrl} 
                        alt="Uploaded" 
                        className="max-w-xs rounded-md"
                      />
                    </div>
                  ) : null}
                  
                  <div className={cn(
                    "prose prose-sm max-w-none",
                    message.sender === 'user' && "prose-invert"
                  )}>
                    {formatMessageContent(message.content)}
                  </div>
                  
                  {message.sender === 'bot' && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <button className="hover:text-foreground transition-colors">
                        <ThumbsUp size={14} />
                      </button>
                      <button className="hover:text-foreground transition-colors">
                        <ThumbsDown size={14} />
                      </button>
                      <button className="hover:text-foreground transition-colors ml-auto">
                        <Copy size={14} />
                      </button>
                    </div>
                  )}
                </div>
                
                {message.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center text-foreground mt-1">
                    <User size={16} />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary mt-1">
                  <Bot size={16} />
                </div>
                <div className="p-3 rounded-lg bg-muted max-w-[90%]">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-4 border-t border-border/40 bg-muted/20">
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="flex-shrink-0"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Image size={18} />
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        accept="image/*" 
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Upload an image of a problem
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask something about JEE/NEET..."
                  className="w-full py-2 px-4 pr-10 rounded-lg border border-border focus:border-primary focus:ring-primary outline-none transition-colors bg-background"
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
              </div>
              
              <Button 
                variant="default" 
                size="icon"
                className="flex-shrink-0"
                onClick={handleSendMessage}
                disabled={inputValue.trim() === ''}
              >
                <Send size={18} />
              </Button>
            </div>
            
            <div className="mt-2 flex flex-wrap gap-1">
              <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 transition-colors">
                Newton's Laws
              </Badge>
              <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 transition-colors">
                Acid-Base
              </Badge>
              <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 transition-colors">
                Calculus
              </Badge>
              <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 transition-colors">
                Photosynthesis
              </Badge>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Chatbot;
