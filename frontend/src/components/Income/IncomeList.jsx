import moment from "moment";
import { LuDownload } from "react-icons/lu";
import TransactionInfoCard from "../Cards/TransactionInfoCard";

export default function IncomeList ({ transactions, onDelete, onDownload }) {
    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg font-semibold text-text-primary">Income Sources</h5>
                <button className="card-btn" onClick={onDownload}>
                    <LuDownload className="text-base" /> Download
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 mt-2">
                {transactions?.map((income) => (
                    <TransactionInfoCard
                        key={income._id}
                        title={income.source}
                        icon={income.icon}
                        date={moment(income.date).format("Do MMM YYYY")}
                        amount={income.amount}
                        type="income"
                        onDelete={() => onDelete(income._id)}
                    />
                ))}
                {(!transactions || transactions.length === 0) && (
                    <div className="col-span-full py-8 text-center text-text-muted text-sm">
                        No income sources yet. Start tracking!
                    </div>
                )}
            </div>
        </div>
    )
}