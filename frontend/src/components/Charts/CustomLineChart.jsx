import {
    XAxis, YAxis, Tooltip, ResponsiveContainer,
    CartesianGrid, Area, AreaChart
} from "recharts";

export default function CustomLineChart({ data }) {
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload?.length) {
            return (
                <div className="glass-card p-3 shadow-xl !border-primary/20">
                    <p className="text-xs font-semibold text-primary-light mb-1">{payload[0].payload.category}</p>
                    <p className="text-sm text-text-secondary">
                        Amount: <span className="text-sm font-medium text-text-primary">${payload[0].payload.amount}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="ledgerGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                            <stop offset="50%" stopColor="#10b981" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid stroke="rgba(124, 58, 237, 0.06)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} stroke="none" />
                    <YAxis tick={{ fontSize: 12, fill: "#64748b" }} stroke="none" />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#7c3aed"
                        fill="url(#ledgerGradient)"
                        strokeWidth={2.5}
                        dot={{ r: 3, fill: "#a78bfa", stroke: "#7c3aed", strokeWidth: 1.5 }}
                        activeDot={{ r: 5, fill: "#7c3aed", stroke: "#a78bfa", strokeWidth: 2 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
