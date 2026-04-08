import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { UserContext } from "../../context/UserContext";
import { SIDE_MENU_DATA } from "../../utlis/data";
import CharAvatar from "../Cards/CharAvatar";
import AIAdvisorChat from "../AI/AIAdvisorChat";
import NotificationDropdown from "../Notifications/NotificationDropdown";
import { cn } from "../../utlis/cn";
import {
    LuSearch,
    LuMenu,
    LuX,
    LuChevronLeft,
} from "react-icons/lu";

const sidebarVariants = {
    open: { width: 260, transition: { type: "spring", stiffness: 300, damping: 30 } },
    collapsed: { width: 72, transition: { type: "spring", stiffness: 300, damping: 30 } },
};

const menuLabelVariants = {
    open: { opacity: 1, x: 0, display: "block", transition: { delay: 0.1 } },
    collapsed: { opacity: 0, x: -10, display: "none", transition: { duration: 0.1 } },
};

export default function LedgerLayout({ children, activeMenu }) {
    const { user, clearUser } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const handleClick = (route) => {
        if (route === "/logout") {
            handleLogout();
            return;
        }
        navigate(route);
        setMobileSidebarOpen(false);
    };

    const handleLogout = async () => {
        await clearUser();
        localStorage.clear();
        navigate("/login");
    };

    const SidebarContent = ({ isMobile = false }) => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center gap-3 px-5 pt-6 pb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">F</span>
                </div>
                <AnimatePresence>
                    {(!sidebarCollapsed || isMobile) && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.15 }}
                        >
                            <h1 className="text-xl font-bold gradient-text whitespace-nowrap">Fin Ledger</h1>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* User Profile */}
            <div className={cn(
                "flex items-center gap-3 mx-3 mb-6 p-3 rounded-xl bg-surface-elevated/50 border border-border-subtle",
                sidebarCollapsed && !isMobile && "justify-center p-2 mx-2"
            )}>
                <CharAvatar
                    fullName={user?.fullName}
                    width="w-9"
                    height="h-9"
                    style="text-xs"
                />
                <AnimatePresence>
                    {(!sidebarCollapsed || isMobile) && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <p className="text-sm font-medium text-text-primary truncate max-w-[140px]">
                                {user?.fullName || "User"}
                            </p>
                            <p className="text-xs text-text-muted truncate max-w-[140px]">
                                @{user?.username || "user"}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1">
                {SIDE_MENU_DATA.map((item) => {
                    const isActive = activeMenu === item.label;
                    const isLogout = item.label === "Logout";

                    return (
                        <button
                            key={item.id}
                            onClick={() => handleClick(item.path)}
                            className={cn(
                                "w-full flex items-center gap-3 text-sm font-medium cursor-pointer py-3 rounded-xl transition-all duration-200 relative group",
                                sidebarCollapsed && !isMobile ? "px-0 justify-center" : "px-4",
                                isLogout
                                    ? "text-red-400 hover:text-red-300 hover:bg-red-500/10 mt-auto"
                                    : isActive
                                        ? "text-white bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/30"
                                        : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
                            )}
                        >
                            {/* Active indicator pill */}
                            {isActive && !isLogout && (
                                <motion.div
                                    layoutId="activeIndicator"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <item.icon className={cn(
                                "text-lg flex-shrink-0",
                                isActive && !isLogout && "text-primary-light"
                            )} />
                            <AnimatePresence>
                                {(!sidebarCollapsed || isMobile) && (
                                    <motion.span
                                        variants={menuLabelVariants}
                                        initial="collapsed"
                                        animate="open"
                                        exit="collapsed"
                                        className="whitespace-nowrap"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>
                    );
                })}
            </nav>

            {/* Collapse toggle (desktop only) */}
            {!isMobile && (
                <div className="px-3 pb-4 pt-2">
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="w-full flex items-center justify-center gap-2 text-text-muted hover:text-text-secondary py-2 rounded-lg hover:bg-surface-hover transition-all cursor-pointer"
                    >
                        <motion.div
                            animate={{ rotate: sidebarCollapsed ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <LuChevronLeft className="text-lg" />
                        </motion.div>
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <div className="flex h-screen overflow-hidden bg-surface">
            {/* Desktop Sidebar */}
            <motion.aside
                variants={sidebarVariants}
                animate={sidebarCollapsed ? "collapsed" : "open"}
                className="hidden lg:flex flex-col sidebar-gradient border-r border-border-subtle flex-shrink-0 overflow-hidden"
            >
                <SidebarContent />
            </motion.aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {mobileSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                            onClick={() => setMobileSidebarOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed left-0 top-0 h-full w-[260px] sidebar-gradient border-r border-border-subtle z-50 lg:hidden"
                        >
                            <SidebarContent isMobile />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="h-16 flex items-center justify-between px-6 bg-surface-card/50 backdrop-blur-xl border-b border-border-subtle flex-shrink-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden text-text-secondary hover:text-text-primary cursor-pointer"
                            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                        >
                            {mobileSidebarOpen ? <LuX className="text-xl" /> : <LuMenu className="text-xl" />}
                        </button>
                        <div className="hidden sm:flex items-center gap-2 bg-surface-elevated/60 border border-border-subtle rounded-xl px-4 py-2">
                            <LuSearch className="text-text-muted text-sm" />
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                className="bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none w-[200px] lg:w-[280px]"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <NotificationDropdown />
                        <div className="hidden sm:block h-8 w-px bg-border-subtle" />
                        <div className="hidden sm:flex items-center gap-2">
                            <CharAvatar
                                fullName={user?.fullName}
                                width="w-8"
                                height="h-8"
                                style="text-xs"
                            />
                            <span className="text-sm font-medium text-text-primary">
                                {user?.fullName?.split(" ")[0] || "User"}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.2 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            {/* AI Advisor Chatbot — available on all pages */}
            <AIAdvisorChat />
        </div>
    );
}
