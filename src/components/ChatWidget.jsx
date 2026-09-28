"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, User, Bot, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "model",
      text: "Hi there! I'm TravelBot. How can I help you with your bookings today?",
      time: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      text: input.trim(),
      time: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Prepare history (excluding the very first welcome message if it's the only one to save tokens, or include it)
      const history = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({
          role: m.role,
          text: m.text,
        }));

      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const response = await fetch(`${serverUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text, history }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => null);
        throw new Error(errJson?.error || `Server returned ${response.status}`);
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "-model",
          role: "model",
          text: data.reply || "I'm sorry, I encountered an error. Please try again.",
          time: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "-error",
          role: "model",
          text: error?.message || "Sorry, I am having trouble connecting to the server right now.",
          time: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button - Luxury AI Concierge */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 group cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            {/* Ambient Pulse Glow */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-400 via-indigo-500 to-cyan-400 opacity-60 blur-md group-hover:opacity-100 group-hover:blur-lg transition-all duration-500 animate-pulse" />

            {/* Main Orb */}
            <div className="relative flex items-center gap-3 px-4 py-3 rounded-full bg-slate-950/90 text-white backdrop-blur-xl border border-white/20 shadow-2xl shadow-indigo-950/50">
              {/* Premium Icon Badge */}
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 p-[1.5px] flex items-center justify-center shadow-inner">
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                </div>
                {/* Live Beacon Dot */}
                <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-slate-950" />
                </span>
              </div>

              {/* Label Pill */}
              <div className="hidden sm:flex flex-col pr-1 text-left">
                <span className="text-[10px] font-black tracking-widest uppercase text-amber-400 leading-none">
                  Travel Concierge
                </span>
                <span className="text-xs font-bold text-white/90 leading-tight mt-0.5">
                  Ask AI
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[350px] sm:w-[400px] h-[520px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl shadow-slate-950/30 flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Header - Premium Slate & Gold Aura */}
            <div className="relative bg-slate-950 text-white p-4 flex items-center justify-between border-b border-white/10 z-10 overflow-hidden">
              {/* Subtle top glow line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
              <div className="absolute -right-8 -top-8 w-28 h-28 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 p-[1.5px] flex items-center justify-center shadow-lg">
                  <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-white text-sm tracking-tight">TravelHub Concierge</h3>
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      VIP AI
                    </span>
                  </div>
                  <p className="text-white/50 text-[11px] font-medium flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Always active • Instant answers
                  </p>
                </div>
              </div>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                radius="full"
                className="text-white/60 hover:text-white hover:bg-white/10"
                onPress={() => setIsOpen(false)}
              >
                <X size={18} />
              </Button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/70 dark:bg-slate-900/40 scroll-smooth">
              {messages.map((msg) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id}
                  className={`flex items-end gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === "user" ? "bg-indigo-600 text-white" : "bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 p-[1px]"}`}>
                    {msg.role === "user" ? (
                      <User size={14} />
                    ) : (
                      <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                        <Sparkles size={13} className="text-amber-300" />
                      </div>
                    )}
                  </div>
                  
                  <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${msg.role === "user" ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-sm shadow-md" : "bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-white/10 text-slate-800 dark:text-slate-100 rounded-bl-sm shadow-sm"}`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex items-end gap-2.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 p-[1px]">
                    <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                      <Sparkles size={13} className="text-amber-300 animate-spin" />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-white/10 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 z-10">
              <form onSubmit={handleSend} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about flights, buses..."
                  className="flex-1 bg-gray-100 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-4 py-2.5 text-sm outline-none transition-all dark:text-white placeholder:text-gray-400"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  isIconOnly
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-auto w-11 shrink-0"
                  disabled={!input.trim() || isLoading}
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
