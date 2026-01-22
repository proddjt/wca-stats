import { useState } from "react";
import { Input } from "@heroui/input";

import { MdVisibility } from "react-icons/md";
import { MdVisibilityOff } from "react-icons/md";


export default function PasswordInput({
    label,
    placeholder,
    variant,
    fullWidth = false,
    value,
    className,
    isInvalid,
    errorMessage,
    onChange,
    onKeyDown,
} : {
    label: string,
    placeholder: string,
    variant: "bordered" | "faded" | "flat" | "underlined" | undefined,
    fullWidth?: boolean,
    value: string,
    className?: string,
    isInvalid?: boolean,
    errorMessage?: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
}){
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
        <Input
        label={label}
        placeholder={placeholder}
        type={isVisible ? "text" : "password"}
        endContent={
            isVisible ?
            <MdVisibility className="cursor-pointer" onClick={toggleVisibility}/>
            :
            <MdVisibilityOff className="cursor-pointer" onClick={toggleVisibility}/>
        }
        className={className}
        isRequired
        isInvalid={isInvalid}
        errorMessage={errorMessage}
        variant={variant}
        fullWidth={fullWidth}
        value={value}
        onChange={(e) => onChange(e)}
        onKeyDown={(e) => onKeyDown(e)}
        />
    )
}