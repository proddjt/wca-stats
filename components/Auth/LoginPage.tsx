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

export default function LoginPage(){
    const [form, setForm] = useState<FormType>({email: "", password: ""});

    const {isPending} = useIsLoading();

    // const {doLogin} = useUser();

    const doLogin = (arg: any) => {}

    if (isPending) return <Loader />

    return (
        <div className="flex flex-col justify-center items-center gap-5 grow lg:w-1/2">
            <h1 className="font-bold text-3xl text-center">Login into your account</h1>
            <Input
            label="Email"
            placeholder="Email"
            type="email"
            variant="bordered"
            fullWidth={false}
            className="w-3/4"
            value={form.email}
            onKeyDown={(e) => {if (e.key === "Enter") doLogin(form)}}
            onChange={(e) => setForm(prev => ({...prev, email: e.target.value}))}
            />
            <PasswordInput
            label="Password"
            placeholder="Password"
            variant="bordered"
            className="w-3/4"
            value={form.password}
            onChange={(e) => setForm(prev => ({...prev, password: e.target.value}))}
            onKeyDown={(e) => {if (e.key === "Enter") doLogin(form)}}
            />
            <Button
            onPress={() => doLogin(form)}
            color="primary"
            >
                Login
            </Button>
            <p className="text-sm">or <Link className="text-sm" href="/register">create your account</Link></p>
        </div>
    )
}