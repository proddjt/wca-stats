import { getHomeDiary, insertResult } from "@/app/actions/diary";
import useIsLoading from "@/Context/IsLoading/useIsLoading";
import { showToast } from "@/lib/Toast";
import { DiaryResultType, ResultInputType } from "@/types";
import { getAvg, getMean, reverseFormatTime } from "@/Utils/functions";
import { useEffect, useRef } from "react";

export default function useDiary(){
    const results = useRef<DiaryResultType>({})

    const {showLoader} = useIsLoading();

    async function upsertResult(result: ResultInputType){
        if (result.result_type === "ao5") result.final = reverseFormatTime(getAvg(result.result))
        if (result.result_type === "mo3") result.final = reverseFormatTime(getMean(result.result))
        if (result.result_type === "single") result.final = result.result[0]

        try{
            const data = await insertResult(result)
            console.log(data);
        } catch (error: any) {
            showToast("Attention!", error.toString(), "danger")
        }
    }

    async function getResults(){
        try{
            const data = await getHomeDiary()
            if (data) results.current = data[0].pb_home
        } catch (error: any) {
            showToast("Attention!", error.toString(), "danger")
        }
    }

    useEffect(() => {
        showLoader(getResults)
    }, [])

    return {
        results,
        upsertResult
    }
}