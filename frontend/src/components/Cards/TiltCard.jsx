import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "../../utlis/cn";

export default function TiltCard({ children, className, glowColor = "purple" }) {
    const ref = useRef(null);
    const x = useMotionValue(0.5);
    const y = useMotionValue(0.5);

    const rotateX = useSpring(useTransform(y, [0, 1], [8, -8]), { stiffness: 300, damping: 30 });
    const rotateY = useSpring(useTransform(x, [0, 1], [-8, 8]), { stiffness: 300, damping: 30 });

    const glowX = useTransform(x, [0, 1], [0, 100]);
    const glowY = useTransform(y, [0, 1], [0, 100]);

    const handleMouse = (e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set((e.clientX - rect.left) / rect.width);
        y.set((e.clientY - rect.top) / rect.height);
    };

    const handleMouseLeave = () => {
        x.set(0.5);
        y.set(0.5);
    };

    const glowColors = {
        purple: "rgba(124, 58, 237, 0.12)",
        green: "rgba(16, 185, 129, 0.12)",
        red: "rgba(239, 68, 68, 0.12)",
        amber: "rgba(245, 158, 11, 0.12)",
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
                perspective: 1000,
            }}
            className={cn(
                "relative glass-card p-6 cursor-pointer group overflow-hidden",
                className
            )}
        >
            {/* Glow spotlight that follows cursor */}
            <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                style={{
                    background: useTransform(
                        [glowX, glowY],
                        ([gx, gy]) =>
                            `radial-gradient(circle at ${gx}% ${gy}%, ${glowColors[glowColor] || glowColors.purple}, transparent 60%)`
                    ),
                }}
            />
            {/* Content */}
            <div style={{ transform: "translateZ(20px)" }} className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}
