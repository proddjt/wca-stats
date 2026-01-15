import { PersonType } from "@/types"
import { Button } from "@heroui/button"
import { Image } from "@heroui/image"
import Flag from "react-world-flags"

import { TbArrowBackUp } from "react-icons/tb";
import dayjs from "dayjs";


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
                width={300}
                isBlurred
                radius="sm"
                className="mb-5"
                />
            }
            <h1 className="font-bold lg:text-5xl text-2xl">{person.id}<br/>{person.name}</h1>
            <Flag code={person.country} width="30" className="mb-5"/>
            <p className="text-lg">Questa persona ha gareggiato</p>
            <p className="text-lg">In {int_cities?.length || 0} città in totale*</p>
            <p className="text-lg">In {(int_cities?.length || 0) - (ita_cities?.length || 0)} città internazionali</p>
            <p className="text-lg pb-5">In {ita_cities?.length} città italiane</p>
            <p className="text-lg">Questa persona ha gareggiato in {regions?.length} regioni*</p>
            <p className="text-lg pb-5">Lista delle regioni**: <br/>{regions?.join(", ")}</p>
            <p className="text-lg">L'ultimo oro è arrivato il {dayjs(person.last_medals.last_pos1_date).format("DD/MM/YYYY")}</p>
            <p className="text-lg">L'ultimo argento è arrivato il {dayjs(person.last_medals.last_pos2_date).format("DD/MM/YYYY")}</p>
            <p className="text-lg pb-3">L'ultimo bronzo è arrivato il {dayjs(person.last_medals.last_pos3_date).format("DD/MM/YYYY")}</p>
            <p className="text-xs italic text-gray-400 pb-1">(*) Il numero di regioni e di città potrebbe essere leggermente inesatto in alcuni casi, poichè la WCA non fornisce dati riguardanti la sede in cui si ha partecipato in una gara con multiple venues.</p>
            <p className="text-xs italic text-gray-400">(**) Se all'interno della lista delle regioni dovesse apparire una dicitura del tipo "Roma non trovata nell'elenco", si prega di contattare lo sviluppatore per comunicare il nome della città non riconosciuta e sistemare il bug.</p>
        </div>
    )
}