import CustomPieChart from "../Charts/CustomPieChart";

const COLORS = ["#7c3aed", "#ef4444", "#10b981"];

export default function FinanceOverview ({ totalBalance, totalIncome, totalExpense }) {
    
    const balanceData = [
        { name: "Total Balance", amount: totalBalance },
        { name: "Total Expenses", amount: totalExpense },
        { name: "Total Income", amount: totalIncome },
    ];
    
    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg font-semibold text-text-primary">Financial Overview</h5>
            </div>
            <CustomPieChart
                data={balanceData}
                label="Total Balance"
                totalAmount={`$${totalBalance}`}
                colors={COLORS}
                showTextAnchor
            />
        </div>
    )
}