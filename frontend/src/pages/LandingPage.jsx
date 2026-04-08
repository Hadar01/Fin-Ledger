import { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Link } from "react-router-dom";
import {
    LuArrowRight,
    LuChartBar,
    LuShieldCheck,
    LuSparkles,
    LuWallet,
    LuTrendingUp,
    LuTarget,
    LuZap,
} from "react-icons/lu";

/* ── Magnetic Button ── */
function MagneticButton({ children, className, ...props }) {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 200, damping: 20 });
    const springY = useSpring(y, { stiffness: 200, damping: 20 });

    const handleMove = (e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set((e.clientX - rect.left - rect.width / 2) * 0.3);
        y.set((e.clientY - rect.top - rect.height / 2) * 0.3);
    };
    const handleLeave = () => { x.set(0); y.set(0); };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            style={{ x: springX, y: springY }}
            className="inline-block"
        >
            <Link className={className} {...props}>{children}</Link>
        </motion.div>
    );
}

/* ── Floating particle ── */
function Particle({ size, x, y, delay, duration, color }) {
    return (
        <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{ width: size, height: size, left: x, top: y, background: color }}
            animate={{
                y: [0, -30, 0],
                opacity: [0, 0.6, 0],
                scale: [0.8, 1.2, 0.8],
            }}
            transition={{ repeat: Infinity, duration, delay, ease: "easeInOut" }}
        />
    );
}

/* ── Feature Card ── */
function FeatureCard({ icon: Icon, title, description, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(124,58,237,0.15)" }}
            className="relative p-6 rounded-2xl bg-[#1a1a2e]/70 backdrop-blur-xl border border-[rgba(124,58,237,0.15)] group cursor-default overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7c3aed]/20 to-[#10b981]/10 flex items-center justify-center mb-4 border border-[rgba(124,58,237,0.2)]">
                    <Icon className="text-xl text-[#a78bfa]" />
                </div>
                <h3 className="text-lg font-semibold text-[#f1f5f9] mb-2">{title}</h3>
                <p className="text-sm text-[#94a3b8] leading-relaxed">{description}</p>
            </div>
        </motion.div>
    );
}

/* ── Stat Counter ── */
function StatCounter({ value, suffix, label, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className="text-center"
        >
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#a78bfa] to-[#10b981] bg-clip-text text-transparent">
                {value}{suffix}
            </div>
            <p className="text-sm text-[#64748b] mt-1">{label}</p>
        </motion.div>
    );
}

