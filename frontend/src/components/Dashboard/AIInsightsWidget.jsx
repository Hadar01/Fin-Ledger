import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuSparkles, LuRefreshCw } from "react-icons/lu";
import { getSmartInsights } from "../../api/geminiService";

export default function AIInsightsWidget({ dashboardData }) {
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [displayedInsights, setDisplayedInsights] = useState([]);

    const fetchInsights = async () => {
        setLoading(true);
        setDisplayedInsights([]);
        try {
            const result = await getSmartInsights(dashboardData);
            setInsights(result);
        } catch (err) {
            console.error("Failed to fetch insights:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInsights();
    }, [dashboardData]);

    // Stagger display of insights
    useEffect(() => {
        if (insights.length === 0) return;
        setDisplayedInsights([]);

        insights.forEach((_, i) => {
            setTimeout(() => {
                setDisplayedInsights(prev => [...prev, insights[i]]);
            }, i * 400);
        });
    }, [insights]);

    return (
        <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                        <LuSparkles className="text-amber-400 text-sm" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-text-primary">AI Insights</h3>
                        <p className="text-xs text-text-muted">Powered by Fin Ledger AI</p>
                    </div>
                </div>
                <button
                    onClick={fetchInsights}
                    disabled={loading}
                    className="card-btn"
                >
                    <LuRefreshCw className={`text-sm ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <AnimatePresence>
                    {displayedInsights.map((insight, i) => (
                        <motion.div
                            key={`${insight.text}-${i}`}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-start gap-3 p-3 rounded-xl bg-surface-elevated/50 border border-border-subtle"
                        >
                            <span className="text-lg flex-shrink-0 mt-0.5">{insight.emoji}</span>
                            <p className="text-sm text-text-secondary leading-relaxed">{insight.text}</p>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {loading && (
                    <div className="col-span-full flex items-center justify-center py-4 gap-2 text-text-muted">
                        <LuSparkles className="animate-pulse text-amber-400" />
                        <span className="text-sm">Analyzing your finances...</span>
                    </div>
                )}
            </div>
        </div>
    );
}
