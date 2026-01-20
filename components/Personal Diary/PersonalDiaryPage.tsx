'use client'

import { useState } from "react";
import { Tab, Tabs } from "@heroui/tabs";

import { FaTableList } from "react-icons/fa6";
import { MdAddCircle } from "react-icons/md";
import ResultInsert from "./ResultInsert";
import ResultsTable from "./ResultsTable";

const sections = {
    table: ResultsTable,
    insert: ResultInsert,
}

const getSection = (key: string, props?: any) => {
    const Page = sections[key as keyof typeof sections]
    return <Page {...props}/>
}


export default function PersonalDiaryPage(){
    const [sectionSelected, setSectionSelected] = useState<string>("table");
    return (
        <div className="grow flex flex-col justify-center items-center gap-5 p-2">
            <Tabs
            aria-label="Diary section"
            selectedKey={sectionSelected}
            onSelectionChange={(key) => setSectionSelected(key as string)}
            color="warning"
            >
                <Tab
                key="table"
                title={
                    <div className="flex items-center space-x-2">
                        <FaTableList size={15}/>
                        <span>Diary</span>
                    </div>
                }
                className="font-bold"
                />
                <Tab
                key="insert"
                title={
                    <div className="flex items-center space-x-2">
                        <MdAddCircle size={15}/>
                        <span>Add result</span>
                    </div>
                }
                className="font-bold"
                />
            </Tabs>
            {getSection(sectionSelected)}
        </div>
    )
}