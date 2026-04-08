import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LedgerLayout from "../../components/layouts/LedgerLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { LuPlus, LuTrash2, LuTarget, LuTrendingUp, LuPencil } from "react-icons/lu";
import Modal from "../../components/Modal";
import { cn } from "../../utlis/cn";

const BUDGET_KEY = "finledger_budgets";

const CATEGORY_PRESETS = [
    { name: "Food & Dining", emoji: "🍔", color: "#ef4444" },
    { name: "Transportation", emoji: "🚗", color: "#f59e0b" },
    { name: "Entertainment", emoji: "🎬", color: "#8b5cf6" },
    { name: "Shopping", emoji: "🛍️", color: "#ec4899" },
    { name: "Bills & Utilities", emoji: "💡", color: "#3b82f6" },
    { name: "Health", emoji: "🏥", color: "#10b981" },
    { name: "Education", emoji: "📚", color: "#06b6d4" },
    { name: "Travel", emoji: "✈️", color: "#f97316" },
    { name: "Subscriptions", emoji: "📱", color: "#a855f7" },
    { name: "Other", emoji: "📦", color: "#64748b" },
];

const stagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

function loadBudgets() {
    try {
        const raw = localStorage.getItem(BUDGET_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
}

function saveBudgets(budgets) {
    localStorage.setItem(BUDGET_KEY, JSON.stringify(budgets));
}

export default function Budget() {
    useUserAuth();
    const [budgets, setBudgets] = useState(loadBudgets);
    const [modalOpen, setModalOpen] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [form, setForm] = useState({ category: "", limit: "", spent: "" });

    useEffect(() => { saveBudgets(budgets); }, [budgets]);

    const totalBudget = budgets.reduce((s, b) => s + Number(b.limit), 0);
    const totalSpent = budgets.reduce((s, b) => s + Number(b.spent), 0);

    const openAdd = () => { setEditIndex(null); setForm({ category: "", limit: "", spent: "" }); setModalOpen(true); };
    const openEdit = (i) => { setEditIndex(i); setForm({ ...budgets[i] }); setModalOpen(true); };

    const handleSave = () => {
        if (!form.category || !form.limit) return;
        const entry = { ...form, limit: Number(form.limit), spent: Number(form.spent || 0) };
        if (editIndex !== null) {
            const copy = [...budgets];
            copy[editIndex] = entry;
            setBudgets(copy);
        } else {
            setBudgets([...budgets, entry]);
        }
        setModalOpen(false);
    };

    const handleDelete = (i) => { setBudgets(budgets.filter((_, idx) => idx !== i)); };

    const preset = (cat) => CATEGORY_PRESETS.find(p => p.name === cat) || CATEGORY_PRESETS[9];

    return (
        <LedgerLayout activeMenu="Budget">
            <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
                {/* Header */}
                <motion.div variants={fadeUp} className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary">Budget Planner</h1>
                        <p className="text-sm text-text-muted mt-1">Set spending limits and track your progress</p>
                    </div>
                    <button className="add-btn add-btn-fill" onClick={openAdd}>
                        <LuPlus className="text-lg" /> New Budget
                    </button>
                </motion.div>

                {/* Summary Cards */}
                <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <SummaryCard label="Total Budget" value={`$${totalBudget.toLocaleString()}`} icon={<LuTarget />} color="from-primary to-primary-dark" />
                    <SummaryCard label="Total Spent" value={`$${totalSpent.toLocaleString()}`} icon={<LuTrendingUp />} color="from-danger to-red-700" />
                    <SummaryCard
                        label="Remaining"
                        value={`$${(totalBudget - totalSpent).toLocaleString()}`}
                        icon={<LuTarget />}
                        color="from-accent to-accent-dark"
                    />
                </motion.div>

                {/* Budget Items */}
                <motion.div variants={fadeUp} className="space-y-3">
                    <AnimatePresence>
                        {budgets.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="card text-center py-16"
                            >
                                <div className="text-4xl mb-3">🎯</div>
                                <h3 className="text-lg font-semibold text-text-primary mb-1">No budgets yet</h3>
                                <p className="text-sm text-text-muted mb-4">Create your first budget to start tracking spending limits</p>
                                <button className="add-btn add-btn-fill mx-auto" onClick={openAdd}>
                                    <LuPlus /> Create Budget
                                </button>
                            </motion.div>
                        )}
                        {budgets.map((b, i) => {
                            const p = preset(b.category);
                            const pct = b.limit > 0 ? Math.min((b.spent / b.limit) * 100, 100) : 0;
                            const isOver = b.spent > b.limit;

                            return (
                                <motion.div
                                    key={`${b.category}-${i}`}
                                    layout
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -40 }}
                                    className="card group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                                            style={{ backgroundColor: p.color + "20", border: `1px solid ${p.color}30` }}
                                        >
                                            {p.emoji}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-sm font-semibold text-text-primary">{b.category}</h4>
                                                <div className="flex items-center gap-2">
                                                    <span className={cn(
                                                        "text-xs font-semibold px-2 py-0.5 rounded-full",
                                                        isOver ? "text-danger-light bg-danger/10" : "text-accent-light bg-accent/10"
                                                    )}>
                                                        {isOver ? "Over budget!" : `${pct.toFixed(0)}%`}
                                                    </span>
                                                    <button onClick={() => openEdit(i)} className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-primary-light transition-all cursor-pointer p-1 rounded-lg hover:bg-primary/10">
                                                        <LuPencil size={14} />
                                                    </button>
                                                    <button onClick={() => handleDelete(i)} className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-danger transition-all cursor-pointer p-1 rounded-lg hover:bg-danger/10">
                                                        <LuTrash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            {/* Progress bar */}
                                            <div className="h-2.5 rounded-full bg-surface-elevated overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${pct}%` }}
                                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                                    className="h-full rounded-full"
                                                    style={{
                                                        background: isOver
                                                            ? "linear-gradient(90deg, #ef4444, #dc2626)"
                                                            : `linear-gradient(90deg, ${p.color}, ${p.color}cc)`,
                                                    }}
                                                />
                                            </div>
                                            <div className="flex justify-between mt-1.5">
                                                <span className="text-xs text-text-muted">
                                                    Spent: <span className="text-text-secondary font-medium">${Number(b.spent).toLocaleString()}</span>
                                                </span>
                                                <span className="text-xs text-text-muted">
                                                    Limit: <span className="text-text-secondary font-medium">${Number(b.limit).toLocaleString()}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>
            </motion.div>

            {/* Add/Edit Modal */}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editIndex !== null ? "Edit Budget" : "New Budget"}>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-text-secondary">Category</label>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-2">
                            {CATEGORY_PRESETS.map((cat) => (
                                <button
                                    key={cat.name}
                                    onClick={() => setForm({ ...form, category: cat.name })}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer border",
                                        form.category === cat.name
                                            ? "bg-primary/20 border-primary/40 text-primary-light"
                                            : "bg-surface-elevated/50 border-border-subtle text-text-secondary hover:bg-surface-hover"
                                    )}
                                >
                                    <span>{cat.emoji}</span>
                                    <span className="truncate">{cat.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-text-secondary">Budget Limit ($)</label>
                            <div className="input-box !mb-0 !mt-2">
                                <input
                                    type="number"
                                    value={form.limit}
                                    onChange={(e) => setForm({ ...form, limit: e.target.value })}
                                    placeholder="500"
                                    className="w-full bg-transparent outline-none text-text-primary placeholder:text-text-muted"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-text-secondary">Amount Spent ($)</label>
                            <div className="input-box !mb-0 !mt-2">
                                <input
                                    type="number"
                                    value={form.spent}
                                    onChange={(e) => setForm({ ...form, spent: e.target.value })}
                                    placeholder="0"
                                    className="w-full bg-transparent outline-none text-text-primary placeholder:text-text-muted"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button onClick={handleSave} className="add-btn add-btn-fill">
                            {editIndex !== null ? "Save Changes" : "Create Budget"}
                        </button>
                    </div>
                </div>
            </Modal>
        </LedgerLayout>
    );
}

function SummaryCard({ label, value, icon, color }) {
    return (
        <div className="card !p-4">
            <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-sm", color)}>
                    {icon}
                </div>
                <div>
                    <p className="text-xs text-text-muted font-medium uppercase tracking-wider">{label}</p>
                    <p className="text-xl font-bold text-text-primary mt-0.5">{value}</p>
                </div>
            </div>
        </div>
    );
}
