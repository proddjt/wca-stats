import { useRef } from "react"
import { Input } from "@heroui/input"
import { FaSearch } from "react-icons/fa";
import { IoSend } from "react-icons/io5";


import StatTable from "./StatTable"


import { PersonMetType, PersonType } from "@/types"
import { Button } from "@heroui/button";

export default function CompSection({
    person,
    peopleMet,
    calculatePeopleMet,
    handleFiltersChange
} : {
    person: PersonType,
    peopleMet: PersonMetType,
    calculatePeopleMet: (id: string, page: number, pageSize: number) => Promise<any>,
    handleFiltersChange: (value: string | string[] | [], key: string) => void
}){
    const nameValue = useRef<string>("");
    function handlePagination (page: number, pageSize: number) {
        calculatePeopleMet(person.id, page, pageSize)
    }

    function handleSend () {
        handleFiltersChange(nameValue.current, "name")
    }

    return (
        <div className="py-5">
            <p className="text-lg pt-5">This person met {peopleMet.total} different persons in all competitions</p>
            {/* <div className="flex gap-2 items-center justify-center">
                <Input
                label="Search for a person"
                defaultValue=""
                onValueChange={(e) => nameValue.current = e}
                size="sm"
                isClearable
                startContent={<FaSearch/>}
                />
                <Button isIconOnly aria-label="Send" color="warning" onPress={handleSend}>
                    <IoSend />
                </Button>
            </div> */}
            <StatTable
            data={{
                cols: [{label: "Name", key: "name"}, {label: "WCA ID", key: "wca_id"}, {label: "Country", key: "country"}, {label: "Competition number", key: "comp_number"}],
                rows: peopleMet.results.map((person) => ({...person, key: person.wca_id, comp_number: person.comp_ids.length}))
            }}
            mode=""
            paginated
            page_number={peopleMet.page}
            pageSize={peopleMet.page_size}
            total={peopleMet.total}
            handlePagination={handlePagination}
            />

            <p className="text-lg pt-5">This person met {person.delegates_met.length} different delegates in all competitions</p>
            
            <StatTable
            data={{
                cols: [{label: "Name", key: "name"}, {label: "WCA ID", key: "wca_id"}, {label: "Country", key: "country"}, {label: "Competition number", key: "comp_number"}],
                rows: person.delegates_met.map((person) => ({...person, key: person.wca_id, comp_number: person.comp_ids.length}))
            }}
            mode=""
            paginated
            />
        </div>
    )
}