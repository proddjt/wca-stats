import {Input} from "@heroui/input";
import {Autocomplete, AutocompleteItem, AutocompleteSection} from "@heroui/autocomplete"
import {Select, SelectItem} from "@heroui/select";
import {CheckboxGroup, Checkbox} from "@heroui/checkbox";
import {RadioGroup, Radio} from "@heroui/radio";
import Flag from 'react-world-flags'

import { FaSearch } from "react-icons/fa";
import { FaGlobeEurope } from "react-icons/fa";
import { FaGlobeAsia } from "react-icons/fa";
import { FaGlobeAfrica } from "react-icons/fa";
import { FaGlobeAmericas } from "react-icons/fa";
import { FaEarthOceania } from "react-icons/fa6";
import { TfiWorld } from "react-icons/tfi";


import { EventType, FiltersType, NationType } from "@/types";
import { columns } from "./MedalTablePage";
import { useEffect, useState } from "react";

const icons = {
    "": TfiWorld,
    "europe": FaGlobeEurope,
    "asia": FaGlobeAsia,
    "africa": FaGlobeAfrica,
    "north-america": FaGlobeAmericas,
    "south-america": FaGlobeAmericas,
    "oceania": FaEarthOceania
}

const getIcon = (continent: string) => {
    const Icon = icons[continent as keyof typeof icons];
    return <Icon />
}

