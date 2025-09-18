// src/components/ui/alert.tsx
import * as React from "react"
import {cva, VariantProps} from "class-variance-authority"
import {cn} from "@/lib/utils"

// Définir les variantes de l'alerte
const alertVariants = cva(
    "relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:text-foreground [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] [&:has(svg)]:pl-11",
    {
        variants: {
            variant: {
                default: "bg-background text-foreground",
                destructive:
                    "bg-destructive/10 text-destructive border-destructive/20 [&>svg]:text-destructive",
                success:
                    "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 [&>svg]:text-emerald-600",
                warning:
                    "bg-amber-500/10 text-amber-600 border-amber-500/20 [&>svg]:text-amber-600",
                info: "bg-blue-500/10 text-blue-600 border-blue-500/20 [&>svg]:text-blue-600",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

// Props du composant Alert
interface AlertProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof alertVariants> {
}

// Composant Alert
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
    ({className, variant, ...props}, ref) => {
        return (
            <div
                ref={ref}
                className={cn(alertVariants({variant}), className)}
                {...props}
            />
        )
    }
)
Alert.displayName = "Alert"

// Composant AlertDescription
const AlertDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({className, ...props}, ref) => {
    return (
        <div
            ref={ref}
            className={cn("text-sm [&_p]:leading-relaxed", className)}
            {...props}
        />
    )
})
AlertDescription.displayName = "AlertDescription"

export {Alert, AlertDescription}