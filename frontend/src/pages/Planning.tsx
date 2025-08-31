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

type Message = {
    sender: "user" | "ai";
    text: string;
    plan?: TripPlan;
    ui?: string;
    loading?: boolean; // Add loading state to each message
};

type ChatMessage = {
  sender: "user" | "ai";
  text: string;
  ui?: "source" | "destination" | "groupSize" | "budget" | "tripDuration" | "travelInterests" | "preferences" | "Final";
  plan?: any; // You can make this more strict later if you want
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
  const [loading, setLoading] = useState(false);
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
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || !sessionId) return;

    const userMessage : Message = { sender: 'user', text: input };
    const loadingMessage: Message = { sender: 'ai', text: '', loading: true };

    // Add user message and AI loading placeholder
        setMessages((prev) => [...prev, userMessage, loadingMessage]);
        setInput("");
        setLoading(true);

     try { 
      const res = await axios.post("http://localhost:5000/api/ai/trip", {
        headers: { "Content-Type": "application/json" },
        sessionId,
        userMessage: input,
      });

         // Replace last AI message with real reply
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { sender: 'ai', 
         text: res.data.resp, 
         ui: res.data.ui,
         plan: res.data.plan 
        };
        return updated;
      });
       } catch (err) {
         console.error(err);
       } finally {
           setLoading(false);
         }
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

                    {/* {msg.loading && (
                      <div role="status" className="flex justify-start">
                        <svg
                          aria-hidden="true"
                          className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-orange-600"
                          viewBox="0 0 100 101"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873Z"
                            fill="currentFill"
                          />
                        </svg>
                      </div>
                    )} */}

                    {loading && msg.sender === 'ai' &&  (
                      <div role="status">
                          <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-orange-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                          </svg>
                          {/* <span className="sr-only">Loading...</span> */}
                      </div>
                    )}

                    {!loading && msg.sender === 'ai' && (
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
              disabled={loading}
            />
            <Button type="submit" size="icon" disabled={!input.trim() || loading}>
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </footer>
    </div>
  );
}