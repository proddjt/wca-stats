import { useState } from "react";
import { Button } from "@heroui/button"
import { Image } from "@heroui/image"
import { Tabs, Tab } from "@heroui/tabs"
import { Chip } from "@heroui/chip"
import Flag from "react-world-flags"
import { CircleFlag } from "react-circle-flags";

import { PersonMetType, PersonType, StatsFiltersType } from "@/types"

import { TbArrowBackUp } from "react-icons/tb";
import { BiSolidTimer } from "react-icons/bi";
import { FaLocationDot } from "react-icons/fa6";
import { BsClipboardDataFill } from "react-icons/bs";

import { regions_icon } from "@/Utils/regions_icon";

import LocationSection from "./LocationSection";
import ResultSection from "./ResultSection";
import CompSection from "./CompSection";
import { Select, SelectItem } from "@heroui/select";
import useConfig from "@/Context/Config/useConfig";

const sections = {
    results: ResultSection,
    competitions: CompSection,
    locations: LocationSection
}

const getSection = (key: string, props: any) => {
    const Page = sections[key as keyof typeof sections]
    return <Page {...props}/>
}

export default function PersonStatistics({
    person,
    regions,
    int_cities,
    ita_cities,
    filters,
    peopleMet,
    resetPerson,
    handleFiltersChange,
    calculatePeopleMet,
} : {
    person: PersonType,
    regions: string[] | undefined,
    int_cities: {city: string, country: string}[] | undefined,
    ita_cities: {city: string, region: string}[] | undefined,
    filters: StatsFiltersType,
    peopleMet: PersonMetType | undefined,
    resetPerson: () => void,
    handleFiltersChange: (value: string | string[] | [], key: string) => void,
    calculatePeopleMet: (id: string, page: number, pageSize: number) => Promise<any>
}){ 
    const [sectionSelected, setSectionSelected] = useState<string>("results");

    const {years} = useConfig();

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
                {
                    person.region &&
                    <Chip
                    color="warning"
                    variant="faded"
                    startContent={<CircleFlag countryCode={regions_icon.find((region) => region.name === person.region.trim())?.icon||"IT"} width="20" />}
                    >
                        {person.region}
                    </Chip>
                }
            </div>

            {/* <Select
            className="lg:w-1/4 w-full pb-4"
            label="Year"
            placeholder="Select a year"
            description="Change the year to see the stats of that year."
            variant="faded"
            size="sm"
            radius="sm"
            isClearable
            onClear={() => handleFiltersChange("", "year")}
            selectedKeys={filters.year !== "all" ? [filters.year] : []}
            onChange={(e) => handleFiltersChange(e.target.value, "year")}
            >
                {years.current.sort((a, b) => Number(b.year) - Number(a.year)).map((year) =><SelectItem key={year.year}>{year.year}</SelectItem>)}
            </Select> */}

            <Tabs
            aria-label="Page section"
            selectedKey={sectionSelected}
            onSelectionChange={(key) => setSectionSelected(key as string)}
            color="warning"
            >
                <Tab
                key="results"
                title={
                    <div className="flex items-center space-x-2">
                        <BsClipboardDataFill size={15}/>
                        <span>Results</span>
                    </div>
                }
                className="font-bold"
                />
                <Tab
                key="locations"
                title={
                    <div className="flex items-center space-x-2">
                        <FaLocationDot size={15}/>
                        <span>Locations</span>
                    </div>
                }
                className="font-bold"
                />
                <Tab
                key="competitions"
                title={
                    <div className="flex items-center space-x-2">
                        <BiSolidTimer size={25}/>
                        <span>Competitions</span>
                    </div>
                }
                className="font-bold"
                />
            </Tabs>

            {getSection(sectionSelected, {person, regions, int_cities, ita_cities, filters, peopleMet, calculatePeopleMet})}
            
            <p className="text-xs italic text-gray-400 pb-1">(*) Il numero di regioni e di città potrebbe essere leggermente inesatto in alcuni casi, poichè la WCA non fornisce dati riguardanti la sede in cui si ha partecipato in una gara con multiple venues.</p>
            <p className="text-xs italic text-gray-400">(**) Se all'interno della lista delle regioni dovesse apparire una dicitura del tipo "Roma non trovata nell'elenco", si prega di contattare lo sviluppatore per comunicare il nome della città non riconosciuta e sistemare il bug.</p>
        </div>
    )
}