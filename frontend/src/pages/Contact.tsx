import React from 'react';
import { Mail } from 'lucide-react';

// --- Shadcn UI Component Mocks ---
// In your actual project, you would import these from '@/components/ui/*'.
// These are simplified mocks for this runnable example.

const Button = ({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none h-10 py-2 px-4 bg-blue-600 text-white hover:bg-blue-700 ${className}`} {...props}>
        {children}
    </button>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input className={`flex h-10 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${props.className}`} {...props} />
);

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea className={`flex min-h-[80px] w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${props.className}`} {...props} />
);

const Label = (props: React.LabelHTMLAttributes<HTMLLabelElement>) => (
    <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${props.className}`} {...props} />
);


// --- The Main Contact Page Component ---

export default function Contact() {
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would handle the form submission, e.g., send data to an API
        console.log("Form submitted!");
    };

    return (
        <div className="bg-black text-white min-h-screen pt-28">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap lg:flex-nowrap items-center justify-center gap-12">
                    
                    {/* Left Section: Info */}
                    <div className="w-full lg:w-1/2 text-center lg:text-left">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Let's chat.</h1>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-zinc-400">Tell us about your next trip.</h2>
                        <p className="text-lg text-zinc-300 mb-10">Let's create something amazing together.</p>
                        
                        <div className="inline-flex items-center gap-4 rounded-lg bg-zinc-900/50 border border-zinc-800 p-4">
                            <Mail className="h-8 w-8 text-blue-400" />
                            <div>
                                <p className="text-zinc-400">Mail us at</p>
                                <a href="mailto:contact@aitripplanner.com" className="text-white font-semibold hover:text-blue-400 transition-colors">
                                    contact@aitripplanner.com
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Form */}
                    <div className="w-full lg:w-1/2 max-w-lg mx-auto">
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 shadow-2xl shadow-blue-500/10">
                            <h3 className="text-2xl font-semibold mb-6">Send us a message</h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <Label htmlFor="fullName">Full Name*</Label>
                                    <Input id="fullName" type="text" placeholder="John Doe" required />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email Address*</Label>
                                    <Input id="email" type="email" placeholder="example@email.com" required />
                                </div>
                                <div>
                                    <Label htmlFor="subject">Subject*</Label>
                                    <Input id="subject" type="text" placeholder="Trip to Italy" required />
                                </div>
                                <div>
                                    <Label htmlFor="message">Tell us more about your project*</Label>
                                    <Textarea id="message" placeholder="Type your message..." required />
                                </div>
                                <Button type="submit" className="w-full">
                                    Send Message
                                </Button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
