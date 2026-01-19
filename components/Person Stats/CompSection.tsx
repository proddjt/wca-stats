import { PersonType } from "@/types"
import StatTable from "./StatTable"

export default function CompSection({
    person,
    calculatePeopleMet
} : {
    person: PersonType,
    calculatePeopleMet: (id: string, page: number, pageSize: number) => Promise<any>
}){
    function handlePagination (page: number, pageSize: number) {
        calculatePeopleMet(person.id, page, pageSize)
    }

    return (
        <div className="py-5">
            <p className="text-lg pt-5">This person met {person.people_met.total} different persons in all competitions</p>
            <StatTable
            data={{
                cols: [{label: "Name", key: "name"}, {label: "WCA ID", key: "wca_id"}, {label: "Country", key: "country"}, {label: "Competition number", key: "comp_number"}],
                rows: person.people_met.results.map((person) => ({...person, key: person.wca_id, comp_number: person.comp_ids.length}))
            }}
            mode=""
            paginated
            page_number={person.people_met.page}
            pageSize={person.people_met.page_size}
            total={person.people_met.total}
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