'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatBotProps {
    cvContent: string;
    jobContent: string;
}

const ChatBot: React.FC<ChatBotProps> = ({ cvContent, jobContent }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Mensaje inicial solo una vez al abrir el chat
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{
                role: 'assistant',
                content: '¡Hola! Soy tu asistente de DreamJob. Añade tu CV y la oferta de trabajo para que pueda ayudarte mejor.'
            }]);
        }
    }, [isOpen]);

    // Añadir mensaje informativo cuando cambia el contenido, sin borrar historial
    useEffect(() => {
        if (!isOpen) return;
        if (cvContent && jobContent) {
            setMessages(prev => {
                // Evita mensajes duplicados
                if (prev.some(m => m.content.includes('¡Genial! Ya tengo tu CV'))) return prev;
                return [...prev, {
                    role: 'assistant',
                    content: '¡Genial! Ya tengo tu CV y la oferta de trabajo. ¿En qué puedo ayudarte?'
                }];
            });
        } else if (cvContent && !jobContent) {
            setMessages(prev => {
                if (prev.some(m => m.content.includes('¡He recibido tu CV!'))) return prev;
                return [...prev, {
                    role: 'assistant',
                    content: '¡He recibido tu CV! Cuando añadas la oferta de trabajo podré ayudarte mejor.'
                }];
            });
        } else if (!cvContent && jobContent) {
            setMessages(prev => {
                if (prev.some(m => m.content.includes('¡He recibido la oferta!'))) return prev;
                return [...prev, {
                    role: 'assistant',
                    content: '¡He recibido la oferta! Cuando añadas tu CV podré ayudarte mejor.'
                }];
            });
        }
    }, [cvContent, jobContent, isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    cvContent,
                    jobContent,
                }),
            });

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Lo siento, ha ocurrido un error. Por favor, intenta de nuevo.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Procesar el texto línea por línea
    const formatMessage = (text: string) => {
        return text.split('\n').map((line, i) => {
            // Si la línea empieza con un guión, darle formato especial
            if (line.trim().startsWith('-')) {
                return (
                    <div key={i} className="my-2">
                        {line}
                    </div>
                );
            }
            return (
                <div key={i} className="mb-2">
                    {line}
                </div>
            );
        });
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '2rem',
            right: '3rem',
            zIndex: 9999,
            transform: 'scale(1)',
        }}>
            <div className="chatbot-container">
                {/* Botón circular flotante cuando está cerrado */}
                {!isOpen && (
                    <button
                        onClick={() => setIsOpen(true)}
                        className="w-14 h-14 rounded-full bg-gradient-to-r from-[#FF5733] to-[#E64A2E] text-white 
                                 shadow-lg hover:shadow-xl
                                 flex items-center justify-center 
                                 hover:scale-110 transition-all duration-300 group"
                    >
                        {/* ...icono... */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-7 w-7 transform transition-transform duration-300 group-hover:rotate-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
                            />
                        </svg>
                    </button>
                )}

                {/* Ventana del chat cuando está abierto */}
                {isOpen && (
                    <div className="chatbot-window bg-white rounded-lg shadow-2xl flex flex-col animate-fade-in-up">
                        {/* Header con botón de cerrar */}
                        <div className="bg-gradient-to-r from-[#FF5733] to-[#E64A2E] p-4 rounded-t-lg flex justify-between items-center">
                            <h3 className="text-white font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                                Asistente DreamJob
                            </h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white hover:text-gray-200 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-lg ${
                                            message.role === 'user'
                                                ? 'bg-gradient-to-r from-[#FF5733] to-[#E64A2E] text-white'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}
                                    >
                                        {formatMessage(message.content)}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 p-3 rounded-lg flex items-center space-x-2">
                                        <div className="animate-bounce h-2 w-2 bg-gray-500 rounded-full"></div>
                                        <div className="animate-bounce h-2 w-2 bg-gray-500 rounded-full" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="animate-bounce h-2 w-2 bg-gray-500 rounded-full" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSubmit} className="p-4 border-t">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Escribe tu pregunta..."
                                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E64A2E]"
                                    disabled={isLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-gradient-to-r from-[#FF5733] to-[#E64A2E] text-white p-2 rounded-lg hover:opacity-90 disabled:opacity-50"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatBot;