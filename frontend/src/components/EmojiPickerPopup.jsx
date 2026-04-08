import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import { LuImage, LuX } from "react-icons/lu";


export default function EmojiPickerPopup ({ icon, onSelect }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex flex-col md:flex-row items-start gap-5 mb-6">
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => setIsOpen(true)}>
                <div className="w-12 h-12 flex items-center justify-center text-2xl bg-primary/10 text-primary-light rounded-xl border border-primary/20">
                    {icon ? (
                        <img src={icon} alt="Icon" className="w-6 h-6" /> 
                    ) : (
                        <LuImage />
                    )}
                </div>
                <p className="text-sm text-text-secondary hover:text-primary-light transition-colors">{icon ? "Change Icon" : "Pick Icon"}</p>
            </div>
            {isOpen && (
                <div className="relative">
                    <button 
                        className="w-7 h-7 flex items-center justify-center bg-surface-card border border-border-subtle rounded-full absolute -top-2 -right-2 z-10 cursor-pointer text-text-muted hover:text-text-primary transition-colors" 
                        onClick={() => setIsOpen(false)}
                    >
                        <LuX />
                    </button>
                    <EmojiPicker
                        open={isOpen}
                        onEmojiClick={(emoji) => onSelect(emoji?.imageUrl || "")}
                        theme="dark"
                    />
                </div>
            )}
        </div>
    )
}