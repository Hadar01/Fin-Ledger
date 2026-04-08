export default function CustomLegend({ payload }) {
    return (
        <div className="flex justify-center gap-4 mt-4 flex-wrap">
            {payload?.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-xs text-text-secondary font-medium">{entry.value}</span>
                </div>
            ))}
        </div>
    );
}