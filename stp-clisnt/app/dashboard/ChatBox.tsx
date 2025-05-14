
import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Message {
    role?: "bot" | "user";
    message?: string;
}

export default function ChatBot() {
    const [messages, setMessages] = useState<Message[]>([
        {
            "role": "user",
            "message": "I need help with my account."
        },
        {
            "role": "bot",
            "message": "Sure, I can help you with that. What seems to be the problem?"
        },
        {
            "role": "user",
            "message": "I forgot my password."
        },
        {
            "role": "bot",
            "message": "No problem! I can help you reset your password. Please provide your email address."
        }
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {


            setMessages((prevMessages) => [
                ...prevMessages,
                { role: "user", message: input.trim() },
            ]);

            // messagesEndRef.value " "

            setInput("");

            await fetch("http://localhost:8000", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: input.trim() }),
            })
                .then((res) => res.json())
                .then(({ msg }) => {
                    // console.log("Response from server:", msg);
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { role: "bot", message: msg.message || "Bot response" },
                    ]);
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <Card className="bg-white rounded-md flex flex-col h-full border-none ">
            <CardHeader className="mx-0 px-0" >
                <CardTitle className="text-gray-900">Ask me</CardTitle>
                <CardDescription>Chat Smarter with AI That Understands You</CardDescription>
            </CardHeader>

            <div className="flex-1 flex overflow-y-scroll mb-4  no-scrollbar flex-col">
                {messages.length ? (
                    messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`mb-3 p-2 rounded transition-opacity  w-[70%] ${msg.role === "user" ? "bg-brand-blue text-white self-end " : "bg-gray-100 text-brand-blue-dark  "}`}>
                            {msg.message}
                        </div>
                    ))
                ) : (
                    <div className="text-gray-500 text-sm">No messages yet.</div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSend} className="flex gap-2">
                <input
                    type="text"
                    className="flex-1 border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 bg-[#f2f2f2] text-brand-blue focus:ring-transparent border-none"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                />
                <Button type="submit" className="bg-brand-blue text-white hover:bg-brand-blue-dark">
                    Send
                </Button>
            </form>
        </Card>
    );
}


