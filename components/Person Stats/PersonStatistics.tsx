import { PersonType } from "@/types"
import { Button } from "@heroui/button"
import { Image } from "@heroui/image"
import Flag from "react-world-flags"

import { TbArrowBackUp } from "react-icons/tb";


export default function PersonStatistics({
    person,
    regions,
    int_cities,
    ita_cities,
    resetPerson
} : {
    person: PersonType,
    regions: string[] | undefined,
    int_cities: string[] | undefined,
    ita_cities: string[] | undefined,
    resetPerson: () => void
}){
    return (
        <div className="p-5 grow flex flex-col items-center text-center">
            <Button
            color="warning"
            variant="flat"
            size="sm"
            onPress={resetPerson}
            startContent={<TbArrowBackUp/>}
            className="self-start mb-5"
            >
                Go back
            </Button>
            {
                person.img &&
                <Image
                alt="person avatar"
                src={person.img}
                width={15}
                isBlurred
                radius="sm"
                className="mb-5"
                />
            }
            <h1 className="font-bold lg:text-5xl text-2xl">{person.id}<br/>{person.name}</h1>
            <Flag code={person.country} width="30" className="mb-5"/>
            <p className="text-lg">Questa persona {person.name} ha gareggiato in {regions?.length} regioni</p>
            <p className="text-lg">In {(int_cities?.length || 0) - (ita_cities?.length || 0)} città internazionali</p>
            <p className="text-lg">In {ita_cities?.length} città italiane</p>
            <p className="text-lg">Lista di regioni: {regions?.join(", ")}</p>

        </div>
    )
}