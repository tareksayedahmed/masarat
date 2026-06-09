import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const AiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: 'أهلاً بك في مساعد مسارات الذكي! كيف يمكنني مساعدتك اليوم في حجز سيارتك؟' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      const systemInstruction = `
        You are "Masarat AI Assistant", a helpful and friendly chatbot for a Saudi Arabian car rental company called "Masarat".
        Your goal is to assist users with their car rental inquiries.
        - Your knowledge is strictly limited to car rentals: types of cars (Sedan, SUV, Economy, Trucks), booking process, pricing (daily, weekly, monthly), branches, required documents (ID, license), and rental terms.
        - If asked about anything outside of car rentals, politely decline and steer the conversation back to car rentals. For example: "أنا متخصص فقط في مساعدتك في كل ما يتعلق بتأجير السيارات. هل لديك أي استفسار حول أسطولنا أو كيفية الحجز؟"
        - Always be polite, professional, and use Arabic.
        - Keep answers concise and to the point.
      `;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: input,
        config: { systemInstruction }
      });

      const aiMessage: Message = { sender: 'ai', text: response.text };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error("Gemini API error:", error);
      const errorMessage: Message = { sender: 'ai', text: 'عفواً، حدث خطأ ما. الرجاء المحاولة مرة أخرى.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[60vh]">
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'ai' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
                M
              </div>
            )}
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${
                msg.sender === 'user'
                  ? 'bg-orange-600 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-800 rounded-bl-none dark:bg-gray-700 dark:text-gray-200'
              }`}
            >
              <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex items-end gap-2 justify-start">
                 <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">M</div>
                 <div className="px-4 py-2 rounded-2xl bg-gray-200 text-gray-800 rounded-bl-none dark:bg-gray-700 dark:text-gray-200">
                    <div className="flex items-center justify-center gap-1">
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-0"></span>
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></span>
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-300"></span>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t dark:border-gray-700">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="اكتب سؤالك هنا..."
            className="flex-grow"
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
            {isLoading ? '...' : 'إرسال'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
