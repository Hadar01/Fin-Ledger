export default function CustomTooltip({ active, payload }) {
    if (active && payload && payload.length) {
        return (
            <div className="glass-card p-3 shadow-xl !border-primary/20 min-w-[120px]">
                <p className="text-xs font-semibold text-primary-light mb-1">{payload[0].name}</p>
                <p className="text-sm text-text-secondary">
                    <span className="font-medium text-text-primary">${payload[0].value}</span>
                </p>
            </div>
        );
    }
    return null;
}