import { addToast } from "@heroui/toast";

export function showToast(title: string, description: string, color: "default" | "primary" | "secondary" | "success" | "warning" | "danger" = "default"){
    addToast({
        title: title,
        description: description,
        color: color
    })
}