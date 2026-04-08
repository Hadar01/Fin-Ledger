import { LuPlus } from "react-icons/lu";
import CustomBarChart from "../Charts/CustomBarChart";
import { useEffect, useState } from "react";
import { prepareIncomeBarChartData } from "../../utlis/helper";

export default function IncomeOverview ({ transactions, onAddIncome }) {
    const [charData, setCharData] = useState([]);

    useEffect(() => {
        const result = prepareIncomeBarChartData(transactions);
        setCharData(result);
        return () => {};
    }, [transactions]);

    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <div>
                    <h5 className="text-lg font-semibold text-text-primary">Income Overview</h5>
                    <p className="text-xs text-text-muted mt-1">
                        Track your earnings over time
                    </p>
                </div>
                <button className="add-btn" onClick={onAddIncome}>
                    <LuPlus className="text-lg" /> Add Income
                </button>
            </div>
            <div className="mt-8">
                <CustomBarChart data={charData} />
            </div>
        </div>
    )
}