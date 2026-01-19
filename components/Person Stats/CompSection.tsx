import { PersonType } from "@/types"
import StatTable from "./StatTable"

export default function CompSection({
    person
} : {
    person: PersonType
}){
    return (
        <div className="py-5">
            <p className="text-lg pt-5">This person met {person.people_met.length} different persons in all competitions</p>
            <StatTable
            data={{
                cols: [{label: "Name", key: "name"}, {label: "WCA ID", key: "wca_id"}, {label: "Country", key: "country"}, {label: "Competition number", key: "comp_number"}],
                rows: person.people_met.map((person) => ({...person, key: person.wca_id, comp_number: person.comp_ids.length}))
            }}
            mode=""
            paginated
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