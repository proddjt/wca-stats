import dayjs from "dayjs";

import { diffToHuman, secondDiffToHuman } from "@/Utils/functions";

import { PersonType, StatsFiltersType } from "@/types";
import StatTable from "./StatTable";

const medals_by_country_cols = [
    {key: "country", label: "Country", sortable: true},
    {key: "golds", label: "Golds", sortable: true},
    {key: "silvers", label: "Silvers", sortable: true},
    {key: "bronzes", label: "Bronzes", sortable: true},
    {key: "total_medals", label: "Total medals", sortable: true}
]

export default function ResultSection({
    person,
    filters,
} : {
    person: PersonType,
    filters: StatsFiltersType
}){
    return (
        <div className="py-5">
            <div className="flex flex-col gap-1 pb-5 items-center">
                <p className="text-lg bg-amber-400 rounded-lg text-black p-1">
                {
                    person.last_medals.last_pos1_date ?
                    <span>
                        Last gold was on {dayjs(person.last_medals.last_pos1_date).format("DD-MM-YYYY")}, <b>{filters.year === "all" ? `${diffToHuman(person.last_medals.last_pos1_date)} ago` : ""} at {person.last_medals.last_pos1_comp}</b>. <br />
                        First gold was on {dayjs(person.last_medals.first_pos1_date).format("DD-MM-YYYY")}, <b>{filters.year === "all" ? `${diffToHuman(person.last_medals.first_pos1_date)} ago` : ""} at {person.last_medals.first_pos1_comp}</b>.
                    </span>
                    :
                    <span>
                        This person has never won a gold in {filters.year === "all" ? diffToHuman(person.last_medals.first_comp) : filters.year}
                    </span>
                }
                </p>
                <p className="text-lg bg-stone-300 rounded-lg text-black p-1">
                {
                    person.last_medals.last_pos2_date ?
                    <span>
                        Last silver was on {dayjs(person.last_medals.last_pos2_date).format("DD-MM-YYYY")}, <b>{filters.year === "all" ? `${diffToHuman(person.last_medals.last_pos2_date)} ago` : ""} at {person.last_medals.last_pos2_comp}</b>. <br />
                        First silver was on {dayjs(person.last_medals.first_pos2_date).format("DD-MM-YYYY")}, <b>{filters.year === "all" ? `${diffToHuman(person.last_medals.first_pos2_date)} ago` : ""} at {person.last_medals.first_pos2_comp}</b>.
                    </span>
                    :
                    <span>
                        This person has never won a silver in {filters.year === "all" ? diffToHuman(person.last_medals.first_comp) : filters.year}
                    </span>
                }
                </p>
                <p className="text-lg bg-amber-700 rounded-lg text-black p-1">
                {
                    person.last_medals.last_pos3_date ?
                    <span>
                        Last bronze was on {dayjs(person.last_medals.last_pos3_date).format("DD-MM-YYYY")}, <b>{filters.year === "all" ? `${diffToHuman(person.last_medals.last_pos3_date)} ago` : ""} at {person.last_medals.last_pos3_comp}</b>. <br />
                        First bronze was on {dayjs(person.last_medals.first_pos3_date).format("DD-MM-YYYY")}, <b>{filters.year === "all" ? `${diffToHuman(person.last_medals.first_pos3_date)} ago` : ""} at {person.last_medals.first_pos3_comp}</b>.
                    </span>
                    :
                    <span>
                        This person has never won a bronze in {filters.year === "all" ? diffToHuman(person.last_medals.first_comp) : filters.year}
                    </span>
                }
                </p>
            </div>
            <p className="text-lg">This person got {person.medals_by_country.reduce((a, b) => a + b.total_medals, 0)} medals in {person.medals_by_country.length} different {person.medals_by_country.length === 1 ? "country" : "countries"} across the world*</p>
            <StatTable
            data={{cols: medals_by_country_cols, rows: person.medals_by_country.map((medal) => ({...medal, key: medal.country}))}}
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
        </div>
    )
}