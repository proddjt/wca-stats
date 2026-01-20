'use client'

import useStats from "./hooks/useStats";
import useIsLoading from "@/Context/IsLoading/useIsLoading";

import PersonStatistics from "./PersonStatistics";
import ProgressLoader from "../Layout/ProgressLoader";
import { useRef } from "react";
import { useParams } from "next/navigation";

export default function PersonStatsPage(){
    const params = useParams();
    const id = useRef<string>(params.wca_id as string || "");
    const {
        person,
        regions,
        int_cities,
        ita_cities,
        loadingValue,
        filters,
        peopleMet,
        resetPerson,
        handleFiltersChange,
        calculatePeopleMet
    } = useStats(id.current);

    const {isPending} = useIsLoading();

    if (isPending || !person || !params) return <ProgressLoader value={loadingValue}/>

    return (
        <div className="grow flex flex-col justify-center items-center gap-5">
            <PersonStatistics
            person={person}
            regions={regions.current}
            int_cities={int_cities.current}
            ita_cities={ita_cities.current}
            resetPerson={resetPerson}
            handleFiltersChange={handleFiltersChange}
            filters={filters}
            calculatePeopleMet={calculatePeopleMet}
            peopleMet={peopleMet}
            />
        </div>
    )
}