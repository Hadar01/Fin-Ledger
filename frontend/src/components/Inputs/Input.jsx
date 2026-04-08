import { useState } from "react"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6"

export default function Input ({value, onChange, placeholder, label, type}) {
    const [showPassword, setShowPassword] = useState(false);
    
    const toggleShowPassword = () => { setShowPassword(!showPassword) }
    return (
        <div>
            <label className="text-sm font-medium text-text-secondary">{label}</label>

            <div className="input-box">
                <input 
                    type={type == 'password' ? showPassword ? 'text' : 'password' : type}
                    placeholder={placeholder}
                    className="w-full bg-transparent outline-none text-text-primary placeholder:text-text-muted"
                    value={value}
                    onChange={(e) => onChange(e)}
                />
                {type === "password" && (
                    <>
                        {showPassword ? (
                            <FaRegEye size={20} className="text-primary-light cursor-pointer" onClick={() => toggleShowPassword()} />
                        ) : (
                            <FaRegEyeSlash size={20} className="text-text-muted cursor-pointer" onClick={() => toggleShowPassword()} />
                        )}
                    </>
                )}
            </div>
        </div>
    )
}