/* ── MAIN LANDING PAGE ── */
export default function LandingPage() {
    const [hoveredFeature, setHoveredFeature] = useState(null);

    const particles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        size: Math.random() * 4 + 2,
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        delay: Math.random() * 4,
        duration: Math.random() * 4 + 4,
        color: i % 3 === 0
            ? "rgba(124,58,237,0.3)"
            : i % 3 === 1
                ? "rgba(16,185,129,0.3)"
                : "rgba(167,139,250,0.2)",
    }));

    return (
        <div className="min-h-screen bg-[#0f0f17] text-[#f1f5f9] overflow-hidden">
            {/* ═══════════ NAV ═══════════ */}
            <motion.nav
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0f0f17]/60 border-b border-[rgba(124,58,237,0.1)]"
            >
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#10b981] flex items-center justify-center">
                            <span className="text-white font-bold text-sm">F</span>
                        </div>
                        <span className="text-lg font-bold bg-gradient-to-r from-[#a78bfa] via-[#7c3aed] to-[#10b981] bg-clip-text text-transparent">
                            Fin Ledger
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            to="/login"
                            className="text-sm font-medium text-[#94a3b8] hover:text-[#f1f5f9] transition-colors px-4 py-2"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/signUp"
                            className="text-sm font-semibold text-white bg-gradient-to-r from-[#7c3aed] to-[#5b21b6] px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-[#7c3aed]/25 transition-all hover:scale-105 active:scale-95"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </motion.nav>

            {/* ═══════════ HERO ═══════════ */}
            <section className="relative min-h-screen flex items-center justify-center pt-16">
                {/* Particles */}
                {particles.map((p) => <Particle key={p.id} {...p} />)}

                {/* Gradient orbs */}
                <div className="absolute w-[600px] h-[600px] rounded-full bg-[#7c3aed]/8 blur-[120px] top-1/4 -left-40 pointer-events-none" />
                <div className="absolute w-[500px] h-[500px] rounded-full bg-[#10b981]/6 blur-[100px] bottom-1/4 -right-40 pointer-events-none" />
                <div className="absolute w-[300px] h-[300px] rounded-full bg-[#a78bfa]/10 blur-[80px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7c3aed]/10 border border-[#7c3aed]/20 text-[#a78bfa] text-sm font-medium mb-8"
                    >
                        <LuZap className="text-sm" />
                        AI-Powered Financial Intelligence
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6"
                    >
                        <span className="block">Master Your</span>
                        <span className="block bg-gradient-to-r from-[#a78bfa] via-[#7c3aed] to-[#10b981] bg-clip-text text-transparent">
                            Financial Future
                        </span>
                    </motion.h1>

                    {/* Sub */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="text-lg md:text-xl text-[#94a3b8] max-w-2xl mx-auto mb-10 leading-relaxed"
                    >
                        Track expenses, analyze spending patterns, set budgets, and get
                        AI-powered insights — all in one beautifully crafted platform.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.65, duration: 0.5 }}
                        className="flex items-center justify-center gap-4 flex-wrap"
                    >
                        <MagneticButton
                            to="/signUp"
                            className="inline-flex items-center gap-2 text-base font-semibold text-white bg-gradient-to-r from-[#7c3aed] to-[#5b21b6] px-8 py-4 rounded-2xl shadow-xl shadow-[#7c3aed]/30 hover:shadow-[#7c3aed]/50 transition-shadow"
                        >
                            Start Free <LuArrowRight />
                        </MagneticButton>
                        <MagneticButton
                            to="/login"
                            className="inline-flex items-center gap-2 text-base font-semibold text-[#a78bfa] bg-[#7c3aed]/10 border border-[#7c3aed]/20 px-8 py-4 rounded-2xl hover:bg-[#7c3aed]/15 transition-all"
                        >
                            Sign In
                        </MagneticButton>
                    </motion.div>

                    {/* Animated dashboard preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 60, rotateX: 15 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        transition={{ delay: 0.9, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="mt-16 mx-auto max-w-3xl"
                        style={{ perspective: 1200 }}
                    >
                        <div className="relative rounded-2xl overflow-hidden border border-[rgba(124,58,237,0.2)] shadow-2xl shadow-[#7c3aed]/10">
                            {/* Mock dashboard preview */}
                            <div className="bg-[#1a1a2e]/90 backdrop-blur-xl p-6">
                                {/* Top bar mock */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
                                        <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                                        <div className="w-3 h-3 rounded-full bg-[#10b981]" />
                                    </div>
                                    <div className="h-5 w-48 bg-[#252542] rounded-full" />
                                    <div className="w-6 h-6 rounded-full bg-[#252542]" />
                                </div>

                                {/* Stat cards mock */}
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    {[
                                        { label: "Balance", value: "$24,563", color: "#7c3aed" },
                                        { label: "Income", value: "$8,240", color: "#10b981" },
                                        { label: "Expenses", value: "$3,120", color: "#ef4444" },
                                    ].map((card, i) => (
                                        <motion.div
                                            key={card.label}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 1.2 + i * 0.15, duration: 0.4 }}
                                            className="p-4 rounded-xl border border-[rgba(124,58,237,0.12)]"
                                            style={{ backgroundColor: "rgba(37,37,66,0.5)" }}
                                        >
                                            <p className="text-[10px] uppercase tracking-wider text-[#64748b] mb-1">{card.label}</p>
                                            <p className="text-lg font-bold text-[#f1f5f9]">{card.value}</p>
                                            <div className="flex items-end gap-0.5 h-6 mt-2">
                                                {Array.from({ length: 7 }, (_, j) => (
                                                    <motion.div
                                                        key={j}
                                                        initial={{ height: 0 }}
                                                        animate={{ height: `${30 + Math.random() * 70}%` }}
                                                        transition={{ delay: 1.4 + i * 0.15 + j * 0.05, duration: 0.3 }}
                                                        className="flex-1 rounded-sm"
                                                        style={{ backgroundColor: card.color + "60" }}
                                                    />
                                                ))}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Chart area mock */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.6, duration: 0.5 }}
                                    className="h-32 rounded-xl border border-[rgba(124,58,237,0.1)] flex items-end px-4 pb-4 gap-2"
                                    style={{ backgroundColor: "rgba(37,37,66,0.3)" }}
                                >
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${20 + Math.random() * 80}%` }}
                                            transition={{ delay: 1.8 + i * 0.06, duration: 0.4, ease: "easeOut" }}
                                            className="flex-1 rounded-t-md bg-gradient-to-t from-[#7c3aed]/40 to-[#7c3aed]/20"
                                        />
                                    ))}
                                </motion.div>
                            </div>

                            {/* Gradient overlay */}
                            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0f0f17] to-transparent pointer-events-none" />
                        </div>
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="w-6 h-10 rounded-full border-2 border-[#64748b]/40 flex items-start justify-center pt-2"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-[#a78bfa]" />
                    </motion.div>
                </motion.div>
            </section>

            {/* ═══════════ STATS ═══════════ */}
            <section className="py-20 border-y border-[rgba(124,58,237,0.08)]">
                <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                    <StatCounter value="10K" suffix="+" label="Active Users" delay={0} />
                    <StatCounter value="$2M" suffix="+" label="Tracked Monthly" delay={0.1} />
                    <StatCounter value="99.9" suffix="%" label="Uptime" delay={0.2} />
                    <StatCounter value="4.9" suffix="/5" label="User Rating" delay={0.3} />
                </div>
            </section>

            {/* ═══════════ FEATURES ═══════════ */}
            <section className="py-24">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-sm font-medium text-[#a78bfa] uppercase tracking-widest">Features</span>
                        <h2 className="text-3xl md:text-4xl font-bold mt-3">
                            Everything You Need to{" "}
                            <span className="bg-gradient-to-r from-[#a78bfa] to-[#10b981] bg-clip-text text-transparent">
                                Thrive Financially
                            </span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        <FeatureCard icon={LuWallet} title="Smart Expense Tracking" description="Categorize and track every transaction automatically with intelligent tagging and real-time updates." delay={0} />
                        <FeatureCard icon={LuChartBar} title="Visual Analytics" description="Beautiful charts and graphs that make understanding your finances intuitive and actionable." delay={0.1} />
                        <FeatureCard icon={LuSparkles} title="AI Financial Advisor" description="Get personalized spending insights and advice powered by Google Gemini AI technology." delay={0.2} />
                        <FeatureCard icon={LuTarget} title="Budget Planner" description="Set spending limits per category and track your progress with animated visual indicators." delay={0.3} />
                        <FeatureCard icon={LuTrendingUp} title="Income Management" description="Track multiple income sources, analyze trends, and download detailed reports." delay={0.4} />
                        <FeatureCard icon={LuShieldCheck} title="Secure & Private" description="Bank-grade encryption. Your financial data stays private and protected at all times." delay={0.5} />
                    </div>
                </div>
            </section>

            {/* ═══════════ CTA ═══════════ */}
            <section className="py-24 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#7c3aed]/5 to-transparent pointer-events-none" />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative z-10 max-w-3xl mx-auto text-center px-6"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-5">
                        Ready to Take Control?
                    </h2>
                    <p className="text-lg text-[#94a3b8] mb-8 max-w-xl mx-auto">
                        Join thousands of users who have transformed their financial habits with Fin Ledger.
                    </p>
                    <MagneticButton
                        to="/signUp"
                        className="inline-flex items-center gap-2 text-lg font-semibold text-white bg-gradient-to-r from-[#7c3aed] to-[#5b21b6] px-10 py-5 rounded-2xl shadow-xl shadow-[#7c3aed]/30 hover:shadow-[#7c3aed]/50 transition-shadow"
                    >
                        Get Started Free <LuArrowRight />
                    </MagneticButton>
                </motion.div>
            </section>

            {/* ═══════════ FOOTER ═══════════ */}
            <footer className="border-t border-[rgba(124,58,237,0.08)] py-8">
                <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#10b981] flex items-center justify-center">
                            <span className="text-white font-bold text-xs">F</span>
                        </div>
                        <span className="text-sm font-semibold text-[#64748b]">Fin Ledger</span>
                    </div>
                    <p className="text-xs text-[#64748b]">© 2026 Fin Ledger. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
