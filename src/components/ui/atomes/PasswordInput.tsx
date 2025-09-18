"use client";

import * as React from "react";
import {useState} from "react";
import {cn} from "@/lib/utils";
import {Eye, EyeOff} from "lucide-react";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
    ({className, ...props}, ref) => {
        const [showPassword, setShowPassword] = useState(false);

        const togglePasswordVisibility = () => {
            setShowPassword(!showPassword);
        };

        return (
            <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    className={cn(
                        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pr-10",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    tabIndex={-1}
                >
                    {showPassword ? (
                        <EyeOff className="h-4 w-4"/>
                    ) : (
                        <Eye className="h-4 w-4"/>
                    )}
                </button>
            </div>
        );
    }
);

PasswordInput.displayName = "PasswordInput";

export {PasswordInput};