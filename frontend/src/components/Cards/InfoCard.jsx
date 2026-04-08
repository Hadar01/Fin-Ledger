import TiltCard from "./TiltCard";
import { cn } from "../../utlis/cn";
import { LineChart, Line, ResponsiveContainer } from "recharts";

// Generate fake sparkline data
const generateSparkline = (trend = "up") => {
    const base = trend === "up" ? 30 : 70;
    const dir = trend === "up" ? 1 : -1;
    return Array.from({ length: 8 }, (_, i) => ({
        v: base + dir * i * 5 + Math.random() * 15,
    }));
};

export default function InfoCard({ icon, label, value, color, glowColor = "purple", trend = "up" }) {
    const sparkData = generateSparkline(trend);
    const sparkColor = trend === "up" ? "#10b981" : "#ef4444";

    return (
        <TiltCard glowColor={glowColor}>
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div
                        className={cn(
                            "w-12 h-12 flex items-center justify-center text-xl text-white rounded-2xl shadow-lg",
                            color
                        )}
                    >
                        {icon}
                    </div>
                    <div>
                        <p className="text-xs text-text-muted font-medium uppercase tracking-wider">
                            {label}
                        </p>
                        <h3 className="text-2xl font-bold text-text-primary mt-1">
                            ${value}
                        </h3>
                    </div>
                </div>

                {/* Sparkline */}
                <div className="w-20 h-10 mt-1">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sparkData}>
                            <Line
                                type="monotone"
                                dataKey="v"
                                stroke={sparkColor}
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Trend indicator */}
            <div className="mt-4 flex items-center gap-2">
                <span
                    className={cn(
                        "text-xs font-semibold px-2 py-0.5 rounded-full",
                        trend === "up"
                            ? "text-accent-light bg-accent/10"
                            : "text-danger-light bg-danger/10"
                    )}
                >
                    {trend === "up" ? "↑ 12.5%" : "↓ 3.2%"}
                </span>
                <span className="text-xs text-text-muted">vs last month</span>
            </div>
        </TiltCard>
    );
}