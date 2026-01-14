import { useRef, useState } from "react";
import dayjs from "dayjs";

import useIsLoading from "@/Context/IsLoading/useIsLoading";

import { createClient } from "@/lib/supabase/client";
import { showToast } from "@/lib/Toast";
import { PersonType } from "@/types";
import { parseString, safe } from "@/Utils/functions";
import { it_cities } from "@/Utils/it_cities";


export default function useStats(){
    const [person, setPerson] = useState<PersonType>();
    const regions = useRef<string[]>();
    const int_cities = useRef<string[] | []>([]);
    const ita_cities = useRef<string[] | []>([]);

    const {showLoader} = useIsLoading();

    const supabase = createClient();

    async function getPersonStats(id: string){
        try {

            const [person_error, response] = await safe(fetch(`https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/persons/${id}.json`));
            if (person_error) throw person_error
            if (!response.ok) throw {code: response.status}
            const person_data = await response.json();

            if (person_data){

                const [image_error, response] = await safe(fetch(`https://www.worldcubeassociation.org/api/v0/persons/${id}.json`));
                if (image_error) throw image_error
                if (!response.ok) throw {code: response.status}
                const img_data = await response.json();
                if (img_data.person.avatar.status === "approved" && img_data.person.avatar.url && !img_data.person.avatar.is_default) person_data.img = img_data.person.avatar.url

                const { data, error } = await supabase.
                rpc("get_last_podiums", {
                    wca_id: person_data.id,
                    comp_ids: [...person_data.championshipIds, ...person_data.competitionIds]
                })
                if (error) throw error
                if (data) person_data.last_medals = data

                console.log(person_data);
                

                setPerson(person_data)

                const comps_ids = [...person_data.championshipIds, ...person_data.competitionIds]
                await Promise.all(
                    comps_ids.map(async compId => {

                        const [error, response] = await safe(fetch(`https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/competitions/${compId}.json`));
                        if (error) throw error
                        if (!response.ok) throw {code: response.status}

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
        } catch (error: any) {
            if (error.code && error.code === 404) return showToast("Attention!", "WCA ID non found.", "danger")
            return showToast("Attention!", JSON.stringify(error), "danger")
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