'use client'

import { useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

import { checkId } from "@/Utils/functions";

import useStats from "./hooks/useStats";

import { FaRegCheckCircle } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";


export default function PersonStatsPage(){
    const [id, setId] = useState<string>("");

    const {
        person,
        regions,
        int_cities,
        ita_cities,
        sendID,
        resetPerson
    } = useStats();

    return (
        <div className="grow flex flex-col justify-center items-center gap-5">
            {
                !person ?
                <>
                <h1 className="font-bold lg:text-5xl text-3xl">Insert a WCA ID</h1>
                <div className="flex flex-col justify-center items-center lg:w-1/8 w-7/10">

                    <Input
                    label="WCA ID"
                    id="wca_id"
                    size="sm"
                    type="text"
                    variant="faded"
                    value={id}
                    onChange={(e) => e.target.value.length <= 10 ? setId(e.target.value.toUpperCase()) : null}
                    endContent={id && id.length === 10 ? <FaRegCheckCircle color="green" size="1.2em"/> : <MdOutlineCancel color="red" size="1.2em"/>}
                    />

                    <Button
                    fullWidth
                    color="warning"
                    variant="bordered"
                    onPress={() => sendID(id)}
                    >
                        Submit
                    </Button>
                </div>
                </>
                :
                <>
                <h1 className="font-bold text-center lg:text-5xl text-3xl">{person.id}</h1>
                <p className="text-center text-lg">Questa persona {person.name} ha gareggiato in {regions?.current?.length} regioni</p>
                <p className="text-center text-lg">In {int_cities?.current?.length - ita_cities?.current?.length} città internazionali</p>
                <p className="text-center text-lg">In {ita_cities?.current?.length} città italiane</p>
                <p className="text-center text-lg">Lista di regioni: {regions?.current?.join(", ")}</p>

                <Button
                fullWidth
                color="warning"
                variant="bordered"
                onPress={resetPerson}
                >
                    Go back
                </Button>
                </>
            }
        </div>
    )
}