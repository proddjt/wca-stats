import { useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { User } from "@supabase/supabase-js";
import { showToast } from "@/lib/Toast";
import { createClient } from "@/lib/supabase/client";
import useIsLoading from "../IsLoading/useIsLoading";
import { useRouter } from "next/navigation";
import { getRole, getUser } from "@/app/actions/user";

export default function UserProvider({ children } : { children: React.ReactNode }) {
    const [user, setUser] = useState<{user: User, role: string} | null>(null);

    const {showLoader} = useIsLoading();

    const supabase = createClient();
    const router = useRouter();

    async function login({email, password}: {email: string, password: string}){
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            if (error) throw error.message
            await getUserRole()
            showToast("Success!", "User logged in", "success")
            router.push("/")
        } catch (error) {
            showToast("Attention!", JSON.stringify(error), "danger")
        }
    }

    async function logout(){
        try {
            await supabase.auth.signOut()
            setUser(null)
            showToast("Success!", "User succesfully logged out", "success")
        } catch (error) {
            showToast("Attention!", JSON.stringify(error), "danger")
        }
    }

    async function signIn({email, password} : {email: string, password: string}){
        try{
            const { error } = await supabase.auth.signUp({
                email: email,
                password: password
            });
            if (error) throw error.message
            await getUserRole()
            showToast("Success!", "User logged in", "success")
        }
        catch (error){
            showToast("Attention!", JSON.stringify(error), "danger")
        }
    }

    async function getUserRole(){
        try {
            const user = await getUser()
            if (user){
                const role = await getRole()
                setUser({user, role})
            }
        } catch (error: any) {
            if (error.toString() !== "Error: Auth session missing!") showToast("Attention!", JSON.stringify(error), "danger")
        }
    }

    function doLogout() {
        showLoader(logout)
    }

    function doLogin({email, password}: {email: string, password: string}){
        showLoader(() => login({email, password}))
    }

    function doSignIn({email, password, password_confirm}: {email: string, password: string, password_confirm?: string}){
        if (password !== password_confirm) return showToast("Attention!", "Passwords do not match", "danger")
        showLoader(() => signIn({email, password}))
    }

    useEffect(() => {
        getUserRole()
    }, [])

    return (
        <UserContext.Provider value={{user, doLogin, doLogout, doSignIn}}>
            {children}
        </UserContext.Provider>
    )
}

