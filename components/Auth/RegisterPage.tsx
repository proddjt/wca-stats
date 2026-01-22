'use client'

import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { FormType } from "@/types";
import useIsLoading from "@/Context/IsLoading/useIsLoading";
import Loader from "../Layout/Loader";
import useUser from "@/Context/User/useUser";
import PasswordInput from "./PasswordInput";
import { Link } from "@heroui/link";
import { pwdSchema } from "@/lib/zod/validation";
import z from "zod";
import PwdRules from "./PwdRules";

export default function RegisterPage(){
    const [form, setForm] = useState<FormType>({email: "", password: "", password_confirm: "", name: ""});
    const [pwdError, setPwdError] = useState<string>("vuoto")

    const {isPending} = useIsLoading();

    const {doSignIn} = useUser();

    const pwdValidation = (value: string) => {
        if (value.length === 0){
            setPwdError("vuoto")
            return null
        }
        else {
            const result = pwdSchema.safeParse(value);
            if (result.success) {
                setPwdError("");
                return null
            }
            else {
                const flat = z.flattenError(result.error);
                setPwdError(flat.formErrors.join(", ") || "Errore nella password");
                return true;
            }
        }
    }

    if (isPending) return <Loader />

    return (
        <div className="grow flex flex-col justify-center items-center">
            <div className="flex flex-col justify-center items-center gap-5 grow lg:w-1/5">
                <h1 className="font-bold text-3xl text-center">Create your account</h1>
                <Input
                label="Full name"
                placeholder="First and last name"
                type="text"
                variant="bordered"
                fullWidth={false}
                value={form.name}
                isInvalid={!form.name || form.name.split(" ").length < 2}
                errorMessage="First and last name required"
                isRequired
                className="w-3/4"
                onChange={(e) => setForm(prev => ({...prev, name: e.target.value}))}
                onKeyDown={(e) => {if (e.key === "Enter") doSignIn(form)}}
                />
                <Input
                label="Email"
                placeholder="Email"
                type="email"
                variant="bordered"
                fullWidth={false}
                value={form.email}
                isRequired
                className="w-3/4"
                onChange={(e) => setForm(prev => ({...prev, email: e.target.value}))}
                onKeyDown={(e) => {if (e.key === "Enter") doSignIn(form)}}
                />
                <PasswordInput
                label="Password"
                placeholder="Password"
                variant="bordered"
                className="w-3/4"
                isInvalid={pwdError !== ""}
                value={form.password}
                onChange={(e) => {
                    pwdValidation(e.target.value);
                    setForm(prev => ({...prev, password: e.target.value}))
                }}
                onKeyDown={(e) => {if (e.key === "Enter") doSignIn(form)}}
                />
                <PwdRules error={pwdError} />
                <PasswordInput
                label="Password confirmation"
                placeholder="Confirm password"
                variant="bordered"
                className="w-3/4"
                isInvalid={form.password !== form.password_confirm}
                errorMessage="Passwords do not match"
                value={form.password_confirm||""}
                onChange={(e) => setForm(prev => ({...prev, password_confirm: e.target.value}))}
                onKeyDown={(e) => {if (e.key === "Enter") doSignIn(form)}}
                />
                <Button
                onPress={() => !pwdError && doSignIn(form)}
                color="primary"
                >
                    Create account
                </Button>
                <p className="text-sm">or <Link className="text-sm" href="/login">log into your account</Link></p>
            </div>
        </div>
    )
}