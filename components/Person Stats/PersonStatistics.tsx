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

import { diffToHuman, secondDiffToHuman } from "@/Utils/functions";
import { regions_icon } from "@/Utils/regions_icon";

import StatTable from "./StatTable";
import useConfig from "@/Context/Config/useConfig";

const int_cols = [
    {key: "city", label: "City", sortable: true}, 
    {key: "country", label: "Country", sortable: true}
]
const ita_cols = [
    {key: "city", label: "City", sortable: true},
    {key: "region", label: "Region", sortable: true}
]
const medals_by_country_cols = [
    {key: "country", label: "Country", sortable: true},
    {key: "golds", label: "Golds", sortable: true},
    {key: "silvers", label: "Silvers", sortable: true},
    {key: "bronzes", label: "Bronzes", sortable: true},
    {key: "total_medals", label: "Total medals", sortable: true}
]

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

    const {events} = useConfig()

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
            
            <div className="flex flex-col gap-1 pb-5">
                <p className="text-lg bg-amber-400 rounded-lg text-black p-1">
                {
                    person.last_medals.first_comp != person.last_medals.last_pos1_date ?
                    `Last gold was on ${dayjs(person.last_medals.last_pos1_date).format("DD-MM-YYYY")}, ${diffToHuman(person.last_medals.last_pos1_date)} ago`
                    :
                    `This person has never won a gold in ${diffToHuman(person.last_medals.last_pos1_date)}`
                }
                </p>
                <p className="text-lg bg-stone-300 rounded-lg text-black p-1">
                    {
                        person.last_medals.first_comp != person.last_medals.last_pos2_date ?
                        `Last silver was on ${dayjs(person.last_medals.last_pos2_date).format("DD-MM-YYYY")}, ${diffToHuman(person.last_medals.last_pos2_date)} ago`
                        :
                        `This person has never won a silver in ${diffToHuman(person.last_medals.last_pos2_date)}`
                    }
                </p>
                <p className="text-lg bg-amber-700 rounded-lg text-black p-1">
                    {
                        person.last_medals.first_comp != person.last_medals.last_pos3_date ?
                        `Last bronze was on ${dayjs(person.last_medals.last_pos3_date).format("DD-MM-YYYY")}, ${diffToHuman(person.last_medals.last_pos3_date)} ago`
                        :
                        `This person has never won a bronze in ${diffToHuman(person.last_medals.last_pos3_date)}`
                    }
                </p>
            </div>

            <p className="text-lg">This person got {person.medals.gold + person.medals.silver + person.medals.bronze} medals in {person.medals_by_country.length} different countries across the world*</p>
            <StatTable
            data={{cols: medals_by_country_cols, rows: person.medals_by_country}}
            mode=""
            />

            <p className="text-lg pt-5">This person spent {secondDiffToHuman(Object.values(person.time_passed).reduce((a, b) => a + b, 0))} solving puzzles in competitions!</p>
            <StatTable
            data={{
                cols: [{label: "Event", key: "event_id"}, {label: "Time", key: "time"}],
                rows: Object.entries(person.time_passed)
                .map(([event_id, time]) => ({event_id: event_id, time: time, key: event_id + time}))
                .filter((row) => row.time > 0)
            }}
            mode=""
            />
            
            <p className="text-xs italic text-gray-400 pb-1">(*) Il numero di regioni e di città potrebbe essere leggermente inesatto in alcuni casi, poichè la WCA non fornisce dati riguardanti la sede in cui si ha partecipato in una gara con multiple venues.</p>
            <p className="text-xs italic text-gray-400">(**) Se all'interno della lista delle regioni dovesse apparire una dicitura del tipo "Roma non trovata nell'elenco", si prega di contattare lo sviluppatore per comunicare il nome della città non riconosciuta e sistemare il bug.</p>
        </div>
    )
}