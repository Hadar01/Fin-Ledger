import { useRef, useState, useEffect } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import { cn } from "../../utlis/cn";

export default function HoverCarousel({ children, className }) {
    const containerRef = useRef(null);
    const scrollRef = useRef(null);
    const [hoverZone, setHoverZone] = useState(null); // "left" | "right" | null
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const speed = 3;

    const updateScrollState = () => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 2);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        updateScrollState();
        el.addEventListener("scroll", updateScrollState);
        return () => el.removeEventListener("scroll", updateScrollState);
    }, [children]);

    useAnimationFrame(() => {
        const el = scrollRef.current;
        if (!el || !hoverZone) return;
        if (hoverZone === "left" && canScrollLeft) {
            el.scrollLeft -= speed;
        } else if (hoverZone === "right" && canScrollRight) {
            el.scrollLeft += speed;
        }
    });

    const handleMouseMove = (e) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = e.clientX - rect.left;
        const zoneWidth = rect.width * 0.15;

        if (x < zoneWidth) {
            setHoverZone("left");
        } else if (x > rect.width - zoneWidth) {
            setHoverZone("right");
        } else {
            setHoverZone(null);
        }
    };

    return (
        <div
            ref={containerRef}
            className={cn("relative group", className)}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoverZone(null)}
        >
            {/* Left fade */}
            <div
                className={cn(
                    "absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none transition-opacity duration-300",
                    "bg-gradient-to-r from-surface to-transparent",
                    canScrollLeft ? "opacity-100" : "opacity-0"
                )}
            />

            {/* Right fade */}
            <div
                className={cn(
                    "absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none transition-opacity duration-300",
                    "bg-gradient-to-l from-surface to-transparent",
                    canScrollRight ? "opacity-100" : "opacity-0"
                )}
            />

            {/* Scroll indicator arrows */}
            {canScrollLeft && hoverZone === "left" && (
                <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-surface-card/80 border border-border-subtle flex items-center justify-center text-primary-light pointer-events-none"
                >
                    ‹
                </motion.div>
            )}
            {canScrollRight && hoverZone === "right" && (
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-surface-card/80 border border-border-subtle flex items-center justify-center text-primary-light pointer-events-none"
                >
                    ›
                </motion.div>
            )}

            {/* Scrollable content */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide py-2 px-1"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {children}
            </div>
        </div>
    );
}
