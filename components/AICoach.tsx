import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Habit, HabitStats, ChatMessage } from '../types';
import { generateCoachResponseStream, generateMotivationalQuote } from '../services/geminiService';
// Fix: Corrected import path for icons.
import { PaperAirplaneIcon, SparklesIcon } from './icons';

interface AICoachProps {
  habits: Habit[];
  stats: Map<string, HabitStats>;
}

const AICoach: React.FC<AICoachProps> = ({ habits, stats }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', text: "Hello! I'm Aura, your AI Habit Coach. How can I help you build better habits today?", sender: 'ai' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
 const handleSendMessage = useCallback(async (query: string) => {
    if (!query.trim() || isLoading) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), text: query, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    
    setInput('');
    setIsLoading(true);
    const aiMessageId = `ai-${Date.now()}`;
    const aiPlaceholderMessage: ChatMessage = { id: aiMessageId, text: '', sender: 'ai', isLoading: true };
    setMessages(prev => [...prev, aiPlaceholderMessage]);

    try {
      const stream = generateCoachResponseStream(query, habits, stats);
      let fullResponse = '';

      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev =>
          prev.map(msg =>
            msg.id === aiMessageId
              ? { ...msg, text: fullResponse }
              : msg
          )
        );
      }
    } catch (error) {
      console.error("Streaming error:", error);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === aiMessageId
            ? { ...msg, text: "Sorry, I encountered an error. Please try again.", isLoading: false }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === aiMessageId ? { ...msg, isLoading: false } : msg
        )
      );
    }
  }, [habits, stats, isLoading]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  const handleQuickAction = async (action: 'motivate' | 'analyze' | 'skipped') => {
      if (isLoading) return;
      let query = '';
      if(action === 'motivate') {
          setIsLoading(true);
          const userMessage: ChatMessage = { id: Date.now().toString(), text: "Motivate me!", sender: 'user' };
          const aiLoadingMessage: ChatMessage = { id: (Date.now() + 1).toString(), text: '', sender: 'ai', isLoading: true };
          setMessages(prev => [...prev, userMessage, aiLoadingMessage]);
          const quote = await generateMotivationalQuote();
          const aiResponseMessage: ChatMessage = { id: (Date.now() + 1).toString(), text: quote, sender: 'ai' };
          setMessages(prev => prev.filter(m => m.id !== aiLoadingMessage.id).concat(aiResponseMessage));
          setIsLoading(false);
          return;
      }
      if(action === 'analyze') query = "Summarize my progress this week.";
      if(action === 'skipped') query = "What does my skipped-days pattern tell about my productivity?";
      handleSendMessage(query);
  }

  return (
    <div className="p-4 md:p-8">
      <div className="bg-base-100 rounded-2xl shadow-lg max-w-4xl mx-auto flex flex-col h-[75vh]">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">AI Habit Coach</h2>
          <p className="text-sm text-gray-500">Your personal guide to success</p>
        </div>
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${msg.sender === 'user' ? 'bg-primary text-purple-900 rounded-br-none' : 'bg-base-300 text-gray-800 rounded-bl-none'}`}>
                {msg.text}
                {msg.isLoading && <span className="inline-block w-2 h-4 ml-1 animate-pulse bg-current rounded-sm"></span>}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <div className="p-4 border-t bg-base-100/50 rounded-b-2xl">
          <div className="flex flex-wrap gap-2 mb-2">
              <QuickActionButton onClick={() => handleQuickAction('motivate')}>
                  <SparklesIcon /> Motivate Me
              </QuickActionButton>
              <QuickActionButton onClick={() => handleQuickAction('analyze')}>Analyze My Week</QuickActionButton>
              <QuickActionButton onClick={() => handleQuickAction('skipped')}>Why Did I Skip?</QuickActionButton>
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask your coach anything..."
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button type="submit" disabled={isLoading} className="bg-accent text-white p-3 rounded-full hover:bg-green-600 transition-all duration-200 transform hover:scale-110 disabled:bg-gray-400 disabled:transform-none">
              <PaperAirplaneIcon />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const QuickActionButton: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
    <button onClick={onClick} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full hover:bg-purple-200 transition-all duration-200 transform hover:scale-105">
        {children}
    </button>
);

export default AICoach;
