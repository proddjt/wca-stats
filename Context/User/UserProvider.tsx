import { useEffect, useRef } from "react";
import { UserContext } from "./UserContext";
import { showToast } from "@/lib/Toast";
import { createClient } from "@/lib/supabase/client";
import useIsLoading from "../IsLoading/useIsLoading";
import { useRouter } from "next/navigation";
import { FormType } from "@/types";

export default function UserProvider({ children } : { children: React.ReactNode }) {
    const user_role = useRef<string>("");
    const isUser = useRef<boolean>(false);

    const {showLoader} = useIsLoading();

    const supabase = createClient();
    const router = useRouter();

    async function login(form: FormType, redirect?: string){
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: form.email,
                password: form.password
            });
            if (error) throw error.message
            await getUserRole()
            showToast("Success!", "User logged in", "success")
            router.push(redirect || "/")
        } catch (error) {
            showToast("Attention!", JSON.stringify(error), "danger")
        }
    }

    async function logout(){
        try {
            await supabase.auth.signOut()
            user_role.current = ""
            isUser.current = false
            showToast("Success!", "User succesfully logged out", "success")
            router.push("/")
        } catch (error) {
            showToast("Attention!", JSON.stringify(error), "danger")
        }
    }

    async function signIn(form: FormType){
        try{
            const { data, error } = await supabase.auth.signUp({
                email: form.email,
                password: form.password,
                options: {
                    data: {
                        display_name: form.name || ""
                    }
                }
            });
            if (error) throw error.message
            showToast("Success!", "User created succesfully", "success")
            await getUserRole()
            
            const { error: diary_error } = await supabase
            .from("personal_diary")
            .insert({email: data.user?.email})
            if (diary_error) throw diary_error
            
            router.push("/")
        }
        catch (error){
            showToast("Attention!", JSON.stringify(error), "danger")
        }
    }

    async function getUserRole(){
        try {
            const user = await getUser()
            if (user){
                user_role.current = await getRole()
            }
        } catch (error: any) {
            if (error.toString() !== "Auth session missing!") showToast("Attention!", JSON.stringify(error), "danger")
        }
    }

    async function getUser(){
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
            throw error.message
        }
        isUser.current = true
        return user
    }

    async function getRole(){
        const user = await getUser()

        const { data: role, error: role_error } = await supabase
        .from("auth_roles")
        .select("role")
        .eq("email", user?.email)
        if (role_error) {
            throw role_error
        }
        if (role[0]?.role === "admin") return "admin"
        return "user"
    }

    function doLogout() {
        showLoader(logout)
    }

    function doLogin(form: FormType, redirect?: string) {
        showLoader(() => login(form, redirect))
    }

    function doSignIn(form: FormType){
        if (form.password !== form.password_confirm) return showToast("Attention!", "Passwords do not match", "danger")
        showLoader(() => signIn(form))
    }

    useEffect(() => {
        if (!user_role.current) getUserRole()
    }, [])

    return (
        <UserContext.Provider value={{user_role, doLogin, doLogout, doSignIn, isUser}}>
            {children}
        </UserContext.Provider>
    )
}

