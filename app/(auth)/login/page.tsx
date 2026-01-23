import { Suspense } from "react";
import LoginPage from "@/components/Auth/LoginPage";

export default function Login(){
    return (
        <Suspense>
            <LoginPage/>
        </Suspense>
    );
}