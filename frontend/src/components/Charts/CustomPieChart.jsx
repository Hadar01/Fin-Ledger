import CustomTooltip from "./CustomTooltip";
import CustomLegend from "./CustomLegend";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

const DARK_COLORS = ['#7c3aed', '#ef4444', '#10b981', '#f59e0b', '#3b82f6'];

export default function CustomPieChart({
    data,
    label,
    totalAmount,
    color,
    showTextAnchor
}) {
    const colors = color || DARK_COLORS;

    return (
        <ResponsiveContainer width="100%" height={380}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="amount"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={130}
                    innerRadius={100}
                    labelLine={false}
                    stroke="rgba(15, 15, 23, 0.5)"
                    strokeWidth={2}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                </Pie>
                <Tooltip content={CustomTooltip} />
                <Legend content={CustomLegend} />

                {showTextAnchor && (
                    <>
                        <text
                            x="50%"
                            y="50%"
                            dy={-25}
                            textAnchor="middle"
                            fill="#94a3b8"
                            fontSize="13px"
                        >
                            {label}
                        </text>
                        <text
                            x="50%"
                            y="50%"
                            dy={8}
                            textAnchor="middle"
                            fill="#f1f5f9"
                            fontSize="24px"
                            fontWeight="600"
                        >
                            {totalAmount}
                        </text>
                    </>
                )}
            </PieChart>
        </ResponsiveContainer>
    );
}
