import { useRef, useState } from "react";
import { Button } from "@heroui/button"
import { Image } from "@heroui/image"
import { Tabs, Tab } from "@heroui/tabs"
import Flag from "react-world-flags"
import dayjs from "dayjs";
import { CircleFlag } from "react-circle-flags";

import { PersonType } from "@/types"

import { TbArrowBackUp } from "react-icons/tb";
import { BiWorld } from "react-icons/bi";

import { diffToHuman } from "@/Utils/functions";
import { regions_icon } from "@/Utils/regions_icon";

import StatTable from "./StatTable";

const int_cols = [{key: "city", label: "City", sortable: true}, {key: "country", label: "Country", sortable: true}]
const ita_cols = [{key: "city", label: "City", sortable: true}, {key: "region", label: "Region", sortable: true}]

export default function PersonStatistics({
    person,
    regions,
    int_cities,
    ita_cities,
    resetPerson
} : {
    person: PersonType,
    regions: string[] | undefined,
    int_cities: {city: string, country: string}[] | undefined,
    ita_cities: {city: string, region: string}[] | undefined,
    resetPerson: () => void
}){
    const tableData = useRef<{rows: any[], cols: any[]}>({
        rows: person.country === "IT" ?
        ita_cities?.filter((city) => city.city != "Multiple Cities" && city.city != "Multiple cities").sort((a, b) => a.city.localeCompare(b.city)) || []
        : int_cities?.filter((city) => city.country != "IT" && city.city != "Multiple Cities" && city.city != "Multiple cities").sort((a, b) => a.city.localeCompare(b.city)) || [],
        cols: person.country === "IT" ? ita_cols : int_cols || []
    });
    const [tableMode, setTableMode] = useState<"int" | "ita">(person.country === "IT" ? "ita" : "int");

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
        <div className="p-5 grow flex flex-col items-center text-center">
            <Button
            color="warning"
            variant="flat"
            size="sm"
            onPress={resetPerson}
            startContent={<TbArrowBackUp/>}
            className="self-start mb-5"
            >
                Go back
            </Button>
            {
                person.img &&
                <Image
                alt="person avatar"
                src={person.img}
                width={300}
                isBlurred
                radius="sm"
                className="mb-5"
                />
            }
            <h1 className="font-bold lg:text-5xl text-2xl">{person.id}<br/>{person.name}</h1>
            <div className="flex justify-center items-center gap-5 mb-5">
                <Flag code={person.country} width="30"/>
                {person.region && <CircleFlag countryCode={regions_icon.find((region) => region.name === person.region)?.icon||"IT"} width="25" />}
            </div>

            <p className="text-lg">This person competed in:</p>
            <p className="text-lg">In {int_cities?.length || 0} total cities*</p>
            <p className="text-lg">In {(int_cities?.length || 0) - (ita_cities?.length || 0)} international cities</p>
            <p className="text-lg pb-5">In {ita_cities?.length} Italian cities</p>
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
            data={tableData}
            mode={tableMode}
            />

            <p className="text-lg">This person competed in {regions?.length} Italian regions*</p>
            <p className="text-lg pb-5">Regions list**: <br/>{regions?.join(", ")}</p>
            <p className="text-lg">
                {
                    person.last_medals.first_comp != person.last_medals.last_pos1_date ?
                    `Last gold was on ${dayjs(person.last_medals.last_pos1_date).format("DD-MM-YYYY")}, ${diffToHuman(person.last_medals.last_pos1_date)} ago`
                    :
                    `This person has never won a gold in ${diffToHuman(person.last_medals.last_pos1_date)}`
                }
            </p>
            <p className="text-lg">
                {
                    person.last_medals.first_comp != person.last_medals.last_pos2_date ?
                    `Last silver was on ${dayjs(person.last_medals.last_pos2_date).format("DD-MM-YYYY")}, ${diffToHuman(person.last_medals.last_pos2_date)} ago`
                    :
                    `This person has never won a silver in ${diffToHuman(person.last_medals.last_pos2_date)}`
                }
            </p>
            <p className="text-lg pb-3">
                {
                    person.last_medals.first_comp != person.last_medals.last_pos3_date ?
                    `Last bronze was on ${dayjs(person.last_medals.last_pos3_date).format("DD-MM-YYYY")}, ${diffToHuman(person.last_medals.last_pos3_date)} ago`
                    :
                    `This person has never won a bronze in ${diffToHuman(person.last_medals.last_pos3_date)}`
                }
            </p>
            <p className="text-xs italic text-gray-400 pb-1">(*) Il numero di regioni e di città potrebbe essere leggermente inesatto in alcuni casi, poichè la WCA non fornisce dati riguardanti la sede in cui si ha partecipato in una gara con multiple venues.</p>
            <p className="text-xs italic text-gray-400">(**) Se all'interno della lista delle regioni dovesse apparire una dicitura del tipo "Roma non trovata nell'elenco", si prega di contattare lo sviluppatore per comunicare il nome della città non riconosciuta e sistemare il bug.</p>
        </div>
    )
}