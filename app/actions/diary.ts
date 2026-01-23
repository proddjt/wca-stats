"use server"

import { createClient } from "@/lib/supabase/server"
import { DiaryFilterType, ResultInputType } from "@/types"

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

export async function deleteResult(result: any, email?: string){
    const supabase = await createClient()

    const { error } = await supabase
    .rpc("update_diary", {
        p_email: email,
        p_action: "delete",
        p_event: result.event_id,
        p_result_type: result.result_type.toLowerCase(),
        p_result: "",
        p_results: [],
        p_date: "",
        p_scrambles: [],
        p_notes: "",
        p_id: result.id,
    })
    if (error) throw error.message
}

export async function getHomeDiary(email: string, filters: DiaryFilterType){
    const supabase = await createClient()
    // const { data, error } = await supabase
    // .from("personal_diary")
    // .select("pb_home")
    // .eq("email", email)

    const { data, error } = await supabase
    .rpc("get_filtered_pb_home", {
        in_email: email,
        in_date: filters.date,
        in_events: filters.event,
        in_result_type: filters.result_type
    })
    
    if (error) throw error.message
    if (data) return data
}