import { motion } from "framer-motion";

export default function AuthLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-surface">
            {/* Left — Form Side */}
            <div className="w-full lg:w-[55%] flex flex-col px-8 md:px-16 pt-8 pb-12">
                {/* Brand */}
                <div className="flex items-center gap-3 mb-12">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">F</span>
                    </div>
                    <h1 className="text-xl font-bold gradient-text">Fin Ledger</h1>
                </div>

                {/* Form Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex-1 flex items-center"
                >
                    {children}
                </motion.div>
            </div>

            {/* Right — Visual Side (Desktop) */}
            <div className="hidden lg:flex w-[45%] relative overflow-hidden items-center justify-center">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-surface-card to-accent/10" />

                {/* Floating orbs */}
                <div className="absolute w-72 h-72 rounded-full bg-primary/10 blur-3xl top-10 -left-20 animate-float" />
                <div className="absolute w-96 h-96 rounded-full bg-accent/8 blur-3xl bottom-10 -right-20 animate-float-delayed" />
                <div className="absolute w-48 h-48 rounded-full bg-primary/15 blur-2xl top-1/2 left-1/3 animate-float" />

                {/* Content */}
                <div className="relative z-10 px-12 text-center">
                    {/* Stats card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30, rotateX: 15 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="glass-card p-8 mb-8 max-w-sm mx-auto"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                                <span className="text-2xl">💰</span>
                            </div>
                            <div className="text-left">
                                <p className="text-xs text-text-muted">Total Balance</p>
                                <p className="text-2xl font-bold text-text-primary">$24,563</p>
                            </div>
                        </div>

                        {/* Mini chart bars */}
                        <div className="flex items-end gap-1.5 h-16 mb-4">
                            {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map((h, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ duration: 0.5, delay: 0.3 + i * 0.05 }}
                                    className="flex-1 rounded-sm bg-gradient-to-t from-primary/60 to-primary-light/40"
                                />
                            ))}
                        </div>

                        <div className="flex justify-between text-xs">
                            <span className="text-accent-light font-medium">↑ 12.5% this month</span>
                            <span className="text-text-muted">vs last month</span>
                        </div>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-2xl font-bold text-text-primary mb-3"
                    >
                        Smart Financial Tracking
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-sm text-text-secondary max-w-xs mx-auto"
                    >
                        Track expenses, analyze spending patterns, and make informed financial decisions with AI-powered insights.
                    </motion.p>
                </div>
            </div>
        </div>
    );
}