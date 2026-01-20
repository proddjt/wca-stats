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

export default function RegisterPage(){
    const [form, setForm] = useState<FormType>({email: "", password: "", password_confirm: ""});

    const {isPending} = useIsLoading();

    // const {doSignIn} = useUser();

    const doSignIn = (arg: any) => {}

    if (isPending) return <Loader />

    return (
        <div className="grow flex flex-col justify-center items-center">
            <div className="flex flex-col justify-center items-center gap-5 grow lg:w-1/5">
                <h1 className="font-bold text-3xl text-center">Create your account</h1>
                <Input
                label="Email"
                placeholder="Email"
                type="email"
                variant="bordered"
                fullWidth={false}
                value={form.email}
                className="w-3/4"
                onChange={(e) => setForm(prev => ({...prev, email: e.target.value}))}
                onKeyDown={(e) => {if (e.key === "Enter") doSignIn(form)}}
                />
                <PasswordInput
                label="Password"
                placeholder="Password"
                variant="bordered"
                className="w-3/4"
                value={form.password}
                onChange={(e) => setForm(prev => ({...prev, password: e.target.value}))}
                onKeyDown={(e) => {if (e.key === "Enter") doSignIn(form)}}
                />
                <PasswordInput
                label="Password confirmation"
                placeholder="Confirm password"
                variant="bordered"
                className="w-3/4"
                value={form.password_confirm||""}
                onChange={(e) => setForm(prev => ({...prev, password_confirm: e.target.value}))}
                onKeyDown={(e) => {if (e.key === "Enter") doSignIn(form)}}
                />
                <Button
                onPress={() => doSignIn(form)}
                color="primary"
                >
                    Create account
                </Button>
                <p className="text-sm">or <Link className="text-sm" href="/login">log into your account</Link></p>
            </div>
        </div>
    )
}