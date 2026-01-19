import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { createHACCPChat, sendMessageToGemini } from '../services/geminiService';
import { Send, Bot, AlertTriangle } from './Icons';
import { GenerateContentResponse } from '@google/genai';

interface AIAssistantProps {
  apiKey?: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ apiKey }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Bonjour ! Je suis votre assistant expert HACCP. Une question sur les températures, le stockage ou les procédures d'hygiène ?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // We can't use useRef for the chat session easily if the key changes, so we'll recreate it if needed in handleSend or via effect.
  // Actually, keeping it simple: recreate session on mount or key change isn't ideal for persistent chat, 
  // but for this scope, let's just instantiate when sending if possible or use a ref that updates.
  const chatSession = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset chat if key changes
  useEffect(() => {
    chatSession.current = null;
  }, [apiKey]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    if (!apiKey) {
         setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'model',
            text: "Erreur : Aucune clé API configurée. Veuillez ajouter votre clé Gemini dans l'onglet Paramètres.",
            timestamp: new Date()
          }]);
        return;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      if (!chatSession.current) {
          chatSession.current = createHACCPChat(apiKey);
      }
      
      const result = await sendMessageToGemini(chatSession.current, userMsg.text);
      
      let fullResponseText = '';
      const modelMsgId = (Date.now() + 1).toString();
      
      // Initialize empty model message
      setMessages(prev => [...prev, {
        id: modelMsgId,
        role: 'model',
        text: '',
        timestamp: new Date()
      }]);

      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        const text = c.text;
        if (text) {
          fullResponseText += text;
          setMessages(prev => prev.map(msg => 
            msg.id === modelMsgId ? { ...msg, text: fullResponseText } : msg
          ));
        }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "Désolé, une erreur est survenue. Vérifiez votre clé API dans les paramètres.",
        timestamp: new Date()
      }]);
      chatSession.current = null; // Reset session on error
    } finally {
      setIsLoading(false);
    }
  };

  if (!apiKey) {
      return (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl">
              <AlertTriangle className="w-12 h-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Configuration Requise</h3>
              <p className="text-gray-600 mb-4">
                  Pour discuter avec l'expert HACCP, vous devez configurer votre clé API Google Gemini.
              </p>
              <p className="text-sm text-gray-500">Allez dans le menu <strong>Paramètres</strong> pour l'ajouter.</p>
          </div>
      )
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex items-center shadow-sm">
        <Bot className="w-6 h-6 mr-3" />
        <div>
          <h2 className="font-bold text-lg">OctoGuard AI</h2>
          <p className="text-xs text-blue-100 opacity-90">Expert HACCP 24/7</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {msg.text}
              </div>
              <div className={`text-[10px] mt-2 text-right ${msg.role === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-tl-none p-4 border border-gray-100 shadow-sm flex items-center space-x-2">
               <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
               <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
               <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={handleSend} className="flex gap-2 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez une question sur l'hygiène..."
            style={{ colorScheme: 'light' }}
            className="flex-1 p-3 pr-12 bg-white border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 shadow-sm placeholder-gray-400"
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;