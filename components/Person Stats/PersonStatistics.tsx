import { useState } from "react";
import { Button } from "@heroui/button"
import { Image } from "@heroui/image"
import { Tabs, Tab } from "@heroui/tabs"
import { Chip } from "@heroui/chip"
import Flag from "react-world-flags"
import { CircleFlag } from "react-circle-flags";

import { PersonType } from "@/types"

import { TbArrowBackUp } from "react-icons/tb";
import { BiSolidTimer } from "react-icons/bi";
import { FaLocationDot } from "react-icons/fa6";
import { BsClipboardDataFill } from "react-icons/bs";

import { regions_icon } from "@/Utils/regions_icon";

import LocationSection from "./hooks/LocationSection";
import ResultSection from "./ResultSection";
import CompSection from "./CompSection";

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
    resetPerson
} : {
    person: PersonType,
    regions: string[] | undefined,
    int_cities: {city: string, country: string}[] | undefined,
    ita_cities: {city: string, region: string}[] | undefined,
    resetPerson: () => void
}){ 
    const [sectionSelected, setSectionSelected] = useState<string>("results");

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

            {getSection(sectionSelected, {person, regions, int_cities, ita_cities})}
            
            <p className="text-xs italic text-gray-400 pb-1">(*) Il numero di regioni e di città potrebbe essere leggermente inesatto in alcuni casi, poichè la WCA non fornisce dati riguardanti la sede in cui si ha partecipato in una gara con multiple venues.</p>
            <p className="text-xs italic text-gray-400">(**) Se all'interno della lista delle regioni dovesse apparire una dicitura del tipo "Roma non trovata nell'elenco", si prega di contattare lo sviluppatore per comunicare il nome della città non riconosciuta e sistemare il bug.</p>
        </div>
    )
}