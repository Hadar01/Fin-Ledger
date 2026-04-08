import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from "recharts";

export default function CustomBarChart({ data }) {
    const getBarColor = (index) => {
        return index % 2 === 0 ? "#7c3aed" : "#a78bfa";
    }

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass-card p-3 shadow-xl !border-primary/20">
                    <p className="text-xs font-semibold text-primary-light mb-1">{payload[0].payload.category}</p>
                    <p className="text-sm text-text-secondary">
                        Amount:{" "} <span className="text-sm font-medium text-text-primary">${payload[0].payload.amount}</span>
                    </p>
                </div>
            );
        }
        return null;
    }

    return (
        <div className="mt-6">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid stroke="rgba(124, 58, 237, 0.06)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} stroke="none" />
                    <YAxis tick={{ fontSize: 12, fill: "#64748b" }} stroke="none" />
                    <Tooltip content={CustomTooltip} />
                    <Bar dataKey="amount" fill="#7c3aed" radius={[8, 8, 0, 0]} >
                        {data.map((entry, index) => (
                            <Cell key={index} fill={getBarColor(index)} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}