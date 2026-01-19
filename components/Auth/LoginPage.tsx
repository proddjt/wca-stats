'use client'

import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { FormType } from "@/types";
import useIsLoading from "@/Context/IsLoading/useIsLoading";
import Loader from "../Layout/Loader";
import useUser from "@/Context/User/useUser";

export default function LoginPage(){
    const [form, setForm] = useState<FormType>({email: "", password: ""});

    const {isPending} = useIsLoading();

    const {doLogin} = useUser();

    if (isPending) return <Loader />

    return (
        <div className="flex flex-col justify-center items-center gap-5 grow">
            <h1 className="font-bold text-3xl text-center">Login into your account</h1>
            <Input
            label="Email"
            placeholder="Email"
            type="email"
            variant="bordered"
            fullWidth={false}
            value={form.email}
            onChange={(e) => setForm(prev => ({...prev, email: e.target.value}))}
            />
            <Input
            label="Password"
            placeholder="Password"
            type="password"
            variant="bordered"
            fullWidth={false}
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
        </div>
    )
}