import { DiaryResultType } from "@/types"
import { MutableRefObject } from "react"
import StatTable from "../Person Stats/StatTable"
import { formatTime } from "@/Utils/functions"
import dayjs from "dayjs"

export default function ResultsTable({
    results
} : {
    results: MutableRefObject<DiaryResultType>
}){
    
    return (
        <div className="grow flex justify-center items-center w-full">
            <StatTable
            mode=""
            data={{
                cols: [
                    {label: "Event", key: "event_id"},
                    {label: "Result type", key: "result_type"},
                    {label: "Result", key: "result"},
                    {label: "Date", key: "date"},
                ],
                rows: Object
                .entries(results.current)
                .map(([key, value]) => {
                    return Object
                    .entries(value)
                    .map(([key2, value2]) => ({
                        ...value2[0],
                        event_id: key,
                        result_type: key2.charAt(0).toUpperCase() + key2.slice(1),
                        key: value2[0].id,
                        result: formatTime(value2[0].result),
                        date: dayjs(value2[0].date).format("DD-MM-YYYY")
                    }))[0]
                })
            }}
            />
        </div>
    )
}