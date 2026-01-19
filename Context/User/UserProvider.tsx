import { useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { User } from "@supabase/supabase-js";
import { showToast } from "@/lib/Toast";
import { createClient } from "@/lib/supabase/client";
import useIsLoading from "../IsLoading/useIsLoading";

export default function UserProvider({ children } : { children: React.ReactNode }) {
    const [user, setUser] = useState<{user: User, role: string} | null>(null);

    const {showLoader} = useIsLoading();

    const supabase = createClient();

    async function login({email, password}: {email: string, password: string}){
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            if (error) throw error.message
            await getUser()
            showToast("Success!", "User logged in", "success")
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
            await getUser()
            showToast("Success!", "User logged in", "success")
        }
        catch (error){
            showToast("Attention!", JSON.stringify(error), "danger")
        }
    }

    async function getUser(){
        try {
            const { data: { user }, error } = await supabase.auth.getUser();
            
            if (error) throw error.message
            if (user){
                const { data: role, error: role_error } = await supabase
                .from("auth_roles")
                .select("role")
                .eq("email", user?.email)
                if (role_error) throw role_error.message
                if (role[0]?.role === "admin") setUser({user, role: "admin"})
                else setUser({user, role: "user"})
            }
        } catch (error) {
            if (error !== "Auth session missing!") showToast("Attention!", JSON.stringify(error), "danger")
        }
    }

    function doLogout() {
        showLoader(logout)
    }

    function doLogin({email, password}: {email: string, password: string}){
        showLoader(() => login({email, password}))
    }

    function doSignIn({email, password}: {email: string, password: string}){
        showLoader(() => signIn({email, password}))
    }

    useEffect(() => {
        getUser()
    }, [])

    return (
        <UserContext.Provider value={{user, doLogin, doLogout, doSignIn, getUser}}>
            {children}
        </UserContext.Provider>
    )
}

