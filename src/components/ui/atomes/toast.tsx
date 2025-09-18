// src/components/ui/atomes/toast.tsx
import * as React from "react"
import {cva, type VariantProps} from "class-variance-authority"
import {X} from "lucide-react"

import {cn} from "@/lib/utils"

export const ToastProvider = React.createContext<{
    toast: (props: ToastProps) => void;
    dismiss: (id: string) => void;
}>({
    toast: () => {
    },
    dismiss: () => {
    },
})

export interface ToastProps extends VariantProps<typeof toastVariants> {
    id?: string;
    title?: string;
    description?: string;
    action?: React.ReactNode;
    duration?: number;
    onClose?: () => void;
}

const toastVariants = cva(
    "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full",
    {
        variants: {
            variant: {
                default: "border bg-background text-foreground",
                destructive:
                    "destructive group border-destructive bg-destructive text-destructive-foreground",
                success: "border-green-500 bg-green-100 text-green-900",
                warning: "border-yellow-500 bg-yellow-100 text-yellow-900",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

type ToastContextProps = {
    children: React.ReactNode;
}

export function ToastContext({children}: ToastContextProps) {
    const [toasts, setToasts] = React.useState<ToastProps[]>([])
    const dismiss = React.useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, [])

    const toast = React.useCallback((props: ToastProps) => {
        const id = props.id || Math.random().toString(36).substring(2, 9)
        const newToast = {...props, id}

        setToasts((prev) => [...prev, newToast])

        if (props.duration !== 0) {
            setTimeout(() => {
                dismiss(id)
                props.onClose?.()
            }, props.duration || 5000)
        }
    }, [dismiss])


    return (
        <ToastProvider.Provider value={{toast, dismiss}}>
            {children}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={cn(toastVariants({variant: toast.variant}))}
                    >
                        <div className="flex-1">
                            {toast.title && (
                                <div className="font-medium">{toast.title}</div>
                            )}
                            {toast.description && (
                                <div className="mt-1 text-sm opacity-90">{toast.description}</div>
                            )}
                        </div>
                        {toast.action}
                        <button
                            className="absolute top-2 right-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
                            onClick={() => dismiss(toast.id as string)}
                        >
                            <X className="h-4 w-4"/>
                            <span className="sr-only">Close</span>
                        </button>
                    </div>
                ))}
            </div>
        </ToastProvider.Provider>
    )
}

export function Toast({
                          className,
                          variant,
                          ...props
                      }: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof toastVariants>) {
    return (
        <div
            className={cn(toastVariants({variant}), className)}
            {...props}
        />
    )
}

export function ToastTitle({
                               className,
                               ...props
                           }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("text-sm font-semibold", className)} {...props} />
}

export function ToastDescription({
                                     className,
                                     ...props
                                 }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("text-sm opacity-90", className)} {...props} />
}

export function ToastAction({
                                className,
                                ...props
                            }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={cn(
                "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40",
                className
            )}
            {...props}
        />
    )
}