import {Input} from "@heroui/input";
import {Autocomplete, AutocompleteItem, AutocompleteSection} from "@heroui/autocomplete"
import {Select, SelectItem} from "@heroui/select";
import {CheckboxGroup, Checkbox} from "@heroui/checkbox";
import Flag from 'react-world-flags'

import { FaSearch } from "react-icons/fa";

import { EventType, FiltersType, NationType } from "@/types";
import { columns } from "./MedalTablePage";

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

    const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const years = e.target.value.split(",");
        handleFiltersChange(years, "year");
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex lg:flex-row flex-col lg:justify-around lg:gap-0 gap-2">
                <Input
                value={filters.name}
                placeholder="Search by name"
                isClearable
                size="lg"
                radius="sm"
                startContent={<FaSearch />}
                fullWidth={isDrawer}
                className="lg:w-1/6 w-full"
                variant="faded"
                onChange={(e) => handleFiltersChange(e.target.value, "name")}
                onClear={() => handleFiltersChange("", "name")}
                />

                <Autocomplete
                label="Nationality"
                shouldCloseOnBlur
                selectedKey={filters.nationality}
                onSelectionChange={(key) => handleFiltersChange(key as string, "nationality")}
                placeholder="Search by nationality"
                // defaultItems={[{ id: "", name: "World", cont_id: "none" }, ...nations]}
                variant="faded"
                size="sm"
                radius="sm"
                startContent={filters.nationality && <Flag code={filters.nationality} width={20}/>}
                fullWidth={isDrawer}
                className="lg:w-1/6 w-full"
                onClear={() => handleFiltersChange("", "nationality")}
                >
                    <AutocompleteSection showDivider title="Rest">
                        {
                            nations.filter(n => !["europe","africa","asia","oceania","north-america","south-america"].includes(n.cont_id)).map(n => 
                            <AutocompleteItem key={n.id} onClick={() => handleFiltersChange(n.id, "nationality")}>{n.name}</AutocompleteItem>
                            )
                        }
                    </AutocompleteSection>
                    <AutocompleteItem key="" onClick={() => handleFiltersChange("", "nationality")}>World</AutocompleteItem>
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

                <Autocomplete
                label="Event"
                shouldCloseOnBlur
                selectedKey={filters.event}
                onSelectionChange={(key) => handleFiltersChange(key as string, "event")}
                placeholder="Search by event"
                defaultItems={[{ id: "", name: "All events" }, ...events]}
                variant="faded"
                size="sm"
                radius="sm"
                startContent={filters.event && <span className={`cubing-icon event-${filters.event}`}></span>}
                fullWidth={isDrawer}
                className="lg:w-1/6 w-full"
                onClear={() => handleFiltersChange("", "event")}
                >
                    {(event) => <AutocompleteItem key={event.id} textValue={event.name} onClick={() => handleFiltersChange(event.id, "event")}><span className={`cubing-icon event-${event.id}`}></span> {event.name}</AutocompleteItem>}
                </Autocomplete>

                <Select
                className="lg:w-1/6 w-full"
                label="Year (multiple)"
                placeholder="Select one or more years"
                variant="faded"
                size="sm"
                radius="sm"
                isClearable
                onClear={() => handleFiltersChange([], "year")}
                selectedKeys={filters.year.length ? filters.year : []}
                selectionMode="multiple"
                onChange={handleSelectionChange}
                >
                    {years.map((year) =><SelectItem key={year.year}>{year.year}</SelectItem>)}
                </Select>

                <Select
                className="lg:w-1/6 w-full"
                label="Order by"
                variant="faded"
                size="sm"
                radius="sm"
                selectedKeys={filters.col_order ? [filters.col_order + (filters.ascending ? "asc" : "desc")] : ["total_medalsdesc"]}
                >
                    {
                        columns.filter((column) => column.key !== "country_id").map((column) => (
                        <>
                            <SelectItem key={`${column.key}asc`} textValue={column.label + " ascending"} onClick={() => handleFiltersChange(column.key, "col_order", true)}>{column.label} ascending</SelectItem>
                            <SelectItem key={`${column.key}desc`} textValue={column.label + " descending"} onClick={() => handleFiltersChange(column.key, "col_order", false)}>{column.label} descending</SelectItem>
                        </>
                    ))
                    }
                </Select>
            </div>
            <div className="flex lg:flex-row flex-col lg:justify-around">
                <CheckboxGroup
                color="warning"
                label="More filters"
                orientation="horizontal"
                onChange={(v) => handleMoreFiltersChange(v)}
                >
                    <Checkbox value="no_golds">Show only people with no gold medals</Checkbox>
                    <Checkbox value="no_silvers">Show only people with no silver medals</Checkbox>
                    <Checkbox value="no_bronzes">Show only people with no bronze medals</Checkbox>
                </CheckboxGroup>
            </div>
        </div>
    )
}