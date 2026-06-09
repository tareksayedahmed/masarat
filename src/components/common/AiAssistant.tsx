import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { aiAPI } from '../../api';
import { MessageSquare, X, Send, Bot, AlertCircle, Sparkles } from 'lucide-react';

export const AiAssistant: React.FC = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; content: string }[]>([
    { sender: 'bot', content: 'أهلاً بك في مسارات! أنا مساعدك الذكي التفاعلي ومستعد لمساعدتك في العثور على أفضل سيارة لرحلتك، وشرح شروط التأجير، ومعاينة أسعار موديلات فئاتنا المتنوعة. كيف يمكنني خدمتك اليوم؟' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const listEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'ما هي فروعكم؟',
    'ما هي أسعار تأجير بورش وسيارات لاند كروزر؟',
    'هل يتوفر لديكم سيارات كهربائية؟',
    'ما هي شروط الاستئجار لديكم؟'
  ];

  useEffect(() => {
    if (listEndRef.current) {
      listEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;
    
    const newMessages = [...messages, { sender: 'user' as const, content: text }];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    try {
      // Map format for API endpoint
      const payload = newMessages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        content: m.content
      }));
      
      const response = await aiAPI.chat(payload);
      setMessages(prev => [...prev, { sender: 'bot', content: response.reply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { sender: 'bot', content: 'نعتذر منك، حدث اضطراب طفيف في خوادم المساعد الذكي. يمكنك الاستفسار عن فروعنا أو حجز السيارات مباشرة عبر اللوحة الإرشادية بسهولة!' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-end">
      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="bg-white dark:bg-gray-850 rounded-2xl shadow-2xl border border-gray-150 dark:border-gray-800 w-[360px] sm:w-[400px] h-[500px] flex flex-col overflow-hidden mb-4 animate-in slide-in-from-bottom duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-amber-500 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-none flex items-center gap-1">
                  <span>مساعد مسارات الذكي</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-200 fill-amber-200" />
                </h4>
                <span className="text-[10px] text-orange-100 opacity-90">مدعوم بالذكاء الاصطناعي من Google</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white rounded-lg p-1 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-3.5 scrollbar-thin">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`max-w-[80%] flex flex-col gap-1 ${
                  m.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
                }`}
              >
                <div
                  className={`rounded-2xl p-3 text-sm leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-orange-600 text-white rounded-br-none font-medium'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-250 rounded-bl-none border border-gray-200/40 dark:border-gray-700/50'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="self-start flex items-center gap-2 bg-gray-100 dark:bg-gray-800 border border-gray-200/40 rounded-2xl rounded-bl-none p-3.5 py-4 w-20 max-w-[80%] justify-center">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={listEndRef} />
          </div>

          {/* Suggestion Chips */}
          {messages.length === 1 && (
            <div className="px-4 pb-3 flex flex-wrap gap-1.5">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p)}
                  className="text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-50 hover:bg-orange-50 dark:bg-gray-800 dark:hover:bg-orange-950/20 border border-gray-200 dark:border-gray-750 hover:border-orange-500/30 rounded-xl px-2.5 py-1.5 transition-all text-right"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input Panel */}
          <div className="p-3.5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex gap-2">
            <input
              type="text"
              placeholder="اكتب سؤالك هنا..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(userInput)}
              className="flex-grow rounded-xl border border-gray-200 dark:border-gray-750 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
            <button
              onClick={() => handleSend(userInput)}
              className="p-2.5 rounded-xl bg-orange-600 text-white shadow-md shadow-orange-500/20 hover:bg-orange-700 active:scale-95 transition-all flex items-center justify-center flex-shrink-0"
            >
              <Send className="w-4 h-4 transform rotate-180" />
            </button>
          </div>

        </div>
      )}

      {/* Floating Action Circle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-xl shadow-orange-500/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer animate-pulse-subtle"
      >
        {isOpen ? <X className="w-6 h-6 animate-in spin-in-90 duration-200" /> : <MessageSquare className="w-6 h-6 animate-in zoom-in duration-300" />}
      </button>

    </div>
  );
};

export default AiAssistant;
