import { PersonMetType, PersonType } from "@/types"
import StatTable from "./StatTable"

export default function CompSection({
    person,
    peopleMet,
    calculatePeopleMet
} : {
    person: PersonType,
    peopleMet: PersonMetType,
    calculatePeopleMet: (id: string, page: number, pageSize: number) => Promise<any>
}){
    function handlePagination (page: number, pageSize: number) {
        calculatePeopleMet(person.id, page, pageSize)
    }

    return (
        <div className="py-5">
            <p className="text-lg pt-5">This person met {peopleMet.total} different persons in all competitions</p>
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