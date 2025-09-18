import {cn} from "@/lib/utils";
import {AlertCircle, AlertTriangle, CheckCircle, Info} from "lucide-react";
import {ReactNode} from "react";

interface AlertProps {
    variant?: "default" | "success" | "warning" | "destructive";
    children: ReactNode;
    className?: string;
}

const variantStyles = {
    default: "bg-gray-100 text-gray-700 border-gray-300",
    success: "bg-green-50 text-green-700 border-green-200",
    warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
    destructive: "bg-red-50 text-red-700 border-red-200",
};

const variantIcons = {
    default: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    destructive: AlertCircle,
};

export function Alert({variant = "default", children, className}: AlertProps) {
    const Icon = variantIcons[variant];
    return (
        <div
            className={cn(
                "flex items-center gap-2 p-3 border rounded-md",
                variantStyles[variant],
                className
            )}
        >
            <Icon className="h-4 w-4"/>
            <div>{children}</div>
        </div>
    );
}

export function AlertDescription({children}: { children: ReactNode }) {
    return <div className="text-sm">{children}</div>;
}
