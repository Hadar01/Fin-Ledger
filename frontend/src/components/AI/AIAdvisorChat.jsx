import { useState, useRef, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuSparkles, LuSend, LuX, LuMessageCircle } from "react-icons/lu";
import { getFinancialAdvice } from "../../api/geminiService";
import { cn } from "../../utlis/cn";

const QUICK_PROMPTS = [
    "How am I spending?",
    "Where can I save?",
    "Monthly summary",
    "Top expenses",
];

export default function AIAdvisorChat({ financialContext }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Hey! 👋 I'm your Fin Ledger AI advisor. Ask me anything about your finances, or tap a quick prompt below!",
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async (text) => {
        if (!text.trim() || loading) return;

        const userMsg = { role: "user", content: text };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const response = await getFinancialAdvice(text, financialContext);
            setMessages((prev) => [...prev, { role: "assistant", content: response }]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Sorry, I couldn't process that. Please try again!" },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(input);
    };

    return (
        <>
            {/* FAB Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30 flex items-center justify-center text-white cursor-pointer"
                    >
                        <LuMessageCircle className="text-xl" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed bottom-6 right-6 z-50 w-[380px] max-h-[520px] flex flex-col glass-card shadow-2xl shadow-black/30 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-border-subtle bg-surface-card/80">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                                    <LuSparkles className="text-primary-light text-sm" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-text-primary">Fin Ledger AI</h4>
                                    <p className="text-xs text-accent-light">Online</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-primary transition-all cursor-pointer"
                            >
                                <LuX className="text-lg" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[280px] max-h-[340px]">
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "flex",
                                        msg.role === "user" ? "justify-end" : "justify-start"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed",
                                            msg.role === "user"
                                                ? "bg-primary text-white rounded-br-md"
                                                : "bg-surface-elevated border border-border-subtle text-text-secondary rounded-bl-md"
                                        )}
                                    >
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}

                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-surface-elevated border border-border-subtle px-4 py-3 rounded-2xl rounded-bl-md flex gap-1">
                                        <span className="w-2 h-2 bg-primary-light/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <span className="w-2 h-2 bg-primary-light/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <span className="w-2 h-2 bg-primary-light/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Quick Prompts */}
                        {messages.length <= 2 && (
                            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                                {QUICK_PROMPTS.map((prompt) => (
                                    <button
                                        key={prompt}
                                        onClick={() => sendMessage(prompt)}
                                        className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary-light border border-primary/20 hover:bg-primary/20 transition-all cursor-pointer"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input */}
                        <form
                            onSubmit={handleSubmit}
                            className="p-3 border-t border-border-subtle flex items-center gap-2"
                        >
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about your finances..."
                                className="flex-1 bg-surface-elevated/60 border border-border-subtle rounded-xl px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-primary/40 transition-all"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                className={cn(
                                    "w-9 h-9 flex items-center justify-center rounded-xl transition-all cursor-pointer",
                                    input.trim()
                                        ? "bg-primary text-white hover:bg-primary-dark"
                                        : "bg-surface-elevated text-text-muted"
                                )}
                            >
                                <LuSend className="text-sm" />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
