import useIsLoading from "@/Context/IsLoading/useIsLoading";
import { createClient } from "@/lib/supabase/client";
import { showToast } from "@/lib/Toast";
import { PersonType } from "@/types";
import { parseString } from "@/Utils/functions";
import { it_cities } from "@/Utils/it_cities";
import dayjs from "dayjs";
import { useRef, useState } from "react";


export default function useStats(){
    const [person, setPerson] = useState<PersonType>();
    const regions = useRef<string[]>();
    const int_cities = useRef<string[] | []>([]);
    const ita_cities = useRef<string[] | []>([]);

    const {showLoader} = useIsLoading();

    const supabase = createClient();

    async function getPersonStats(id: string){
        try {
            const response = await fetch(`https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/persons/${id}.json`)
            const data = await response.json();
            if (data){
                setPerson(data)
                const comps_ids = [...data.championshipIds, ...data.competitionIds]
                await Promise.all(
                    comps_ids.map(async compId => {
                        const response = await fetch( `https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/competitions/${compId}.json` );
                        const data = await response.json();
                        const city = parseString(data.city);
                        const ita_arr = ita_cities.current as string[]
                        const int_arr = int_cities.current as string[]
                        if (data.country === "IT" && !data.isCanceled && dayjs(data.date.from) < dayjs()){
                            if (!ita_arr.includes(city)) ita_cities.current = [...ita_cities.current, city]
                        }
                        if (!int_arr.includes(city)) int_cities.current = [...int_cities.current, city]
                    })
                );
                regions.current = ita_cities.current
                .map(c => it_cities.find(city => city.denominazione_ita.toLowerCase() === c.toLowerCase() )?.denominazione_regione || `${c} non trovata nell'elenco` )
                .filter((value, index, self) => self.indexOf(value) === index)
                .sort((a, b) => a.localeCompare(b));
            }
        } catch (error) {
            showToast("Attention!", JSON.stringify(error), "danger")
        }
    }

    function resetPerson(){
        setPerson(undefined)
        regions.current = []
        int_cities.current = []
        ita_cities.current = []
    }

    function sendID(id: string){
        showLoader(() => getPersonStats(id))
    }

    return {
        person,
        regions,
        ita_cities,
        int_cities,
        sendID,
        resetPerson
    }
}