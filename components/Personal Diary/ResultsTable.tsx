import { MutableRefObject, useMemo } from "react"
import dayjs from "dayjs"

import useConfig from "@/Context/Config/useConfig"
import { extractDiaryEntries, formatTime } from "@/Utils/functions"

import ResTable from "./ResTable"

import { DiaryResultType } from "@/types"

export default function ResultsTable({
    results,
    deleteAction,
} : {
    results: MutableRefObject<DiaryResultType>,
    deleteAction: (result: any) => void
}){
    const {events} = useConfig()

    const eventOrder: Record<string, number> = useMemo(() => events.current.reduce((acc, ev, index) => {
        acc[ev.id] = index;
        return acc;
    }, {} as Record<string, number>), [events.current]);

    console.log();
    

    return (
        <div className="grow flex flex-col justify-center items-center w-full p-5">
            <p className="text-2xl font-bold">Your best results</p>
            <ResTable
            data={{
                cols: [
                    {label: "Event", key: "event_id"},
                    {label: "Result type", key: "result_type"},
                    {label: "Result", key: "result"},
                    {label: "Date", key: "date"},
                ],
                rows: extractDiaryEntries(results.current)
            }}
            deleteAction={deleteAction}
            />
        </div>
    )
}