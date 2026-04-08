import { LuPlus } from "react-icons/lu";
import { prepareExpenseLineChartData } from "../../utlis/helper";
import { useEffect, useState } from "react";
import CustomLineChart from "../Charts/CustomLineChart";

export default function ExpenseOverview ({ transactions, onExpenseIncome }) {
    const [charData, setCharData] = useState([]);

    useEffect(() => {
        const result= prepareExpenseLineChartData(transactions);
        setCharData(result);
        return () => {};
    }, [transactions]);

    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <div>
                    <h5 className="text-lg font-semibold text-text-primary">Expense Overview</h5>
                    <p className="text-xs text-text-muted mt-1">Track your spending trends over time</p>
                </div>
                <button className="add-btn" onClick={onExpenseIncome}>
                    <LuPlus className="text-lg" /> Add Expense
                </button>
            </div>
            <div className="mt-8">
                <CustomLineChart data={charData} />
            </div>
        </div>
    )
        
}