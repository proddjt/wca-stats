"use server"

import { createClient } from "@/lib/supabase/server"
import { ResultInputType } from "@/types"

export async function insertResult(result: ResultInputType, email?: string){
    const supabase = await createClient()

    const { data, error } = await supabase
    .rpc("update_diary", {
        p_email: email,
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

export async function getHomeDiary(email?: string){
    const supabase = await createClient()
    const { data, error } = await supabase
    .from("personal_diary")
    .select("pb_home")
    .eq("email", email)
    if (error) throw error.message
    if (data) return data
}