export default function Filterbar({
    handleFiltersChange,
    handleMoreFiltersChange,
    filters,
    nations,
    events,
    years,
    isDrawer = false
} : {
    handleFiltersChange: (value: string | string[] | [], key: string, ascending?: boolean) => void,
    handleMoreFiltersChange: (value: string[]) => void,
    filters: FiltersType,
    nations: NationType[],
    events: EventType[],
    years: {year: string}[],
    isDrawer?: boolean
}){

    const [name, setName] = useState(filters.name);

    useEffect(() => {
        if (isDrawer) {
            handleFiltersChange(name, "name");
        } else {
            const timeout = setTimeout(() => { 
                handleFiltersChange(name, "name");
            }, 1500);
            return () => clearTimeout(timeout);
        }
    }, [name]);

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const years = e.target.value.split(",");
        handleFiltersChange(years, "year");
    };

    const handleEventChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const events = e.target.value.split(",");
        handleFiltersChange(events, "event");
    };

    const handleRadioChange = (v: string) => {
        handleFiltersChange(v, "country");
    };

    return (
        <div className="flex flex-col gap-0.5">
            <div className="flex lg:flex-row flex-col lg:justify-around lg:gap-0 gap-2">
                <Input
                value={filters.name}
                placeholder="Search by name"
                isClearable
                size="lg"
                radius="sm"
                startContent={<FaSearch />}
                fullWidth={isDrawer}
                className="lg:w-1/5 w-full"
                variant="faded"
                onChange={(e) => setName(e.target.value)}
                onClear={() => setName("")}
                />

                <Autocomplete
                label="Nationality"
                shouldCloseOnBlur
                selectedKey={filters.nationality}
                onSelectionChange={(key) => handleFiltersChange(key as string, "nationality")}
                placeholder="Search by nationality"
                variant="faded"
                size="sm"
                radius="sm"
                startContent={
                    filters.nationality && !["europe","africa","asia","oceania","north-america","south-america"].includes(filters.nationality) ?
                    <Flag code={filters.nationality} width={20}/> :
                    getIcon(filters.nationality)
                }
                fullWidth={isDrawer}
                className="lg:w-1/5 w-full"
                onClear={() => handleFiltersChange("", "nationality")}
                >
                    <AutocompleteItem key="" textValue="World" onClick={() => handleFiltersChange("", "nationality")}>World</AutocompleteItem>
                    <AutocompleteSection showDivider title="Europe">
                        {
                            [{ id: "europe", name: "All Europe", cont_id: "europe" },...nations].filter(n => n.cont_id === "europe").map(n => 
                            <AutocompleteItem key={n.id} onClick={() => handleFiltersChange(n.id, "nationality")}>{n.name}</AutocompleteItem>
                            )
                        }
                    </AutocompleteSection>
                    <AutocompleteSection showDivider title="Africa">
                        {
                            [{ id: "africa", name: "All Africa", cont_id: "africa" },...nations].filter(n => n.cont_id === "africa").map(n => 
                            <AutocompleteItem key={n.id} onClick={() => handleFiltersChange(n.id, "nationality")}>{n.name}</AutocompleteItem>
                            )
                        }
                    </AutocompleteSection>
                    <AutocompleteSection showDivider title="Asia">
                        {
                            [{ id: "asia", name: "All Asia", cont_id: "asia" },...nations].filter(n => n.cont_id === "asia").map(n => 
                            <AutocompleteItem key={n.id} onClick={() => handleFiltersChange(n.id, "nationality")}>{n.name}</AutocompleteItem>
                            )
                        }
                    </AutocompleteSection>
                    <AutocompleteSection showDivider title="North America">
                        {
                            [{ id: "north-america", name: "All North America", cont_id: "north-america" },...nations].filter(n => n.cont_id === "north-america").map(n => 
                            <AutocompleteItem key={n.id} onClick={() => handleFiltersChange(n.id, "nationality")}>{n.name}</AutocompleteItem>
                            )
                        }
                    </AutocompleteSection>
                    <AutocompleteSection showDivider title="Oceania">
                        {
                            [{ id: "oceania", name: "All Oceania", cont_id: "oceania" },...nations].filter(n => n.cont_id === "oceania").map(n => 
                            <AutocompleteItem key={n.id} onClick={() => handleFiltersChange(n.id, "nationality")}>{n.name}</AutocompleteItem>
                            )
                        }
                    </AutocompleteSection>
                    <AutocompleteSection showDivider title="South America">
                        {
                            [{ id: "south-america", name: "All South America", cont_id: "south-america" },...nations].filter(n => n.cont_id === "south-america").map(n => 
                            <AutocompleteItem key={n.id} onClick={() => handleFiltersChange(n.id, "nationality")}>{n.name}</AutocompleteItem>
                            )
                        }
                    </AutocompleteSection>
                </Autocomplete>

                <Select
                className="lg:w-1/5 w-full"
                label="Event (multiple)"
                placeholder="Select one or more events"
                variant="faded"
                size="sm"
                radius="sm"
                isClearable
                onClear={() => handleFiltersChange([], "event")}
                selectedKeys={filters.event.length ? filters.event : []}
                selectionMode="multiple"
                onChange={handleEventChange}
                >
                    {events.map((event) =><SelectItem key={event.id} textValue={event.name}><span className={`cubing-icon event-${event.id}`}></span> {event.name}</SelectItem>)}
                </Select>

                <Select
                className="lg:w-1/5 w-full"
                label="Year (multiple)"
                placeholder="Select one or more years"
                variant="faded"
                size="sm"
                radius="sm"
                isClearable
                onClear={() => handleFiltersChange([], "year")}
                selectedKeys={filters.year.length ? filters.year : []}
                selectionMode="multiple"
                onChange={handleYearChange}
                >
                    {years.map((year) =><SelectItem key={year.year}>{year.year}</SelectItem>)}
                </Select>

                {/* <Select
                className="lg:w-1/6 w-full"
                label="Order by"
                variant="faded"
                size="sm"
                radius="sm"
                selectedKeys={filters.col_order ? [filters.col_order + (filters.ascending ? "asc" : "desc")] : ["goldsdesc"]}
                >
                    {
                        columns.filter((column) => !["country_id", "rank_position", "name", "wca_id"].includes(column.key)).map((column) => (
                        <>
                            <SelectItem key={`${column.key}asc`} textValue={column.label + " ascending"} onClick={() => handleFiltersChange(column.key, "col_order", true)}>{column.label} ascending</SelectItem>
                            <SelectItem key={`${column.key}desc`} textValue={column.label + " descending"} onClick={() => handleFiltersChange(column.key, "col_order", false)}>{column.label} descending</SelectItem>
                        </>
                    ))
                    }
                </Select> */}
            </div>
            <div className="flex lg:flex-row flex-col justify-center lg:gap-0 gap-2">
                <CheckboxGroup
                color="warning"
                label="Filter by medals"
                className="lg:w-1/3 w-auto"
                orientation={isDrawer ? "horizontal" : "vertical"}
                onChange={(v) => handleMoreFiltersChange(v)}
                value={[filters.more_filters.no_golds ? "no_golds" : "", filters.more_filters.no_silvers ? "no_silvers" : "", filters.more_filters.no_bronzes ? "no_bronzes" : "",]}
                >
                    <Checkbox value="no_golds">Show only people with no gold medals</Checkbox>
                    <Checkbox value="no_silvers">Show only people with no silver medals</Checkbox>
                    <Checkbox value="no_bronzes">Show only people with no bronze medals</Checkbox>
                </CheckboxGroup>
                <RadioGroup
                color="warning"
                label="Filter by country"
                className="lg:w-1/3 w-auto"
                value={filters.country}
                orientation={isDrawer ? "horizontal" : "vertical"}
                onValueChange={handleRadioChange}
                >
                    <Radio value="all">All</Radio>
                    <Radio value="foreign">Only medals in foreign country</Radio>
                    <Radio value="home">Only medals in home country</Radio>
                </RadioGroup>
            </div>
        </div>
    )
}