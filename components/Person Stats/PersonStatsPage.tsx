'use client'

import useStats from "./hooks/useStats";
import useIsLoading from "@/Context/IsLoading/useIsLoading";

import IDInput from "./IDInput";
import PersonStatistics from "./PersonStatistics";
import ProgressLoader from "../Layout/ProgressLoader";

export default function PersonStatsPage(){
    const {
        id,
        person,
        regions,
        int_cities,
        ita_cities,
        loadingValue,
        filters,
        setId,
        sendID,
        resetPerson,
        handleFiltersChange
    } = useStats();

    const {isPending} = useIsLoading();

    if (isPending) return <ProgressLoader value={loadingValue}/>

    return (
        <div className="grow flex flex-col justify-center items-center gap-5">
            {
                !person ?
                <IDInput
                id={id}
                setId={setId}
                sendID={sendID}
                />
                :
                <PersonStatistics
                person={person}
                regions={regions.current}
                int_cities={int_cities.current}
                ita_cities={ita_cities.current}
                resetPerson={resetPerson}
                handleFiltersChange={handleFiltersChange}
                filters={filters}
                />
            }
        </div>
    )
}