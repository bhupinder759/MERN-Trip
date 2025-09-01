import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Plane, Wallet, Mountain, MapPin, Users, CalendarDays, Utensils, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { v4 as uuid } from 'uuid';
import axios from 'axios';

const Card = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={`rounded-lg border border-zinc-800 bg-zinc-900/50 text-white shadow-sm transition-all hover:border-zinc-700 hover:bg-zinc-900 cursor-pointer ${className}`} {...props}>
        {children}
    </div>
);

const CardHeader = ({ children, className }: React.HTMLAttributes<HTMLDivElement>) => <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>;

const CardTitle = ({ children, className }: React.HTMLAttributes<HTMLHeadingElement>) => <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;

type TripPlan = {
    destination: string;
    source: string;
    groupSize: string;
    budget: string;
    duration: string;
    interests: string[];
    specialRequirements: string;
    itinerary: { day: number; activities: string }[];
    note: string;
};

type ChatMessage = {
  sender: "user" | "ai";
  text: string;
  ui?: "source" | "destination" | "groupSize" | "budget" | "tripDuration" | "travelInterests" | "preferences" | "Final";
  plan?: TripPlan;
  loading?: boolean;
};

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

// --- Helper Components ---
const InfoPill = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | string[] }) => (
    <div className="flex items-center gap-3 bg-zinc-800/50 p-3 rounded-lg">
        <div className="text-blue-400">{icon}</div>
        <div>
            <p className="text-sm text-zinc-400">{label}</p>
            <p className="font-semibold text-white">
                {Array.isArray(value) ? value.join(', ') : value}
            </p>
        </div>
    </div>
);

// --- Trip Plan UI Component ---
const TripPlanCard = ({ plan }: { plan: TripPlan }) => (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mt-4">
        <h2 className="text-2xl font-bold mb-1">Your Customized Trip Plan to {plan.destination}</h2>
        <p className="text-zinc-400 mb-6">Here is a suggested itinerary based on your preferences.</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <InfoPill icon={<MapPin size={20} />} label="From" value={plan.source} />
            <InfoPill icon={<Users size={20} />} label="Group Size" value={plan.groupSize} />
            <InfoPill icon={<Wallet size={20} />} label="Budget" value={plan.budget} />
            <InfoPill icon={<CalendarDays size={20} />} label="Duration" value={plan.duration} />
            <InfoPill icon={<Utensils size={20} />} label="Interests" value={plan.interests} />
            <InfoPill icon={<Star size={20} />} label="Requirements" value={plan.specialRequirements} />
        </div>

        <h3 className="text-xl font-bold mb-4">Suggested Itinerary</h3>
        <div className="space-y-4">
            {plan.itinerary.map(item => (
                <div key={item.day} className="flex gap-4">
                    <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center h-10 w-10 bg-blue-600 text-white font-bold rounded-full">
                            {item.day}
                        </div>
                        {item.day !== plan.itinerary.length && <div className="w-px h-full bg-zinc-700 mt-2"></div>}
                    </div>
                    <div>
                        <p className="font-semibold text-white">Day {item.day}</p>
                        <p className="text-zinc-300">{item.activities}</p>
                    </div>
                </div>
            ))}
        </div>

        {plan.note && (
             <div className="mt-8 border-t border-zinc-800 pt-4">
                <p className="text-sm text-zinc-400"><strong className="text-zinc-200">Note:</strong> {plan.note}</p>
            </div>
        )}
    </div>
);


export default function AiTripChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  // const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  console.log(messages, "messages");
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
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);

    const loadingMessage: ChatMessage = { sender: 'ai', text: '', loading: true };
    setMessages((prev) => [...prev, loadingMessage]);

    const currentInput = input;
    setInput("");

    // setLoading(true);

     try { 
      // 3. Call API
      const res = await axios.post(
        "http://localhost:5000/api/ai/trip",
        { sessionId, userMessage: currentInput },
        { headers: { "Content-Type": "application/json" } }
      );

      // 4. Replace *only the last message* (loading one) with actual AI reply
      setMessages((prev) => {
      const updated = [...prev];
      updated[updated.length - 1] = {
        sender: "ai",
        text: res.data.resp,
        ui: res.data.ui,
        plan: res.data.plan,
        loading: false,
      };
      return updated;
    });
       } catch (err) {
         console.error(err);
         // Replace the last message with error response
    setMessages((prev) => {
      const updated = [...prev];
      updated[updated.length - 1] = {
        sender: "ai",
        text: "⚠️ Something went wrong, please try again.",
        loading: false,
      };
      return updated;
    });
       }
        // finally {
        //    setLoading(false);
        //  }
       };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <main className="flex-1 overflow-y-auto p-4 pt-28 pb-36">
        <div className="max-w-3xl mx-auto">
          {messages.length === 0 ? (
            // Initial Welcome Screen
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Sparkles className="h-16 w-16 text-orange-500 mb-4" />
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
                    {msg.sender === 'user' && (
                    <div className='flex justify-end mb-2'>
                      <p className='font-semibold bg-[#0f0f0f] rounded-xl p-3 w-auto text-gray-300 text-right'>{msg.text}</p>
                    </div>)
                    }

                    {msg.loading &&  (
                        <span className="flex gap-1">
                              <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                              <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                              <span className="w-2 h-2 bg-orange-600 rounded-full animate-bounce"></span>
                            </span>                    )}

                    {msg.sender === 'ai' && (
                      <>
                        {msg.ui === 'Final' && msg.plan ? (
                          <TripPlanCard plan={msg.plan} />
                        ) : (
                          <p className="bg-transparent text-white text-left p-2 mt-4">{msg.text}</p>
                        )}
                      </>
                    )}
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
              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage();
                                }
                            }}
              placeholder="e.g., Plan a 3-day trip to Rome..."
              // disabled={loading}
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