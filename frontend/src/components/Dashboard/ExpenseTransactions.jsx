import { LuArrowRight } from "react-icons/lu";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import moment from "moment";

export default function ExpenseTransactions ({ transactions, onSeeMore }) {
    const isEmpty = !transactions || transactions.length === 0;

    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg font-semibold text-text-primary">Expenses</h5>
                <button className="card-btn" onClick={onSeeMore}>
                    See All <LuArrowRight className="text-base" />
                </button>
            </div>
            {isEmpty ? (
                <div className="py-6 text-center text-text-muted text-sm">
                    No recent expenses
                </div>
            ) : (
            <div className="mt-4">
                {transactions?.slice(0,5)?.map((expense) => (
                <TransactionInfoCard
                    key={expense._id}
                    title={expense.category}
                    icon={expense.icon}
                    date={moment(expense.date).format("DD/MM/YYYY")}
                    amount={expense.amount}
                    type="expense"
                    hideDeleteBtn
                />
                ))}
            </div>
            )}
        </div>
    )
}