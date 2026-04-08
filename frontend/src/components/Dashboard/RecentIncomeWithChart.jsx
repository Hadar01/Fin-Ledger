import { useEffect, useState } from "react";
import CustomPieChart from "../Charts/CustomPieChart";

const COLORS = ["#7c3aed", "#ef4444", "#f59e0b", "#3b82f6"];

export default function RecentIncomeWithChart ({ data, totalIncome }) {

    const [charData, setCharData] = useState([]);

    const prepareCharData = () => {
        const dataArr = data?.map((item) => ({
            name: item?.source,
            amount: item?.amount,
        }));

        setCharData(dataArr);
    }

    useEffect(() => {
        prepareCharData();
        return () => {};
    }, [data]);

    const isEmpty = !data || data.length === 0;
    
    return (
        <div className="card">
            {isEmpty ? (
                <div className="py-6 text-center text-text-muted text-sm">
                    No income in the last 60 days
                </div>
            ) : (
                <>
            <div className="flex items-center justify-center">
                <h5 className="text-lg font-semibold text-text-primary">Last 60 Days Income</h5>
            </div>
            <CustomPieChart
                data={charData}
                label="Total Income"
                totalAmount={`$${totalIncome}`}
                showTextAnchor
                colors={COLORS}
            />
            </>
            )}
        </div>
    )
}