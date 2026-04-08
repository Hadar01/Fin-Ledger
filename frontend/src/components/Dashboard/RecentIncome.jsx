import { LuArrowRight } from "react-icons/lu";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import moment from "moment";

export default function RecentIncome ({ transactions, onSeeMore }) {
    const isEmpty = !transactions || transactions.length === 0;

    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg font-semibold text-text-primary">Income</h5>
                <button className="card-btn" onClick={onSeeMore}>
                    See All <LuArrowRight className="text-base" />
                </button>
            </div>
            {isEmpty ? (
                <div className="py-6 text-center text-text-muted text-sm">
                    No recent income
                </div>
            ) : (
            <div className="mt-4">
                {transactions?.slice(0,5)?.map((item) => (
                    <TransactionInfoCard
                        key={item._id}
                        title={item.source}
                        icon={item.icon}
                        date={moment(item.date).format("DD/MM/YYYY")}
                        amount={item.amount}
                        type="income"
                        hideDeleteBtn
                    />
                ))}
            </div>
            )}
        </div>
    )
}