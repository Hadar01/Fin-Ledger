import { useEffect, useState } from "react"
import { prepareExpenseBarChartData } from "../../utlis/helper";
import CustomBarChart from "../Charts/CustomBarChart";

export default function Previous30DaysTransactions ({ data }){
    
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const result = prepareExpenseBarChartData(data);
        setChartData(result);
    }, [data]);

    const isEmpty = !data || data.length === 0;
    
    return (
        <div className="card col-span-1">
            {isEmpty ? (
                <div className="py-6 text-center text-text-muted text-sm">
                    No expenses in the last 30 days
                </div>
            ) : (
            <>
                <div className="flex items-center justify-between">
                    <h5 className="text-lg font-semibold text-text-primary">Last 30 Days Expenses</h5>
                </div>
                <CustomBarChart data={chartData} />
            </>
            )}
        </div>
    )
}