"use server"

import { createClient } from "@/lib/supabase/server"
import { ResultInputType } from "@/types"
import { getUser } from "./user"

export async function insertResult(result: ResultInputType){
    const supabase = await createClient()

    const user = await getUser()
    if (!user) throw "Error in authentication!"

    const { data, error } = await supabase
    .rpc("update_diary", {
        p_email: user?.email,
        p_action: "insert",
        p_event: result.event,
        p_result_type: result.result_type,
        p_result: result.final,
        p_results: result.result,
        p_date: result.date,
        p_scrambles: result.scrambles || [],
        p_notes: result.notes || "",
    })
    if (error) throw error.message
    if (data) return data
    
}

export async function getHomeDiary(){
    const supabase = await createClient()

    const user = await getUser()
    if (!user) throw "Error in authentication!"

    const { data, error } = await supabase
    .from("personal_diary")
    .select("pb_home")
    .eq("email", user?.email)
    if (error) throw error.message
    if (data) return data
}