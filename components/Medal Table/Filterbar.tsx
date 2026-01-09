import {Input} from "@heroui/input";
import {Autocomplete, AutocompleteItem} from "@heroui/autocomplete"
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
} : {
    handleFiltersChange: (value: string, key: string, ascending?: boolean) => void,
    handleMoreFiltersChange: (value: string[]) => void,
    filters: FiltersType,
    nations: NationType[],
    events: EventType[],
    years: {year: string}[],
}){
    return (
        <div className="flex flex-col gap-3">
            <div className="flex lg:flex-row flex-col lg:justify-around">
                <Input
                value={filters.name}
                placeholder="Search by name"
                isClearable
                size="lg"
                radius="sm"
                startContent={<FaSearch />}
                fullWidth={false}
                className="lg:w-1/6 w-full"
                variant="faded"
                onChange={(e) => handleFiltersChange(e.target.value, "name")}
                onClear={() => handleFiltersChange("", "name")}
                />

                <Autocomplete
                label="Nationality"
                shouldCloseOnBlur
                onSelectionChange={(key) => handleFiltersChange(key as string, "nationality")}
                placeholder="Search by nationality"
                defaultItems={[{ id: "", name: "World" }, ...nations]}
                variant="faded"
                size="sm"
                radius="sm"
                startContent={filters.nationality && <Flag code={filters.nationality} width={20}/>}
                fullWidth={false}
                className="lg:w-1/6 w-full"
                onClear={() => handleFiltersChange("", "nationality")}
                >
                    {(nation) => <AutocompleteItem key={nation.id} onClick={() => handleFiltersChange(nation.id, "nationality")}>{nation.name}</AutocompleteItem>}
                </Autocomplete>

                <Autocomplete
                label="Event"
                shouldCloseOnBlur
                onSelectionChange={(key) => handleFiltersChange(key as string, "event")}
                placeholder="Search by event"
                defaultItems={[{ id: "", name: "All events" }, ...events]}
                variant="faded"
                size="sm"
                radius="sm"
                startContent={filters.event && <span className={`cubing-icon event-${filters.event}`}></span>}
                fullWidth={false}
                className="lg:w-1/6 w-full"
                onClear={() => handleFiltersChange("", "event")}
                >
                    {(event) => <AutocompleteItem key={event.id} textValue={event.name} onClick={() => handleFiltersChange(event.id, "event")}><span className={`cubing-icon event-${event.id}`}></span> {event.name}</AutocompleteItem>}
                </Autocomplete>

                <Autocomplete
                label="Year"
                shouldCloseOnBlur
                onSelectionChange={(key) => handleFiltersChange(key as string, "year")}
                placeholder="Search by year"
                defaultItems={[{ year: "" }, ...years]}
                variant="faded"
                size="sm"
                radius="sm"
                fullWidth={false}
                className="lg:w-1/6 w-full"
                onClear={() => handleFiltersChange("", "year")}
                >
                    {(year) => <AutocompleteItem key={year.year} textValue={year.year ? year.year : "All years"} onClick={() => handleFiltersChange(year.year, "year")}>{year.year ? year.year : "All years"}</AutocompleteItem>}
                </Autocomplete>

                <Select
                className="lg:w-1/6 w-full"
                label="Order by"
                variant="faded"
                size="sm"
                radius="sm"
                defaultSelectedKeys={["total_medalsdesc"]}
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