import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuBell, LuCheck, LuTrash2, LuInfo, LuTriangleAlert, LuTrendingUp } from "react-icons/lu";
import { cn } from "../../utlis/cn";

const STORAGE_KEY = "finledger_notifications";

function getDefaultNotifications() {
    return [
        {
            id: "1",
            type: "info",
            title: "Welcome to Fin Ledger!",
            message: "Start by adding your income and expenses to see AI-powered insights.",
            time: new Date().toISOString(),
            read: false,
        },
        {
            id: "2",
            type: "tip",
            title: "Set Up Your Budget",
            message: "Create budgets per category to track your spending limits.",
            time: new Date(Date.now() - 60000).toISOString(),
            read: false,
        },
        {
            id: "3",
            type: "alert",
            title: "AI Advisor Available",
            message: "Add your Gemini API key in .env to unlock AI-powered financial advice.",
            time: new Date(Date.now() - 120000).toISOString(),
            read: false,
        },
    ];
}

function loadNotifications() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : getDefaultNotifications();
    } catch {
        return getDefaultNotifications();
    }
}

function saveNotifications(notifs) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifs));
}

const typeConfig = {
    info: { icon: LuInfo, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    tip: { icon: LuTrendingUp, color: "text-accent-light", bg: "bg-accent/10", border: "border-accent/20" },
    alert: { icon: LuTriangleAlert, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20" },
};

export default function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState(loadNotifications);
    const dropdownRef = useRef(null);

    const unreadCount = notifications.filter((n) => !n.read).length;

    useEffect(() => { saveNotifications(notifications); }, [notifications]);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const markRead = (id) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const markAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const deleteNotification = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const formatTime = (iso) => {
        const diff = Date.now() - new Date(iso).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return "Just now";
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
    };

    return (
        <div ref={dropdownRef} className="relative">
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-surface-elevated/60 hover:bg-surface-hover border border-border-subtle text-text-secondary hover:text-text-primary transition-all cursor-pointer"
            >
                <LuBell className="text-lg" />
                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-accent text-white text-[10px] font-bold rounded-full border-2 border-surface-card px-1"
                    >
                        {unreadCount}
                    </motion.span>
                )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="absolute top-full right-0 mt-2 w-[360px] max-h-[420px] flex flex-col glass-card shadow-2xl shadow-black/30 overflow-hidden z-50"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
                            <h4 className="text-sm font-semibold text-text-primary">Notifications</h4>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="text-xs text-primary-light hover:text-primary font-medium cursor-pointer flex items-center gap-1"
                                >
                                    <LuCheck size={12} /> Mark all read
                                </button>
                            )}
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="py-12 text-center text-text-muted text-sm">
                                    <LuBell className="text-2xl mx-auto mb-2 opacity-40" />
                                    No notifications
                                </div>
                            ) : (
                                <AnimatePresence>
                                    {notifications.map((n) => {
                                        const config = typeConfig[n.type] || typeConfig.info;
                                        const IconComp = config.icon;
                                        return (
                                            <motion.div
                                                key={n.id}
                                                layout
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20, height: 0 }}
                                                onClick={() => markRead(n.id)}
                                                className={cn(
                                                    "flex gap-3 p-3.5 border-b border-border-subtle/50 cursor-pointer hover:bg-surface-hover/50 transition-colors group",
                                                    !n.read && "bg-primary/[0.03]"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border",
                                                    config.bg, config.border
                                                )}>
                                                    <IconComp className={cn("text-sm", config.color)} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className={cn(
                                                            "text-sm truncate",
                                                            n.read ? "text-text-secondary" : "text-text-primary font-medium"
                                                        )}>
                                                            {n.title}
                                                        </p>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                                                            className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-danger p-0.5 transition-all flex-shrink-0"
                                                        >
                                                            <LuTrash2 size={12} />
                                                        </button>
                                                    </div>
                                                    <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{n.message}</p>
                                                    <p className="text-[10px] text-text-muted/60 mt-1">{formatTime(n.time)}</p>
                                                </div>
                                                {!n.read && (
                                                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
