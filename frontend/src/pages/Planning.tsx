import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Plane, Wallet, Mountain, Bot, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Avatar } from '@radix-ui/react-avatar';
import { Textarea } from '../components/ui/textarea';

const Card = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={`rounded-lg border border-zinc-800 bg-zinc-900/50 text-white shadow-sm transition-all hover:border-zinc-700 hover:bg-zinc-900 cursor-pointer ${className}`} {...props}>
        {children}
    </div>
);

const CardHeader = ({ children, className }: React.HTMLAttributes<HTMLDivElement>) => <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>;
const CardTitle = ({ children, className }: React.HTMLAttributes<HTMLHeadingElement>) => <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;


type Message = {
  id: number;
  sender: 'user' | 'ai';
  text: string;
};

type Suggestion = {
  title: string;
  prompt: string;
  icon: React.ReactNode;
};

// --- Initial Suggestions Data ---

const suggestions: Suggestion[] = [
    {
        title: "Plan a budget trip",
        prompt: "I want to plan a 5-day trip to Southeast Asia with a budget of $1000. Can you suggest an itinerary?",
        icon: <Wallet className="h-6 w-6 text-green-400" />
    },
    {
        title: "Adventure travel ideas",
        prompt: "Give me some ideas for an adventure-filled trip in South America. I'm interested in hiking and wildlife.",
        icon: <Mountain className="h-6 w-6 text-orange-400" />
    },
    {
        title: "Find the best flights",
        prompt: "What are the cheapest flights from New York to London in the next three months?",
        icon: <Plane className="h-6 w-6 text-blue-400" />
    }
];

// --- Static AI Response Example ---
const longAiResponse = `Of course! Here is a potential 5-day budget-friendly itinerary for Southeast Asia:

**Destination:** Chiang Mai, Thailand

* **Day 1: Arrival & City Exploration.** Arrive at Chiang Mai International Airport (CNX). Check into your hostel in the Old City. Spend the afternoon exploring ancient temples like Wat Chedi Luang and Wat Phra Singh. Enjoy a delicious and cheap dinner at the nightly street food market.
* **Day 2: Elephant Sanctuary.** Visit a reputable ethical elephant sanctuary. Spend the day feeding, bathing, and learning about these incredible animals. This is often a highlight for many travelers.
* **Day 3: Doi Suthep & Monk Chat.** Hike or take a songthaew (red truck taxi) up to Wat Phra That Doi Suthep, a stunning temple overlooking the city. In the afternoon, participate in a "monk chat" to learn about Buddhism and local life.
* **Day 4: Cooking Class.** Thai food is amazing, and a cooking class is a fantastic way to immerse yourself in the culture. You'll visit a local market to buy ingredients and then learn to cook several classic dishes.
* **Day 5: Departure.** Enjoy a final Thai breakfast before heading to the airport for your departure.

This itinerary provides a great mix of culture, nature, and food, all while being very budget-conscious.`;


// --- The Main Chat Page Component ---

export default function AiTripChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (promptText: string = input) => {
        if (!promptText.trim()) return;

        const userMessage: Message = {
            id: Date.now(),
            sender: 'user',
            text: promptText,
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');

        // Simulate AI response with the long static example
        setTimeout(() => {
            const aiResponse: Message = {
                id: Date.now() + 1,
                sender: 'ai',
                text: longAiResponse
            };
            setMessages(prev => [...prev, aiResponse]);
        }, 1000);
    };
    
    const handleSuggestionClick = (prompt: string) => {
        handleSend(prompt);
    };

    return (
        <div className="flex flex-col h-screen bg-black text-white">
            <main className="flex-1 overflow-y-auto p-4 pt-28 pb-36">
                <div className="max-w-3xl mx-auto">
                    {messages.length === 0 ? (
                        // Initial Welcome Screen
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <Sparkles className="h-16 w-16 text-blue-500 mb-4" />
                            <h1 className="text-4xl font-bold mb-2">Welcome to your AI Trip Planner</h1>
                            <p className="text-zinc-400 mb-12 max-w-lg">
                                Tell me your travel dreams, and I'll craft the perfect itinerary. Start by typing below or choose a suggestion.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                                {suggestions.map((suggestion, index) => (
                                    <Card key={index} onClick={() => handleSuggestionClick(suggestion.prompt)}>
                                        <CardHeader>
                                            <div className="flex items-center gap-4">
                                                {suggestion.icon}
                                                <CardTitle>{suggestion.title}</CardTitle>
                                            </div>
                                        </CardHeader>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ) : (
                        // New Prompt-and-Response Log
                        <div className="space-y-10">
                            {messages.map((msg) => (
                                <div key={msg.id} className="flex items-start gap-4">
                                    <Avatar>
                                        {msg.sender === 'user' ? <User className="h-5 w-5 text-zinc-400" /> : <Bot className="h-5 w-5 text-blue-400" />}
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className={`font-semibold ${msg.sender === 'user' ? 'text-white' : 'text-blue-400'}`}>
                                            {msg.sender === 'user' ? 'You' : 'AI Trip Planner'}
                                        </p>
                                        <div className="prose prose-invert max-w-none text-zinc-200 whitespace-pre-wrap">
                                            {msg.text}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
            </main>

            {/* Fixed Input Form */}
            <footer className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-4 ">
                <div className="max-w-3xl mx-auto">
                    <form
                        className="flex items-center gap-2"
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    >
                        <Textarea
                            className='border-gray-600'
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="e.g., Plan a 3-day trip to Rome..."
                        />
                        <Button type="submit" size="icon" disabled={!input.trim()}>
                            <Send className="h-5 w-5" />
                        </Button>
                    </form>
                </div>
            </footer>
        </div>
    );
}
