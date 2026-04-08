import { LuX } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";

export default function Modal({ children, isOpen, onClose, title }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex justify-center items-center overflow-y-auto overflow-x-hidden"
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="relative w-full max-w-2xl mx-4"
                    >
                        <div className="glass-card shadow-2xl shadow-black/30">
                            {/* Header */}
                            <div className="flex items-center justify-between p-5 border-b border-border-subtle">
                                <h3 className="text-lg font-semibold text-text-primary">
                                    {title}
                                </h3>

                                <button
                                    type="button"
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-all cursor-pointer"
                                    onClick={onClose}
                                >
                                    <LuX className="text-xl" />
                                </button>
                            </div>
                            {/* Body */}
                            <div className="p-5">
                                {children}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}