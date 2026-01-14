'use client'

import { useState } from "react";
import { Button } from "@heroui/button";

import useStats from "./hooks/useStats";
import IDInput from "./IDInput";
import PersonStatistics from "./PersonStatistics";
import useIsLoading from "@/Context/IsLoading/useIsLoading";
import Loader from "../Layout/Loader";

export default function PersonStatsPage(){
    const {
        person,
        regions,
        int_cities,
        ita_cities,
        sendID,
        resetPerson
    } = useStats();

    const {isPending} = useIsLoading();

    if (isPending) return <Loader/>

    return (
        <div className="grow flex flex-col justify-center items-center gap-5">
            {
                !person ?
                <IDInput sendID={sendID}/>
                :
                <PersonStatistics person={person} regions={regions.current} int_cities={int_cities.current} ita_cities={ita_cities.current} resetPerson={resetPerson}/>
            }
        </div>
    )
}