'use client'

import { useState } from "react";

import { FaTableList } from "react-icons/fa6";
import { MdAddCircle } from "react-icons/md";
import ResultInsert from "./ResultInsert";
import ResultsTable from "./ResultsTable";
import useDiary from "./hooks/useDiary";
import useIsLoading from "@/Context/IsLoading/useIsLoading";
import Loader from "../Layout/Loader";
import TabNavigation from "../Layout/TabNavigation";

const sections = [
    {
        component: ResultsTable,
        key: "table",
        title: "Diary",
        icon: FaTableList
    },
    {
        component: ResultInsert,
        key: "insert",
        title: "Insert",
        icon: MdAddCircle
    }
]

const getSection = (key: string, props: any) => {
    const Page = sections?.find((s: any) => s.key === key)?.component || sections[0].component
    return <Page {...props}/>
}

export default function PersonalDiaryPage(){
    const [sectionSelected, setSectionSelected] = useState<string>("table");

    const {isPending} = useIsLoading();

    const {
        results,
        result,
        setResult,
        getResults,
        upsertResult,
        deleteAction,
        filters,
        setFilters
    } = useDiary();

    if (isPending) return <Loader />

    return (
        <div className="grow flex flex-col justify-center items-center gap-5 p-2">
            <TabNavigation
            sections={sections}
            selectedKey={sectionSelected}
            onSelectionChange={setSectionSelected}
            />

            {getSection(sectionSelected, {upsertResult, results, deleteAction, result, setResult, filters, setFilters, getResults})}
        </div>
    )
}