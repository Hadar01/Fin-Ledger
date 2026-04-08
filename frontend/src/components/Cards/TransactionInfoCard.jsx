import {
    LuTrendingUp,
    LuTrendingDown,
    LuTrash2,
    LuCircleDollarSign,
} from "react-icons/lu";
import { cn } from "../../utlis/cn";
import { motion } from "framer-motion";

export default function TransactionInfoCard({ title, icon, date, amount, type, hideDeleteBtn, onDelete }) {

    const isIncome = type === "income";

    return (
        <motion.div
            whileHover={{ scale: 1.01, backgroundColor: "rgba(37, 37, 66, 0.5)" }}
            transition={{ duration: 0.15 }}
            className="group relative flex items-center gap-4 p-3.5 rounded-xl transition-colors"
        >
            <div className={cn(
                "w-11 h-11 flex items-center justify-center text-lg rounded-xl border",
                isIncome
                    ? "bg-accent/10 border-accent/20 text-accent-light"
                    : "bg-danger/10 border-danger/20 text-danger-light"
            )}>
                {icon ? (
                    <img src={icon} alt={title} className="w-5 h-5" />
                ) : (
                    <LuCircleDollarSign />
                )}
            </div>
            <div className="flex-1 flex items-center justify-between min-w-0">
                <div className="min-w-0">
                    <p className="text-sm text-text-primary font-medium truncate">{title}</p>
                    <p className="text-xs text-text-muted mt-0.5">{date}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                    {!hideDeleteBtn && (
                        <button
                            className="text-text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-all cursor-pointer p-1 rounded-lg hover:bg-danger/10"
                            onClick={onDelete}
                        >
                            <LuTrash2 size={16} />
                        </button>
                    )}

                    <div className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg flex-nowrap whitespace-nowrap text-xs font-semibold",
                        isIncome
                            ? "text-accent-light bg-accent/10"
                            : "text-danger-light bg-danger/10"
                    )}>
                        <span>{isIncome ? "+" : "-"} ${amount}</span>
                        {isIncome ? <LuTrendingUp size={14} /> : <LuTrendingDown size={14} />}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}