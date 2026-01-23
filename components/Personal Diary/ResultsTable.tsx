import { MutableRefObject, useMemo } from "react"

import useConfig from "@/Context/Config/useConfig"
import { extractDiaryEntries } from "@/Utils/functions"

import ResTable from "./ResTable"

import { DiaryFilterType, DiaryResultType } from "@/types"

export default function ResultsTable({
    results,
    deleteAction,
    filters,
    setFilters,
    getResults,
} : {
    results: MutableRefObject<DiaryResultType>,
    deleteAction: (result: any) => void,
    filters: DiaryFilterType,
    setFilters: React.Dispatch<React.SetStateAction<DiaryFilterType>>,
    getResults: () => Promise<void>
}){
    const {events} = useConfig()

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
            filters={filters}
            setFilters={setFilters}
            getResults={getResults}
            />
        </div>
    )
}