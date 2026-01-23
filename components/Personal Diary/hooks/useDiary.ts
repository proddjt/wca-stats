import { deleteResult, getHomeDiary, insertResult } from "@/app/actions/diary";
import useIsLoading from "@/Context/IsLoading/useIsLoading";
import { createClient } from "@/lib/supabase/client";
import { showToast } from "@/lib/Toast";
import { DiaryFilterType, DiaryResultType, ResultInputType } from "@/types";
import { getAvg, getMean, reverseFormatTime } from "@/Utils/functions";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";

export default function useDiary(){
    const [result, setResult] = useState<ResultInputType>({
        event: "",
        result_type: "",
        result: [],
        date: dayjs().format("YYYY-MM-DD"),
        scrambles: []
    })
    const [filters, setFilters] = useState<DiaryFilterType>({
        date: dayjs().format("YYYY-MM-DD"),
        event: "all",
        result_type: "all"
    })
    const results = useRef<DiaryResultType>({})

    const supabase = createClient();

    const {showLoader} = useIsLoading();

    async function upsertResult(result: ResultInputType){
        const user = await supabase.auth.getUser()
        if (result.result_type === "ao5") result.final = reverseFormatTime(getAvg(result.result))
        if (result.result_type === "mo3") result.final = reverseFormatTime(getMean(result.result))
        if (result.result_type === "single") result.final = result.result[0]

        try{
            await insertResult(result, user.data.user?.email)
            showToast("Success!", "Result added successfully", "success")
            setResult({
                event: "",
                result_type: "",
                result: [],
                date: dayjs().format("YYYY-MM-DD"),
                scrambles: []
            })
            await getResults()
        } catch (error: any) {
            showToast("Attention!", error.toString(), "danger")
        }
    }

    async function getResults(){
        const user = await supabase.auth.getUser()
        try{
            const data = await getHomeDiary(user.data.user?.email || "", filters)
            if (data ) results.current = data
            else results.current = {}
        } catch (error: any) {
            showToast("Attention!", error.toString(), "danger")
        }
    }

    async function deleteAction(result: any){
        const user = await supabase.auth.getUser()
        try{
            await deleteResult(result, user.data.user?.email)
            showToast("Success!", "Result deleted successfully", "success")
            await getResults()
        } catch (error: any) {
            showToast("Attention!", error.toString(), "danger")
        }
    }

    useEffect(() => {
        showLoader(getResults)
    }, [])

    return {
        result,
        setResult,
        results,
        upsertResult,
        getResults,
        deleteAction,
        filters,
        setFilters
    }
}