"use server"

import { createClient } from "@/lib/supabase/server"

export async function getRole(){
    const supabase = await createClient()

    const user = await getUser()

    const { data: role, error: role_error } = await supabase
    .from("auth_roles")
    .select("role")
    .eq("email", user?.email)
    if (role_error) throw role_error.message
    if (role[0]?.role === "admin") return "admin"
    return "user"
}

export async function getUser(){
    const supabase = await createClient()

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error.message
    return user
}