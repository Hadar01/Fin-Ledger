import moment from "moment";
import { LuDownload } from "react-icons/lu";
import TransactionInfoCard from "../Cards/TransactionInfoCard";

export default function ExpenseList ({ transactions, onDelete, onDownload }) {
    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg font-semibold text-text-primary">All Expenses</h5>

                <button className="card-btn" onClick={onDownload}>
                    <LuDownload className="text-base" /> Download
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 mt-2">
                {transactions?.map((expense) => (
                    <TransactionInfoCard
                        key={expense._id}
                        title={expense.category}
                        icon={expense.icon}
                        date={moment(expense.date).format("Do MMM YYYY")}
                        amount={expense.amount}
                        type="expense"
                        onDelete={() => onDelete(expense._id)}
                    />
                ))}
                {(!transactions || transactions.length === 0) && (
                    <div className="col-span-full py-8 text-center text-text-muted text-sm">
                        No expenses yet. Start adding your spending!
                    </div>
                )}
            </div>
        </div>
    )
}