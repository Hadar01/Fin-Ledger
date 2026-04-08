import { getInitials } from "../../utlis/helper";
import { cn } from "../../utlis/cn";

export default function CharAvatar({ fullName, width, height, style }) {
    return (
        <div
            className={cn(
                "flex items-center justify-center rounded-full font-semibold bg-gradient-to-br from-primary/30 to-accent/20 text-primary-light border border-primary/20",
                width || "w-12",
                height || "h-12",
                style
            )}
        >
            {getInitials(fullName || "")}
        </div>
    );
}