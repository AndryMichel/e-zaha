// src/components/ui/atomes/use-toast.ts
import {useContext} from "react"
import {type ToastProps, ToastProvider} from "./toast"

export function useToast() {
    const context = useContext(ToastProvider)

    if (!context) {
        throw new Error("useToast must be used within a ToastContext")
    }

    return {
        toast: context.toast,
        dismiss: context.dismiss
    }
}

export type {ToastProps}