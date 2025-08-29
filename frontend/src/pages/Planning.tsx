import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Plane, Wallet, Mountain } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { v4 as uuid } from 'uuid';

const Card = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={`rounded-lg border border-zinc-800 bg-zinc-900/50 text-white shadow-sm transition-all hover:border-zinc-700 hover:bg-zinc-900 cursor-pointer ${className}`} {...props}>
        {children}
    </div>
);

const CardHeader = ({ children, className }: React.HTMLAttributes<HTMLDivElement>) => <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>;

const CardTitle = ({ children, className }: React.HTMLAttributes<HTMLHeadingElement>) => <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;

type Suggestion = {
  title: string;
  prompt: string;
  icon: React.ReactNode;
};

const suggestions: Suggestion[] = [
  { title: "Plan a budget trip", prompt: "I want to plan a 5-day trip to Southeast Asia with a budget of $1000. Can you suggest an itinerary?", icon: <Wallet className="h-6 w-6 text-green-400" /> },
  { title: "Adventure travel ideas", prompt: "Give me some ideas for an adventure-filled trip in South America. I'm interested in hiking and wildlife.", icon: <Mountain className="h-6 w-6 text-orange-400" /> },
  { title: "Find the best flights", prompt: "What are the cheapest flights from New York to London in the next three months?", icon: <Plane className="h-6 w-6 text-blue-400" /> }
];

export default function AiTripChatPage() {
  const [messages, setMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([]);;
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 👇 ensure sessionId is persisted per user
  useEffect(() => {
    // Get or create sessionId
    let id = localStorage.getItem("tripSessionId");
    if (!id) {
      id = uuid();
      localStorage.setItem("tripSessionId", id);
    }
    setSessionId(id);
  }, []);

  useEffect(() => {
    // Auto scroll down when messages update
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || !sessionId) return;

    const userMessage = input.trim();

    // Show user message instantly
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

     try {
      const res = await fetch("http://localhost:5000/api/ai/trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, userMessage }),
      });

      const data = await res.json();

      // 2. add AI response
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: data.resp || "No response" },
      ]);
    } catch (err) {
        console.error("Error sending message:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Error contacting server" },
      ]);
    } finally {
      setLoading(false);
    }
  };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter" && !loading) {
//       sendMessage();
//     }
//   };

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
                  <Card key={index} onClick={() => setInput(suggestion.prompt)}>
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
            // Chat Log
            <div className="space-y-10">
              {messages.map((msg, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-1">
                    {msg.sender === 'user' && (<p className='font-semibold bg-[#0f0f0f] rounded-sm p-3 w-auto text-gray-300 text-right'>{msg.text}</p>)}

                    {loading && (
                      <div className="bg-gray-300 text-black p-2 rounded-xl max-w-[50%]" >
                        Thinking…
                      </div>
                    )}
                    <p className='bg-transparent text-white text-left p-2 mt-4'>{msg.text}</p>
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
            onSubmit={(e) => { e.preventDefault();
                sendMessage() }}
          >
            <Textarea
              className='border-gray-600'
              value={input}
              onChange={(e) => setInput(e.target.value)}
            //   onKeyDown={handleKeyDown}
              placeholder="e.g., Plan a 3-day trip to Rome..."
              disabled={loading}
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