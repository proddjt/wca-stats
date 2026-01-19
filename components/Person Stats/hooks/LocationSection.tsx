import { useRef, useState } from "react";
import { Tab, Tabs } from "@heroui/tabs";

import { BiWorld } from "react-icons/bi";
import Flag from "react-world-flags";

import StatTable from "../StatTable";

import { PersonType } from "@/types";

const int_cols = [
    {key: "city", label: "City", sortable: true}, 
    {key: "country", label: "Country", sortable: true}
]
const ita_cols = [
    {key: "city", label: "City", sortable: true},
    {key: "region", label: "Region", sortable: true}
]

export default function LocationSection({
    int_cities,
    ita_cities,
    person,
    regions
} : {
    person: PersonType,
    int_cities: {city: string, country: string}[] | undefined,
    ita_cities: {city: string, region: string}[] | undefined,
    regions: string[] | undefined,
}){
    const [tableMode, setTableMode] = useState<"int" | "ita">(person.country === "IT" ? "ita" : "int");

    const tableData = useRef<{rows: any[], cols: any[]}>({
        rows: person.country === "IT" ?
        ita_cities?.filter((city) => city.city != "Multiple Cities" && city.city != "Multiple cities").sort((a, b) => a.city.localeCompare(b.city)) || []
        : int_cities?.filter((city) => city.country != "IT" && city.city != "Multiple Cities" && city.city != "Multiple cities").sort((a, b) => a.city.localeCompare(b.city)) || [],
        cols: person.country === "IT" ? ita_cols : int_cols || []
    });

    function changeTableMode(mode: "int" | "ita"){
        if (mode === "int"){
            tableData.current.rows = int_cities?.filter((city) => city.country != "IT" && city.city != "Multiple Cities" && city.city != "Multiple cities").sort((a, b) => a.city.localeCompare(b.city)) || [];
            tableData.current.cols = int_cols
        } else {
            tableData.current.rows = ita_cities?.filter((city) => city.city != "Multiple Cities" && city.city != "Multiple cities").sort((a, b) => a.city.localeCompare(b.city)) || [];
            tableData.current.cols = ita_cols
        }
        setTableMode(mode)
    }

    return (
        <div className="py-5">
            <p className="text-lg">This person competed in:</p>
            <p className="text-lg">{int_cities?.length || 0} total {int_cities?.length === 1 ? "city" : "cities"}*</p>
            <p className="text-lg">{(int_cities?.length || 0) - (ita_cities?.length || 0)} international {(int_cities?.length || 0) - (ita_cities?.length || 0) === 1 ? "city" : "cities"}</p>
            <p className="text-lg pb-5">{ita_cities?.length} Italian {ita_cities?.length === 1 ? "city" : "cities"}</p>
            <Tabs
            aria-label="Table mode"
            selectedKey={tableMode}
            onSelectionChange={(key) => changeTableMode(key as "int" | "ita")}
            color="warning"
            >
                <Tab
                key="int"
                title={
                    <div className="flex items-center space-x-2">
                        <BiWorld size={15}/>
                        <span>International</span>
                    </div>
                }
                className="font-bold"
                />
                <Tab
                key="ita"
                title={
                    <div className="flex items-center space-x-2">
                        <Flag code="it" width={15}/>
                        <span>Italian</span>
                    </div>
                }
                className="font-bold"
                />
            </Tabs>
            <StatTable
            data={tableData.current}
            mode={tableMode}
            />

            <p className="text-lg pt-5">This person competed in {regions?.length} Italian {regions?.length === 1 ? "region" : "regions"}* **</p>
            <p className="text-lg pb-5">{regions?.join(", ")}</p>
        </div>
    )
}