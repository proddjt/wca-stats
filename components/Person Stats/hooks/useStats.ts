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
    const int_cities = useRef<{city: string, country: string}[]>([]);
    const ita_cities = useRef<{city: string, region: string}[]>([]);

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

                const { data: region_data, error: region_error } = await supabase
                .from("persons")
                .select("region")
                .eq("wca_id", person_data.id)

                if (region_error) throw region_error
                if (region_data) person_data.region = region_data[0].region
                else person_data.region = ""

                const { data, error } = await supabase
                .rpc("get_last_podiums", {
                    wca_id: person_data.id,
                    comp_ids: [...person_data.championshipIds, ...person_data.competitionIds]
                })
                if (error) throw error
                if (data) person_data.last_medals = data[0]

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
                        const ita_arr = ita_cities.current as {city: string, region: string}[]
                        const int_arr = int_cities.current as {city: string, country: string}[]
                        if (data.country === "IT" && !data.isCanceled && dayjs(data.date.from) < dayjs()){
                            if (!ita_arr.some(c => c.city === city)) ita_cities.current.push({city: city, region: it_cities.find(citta => citta.denominazione_ita.toLowerCase() === city.toLowerCase() )?.denominazione_regione || `${city} non trovata nell'elenco`})
                        }
                        if (!int_arr.some(c => c.city === city)) int_cities.current.push({city: city, country: data.country})
                    })
                );

                regions.current = ita_cities.current
                .filter((value, index, self) => self.indexOf(value) === index && !value.region.includes("Multiple cities non trovata nell'elenco"))
                .sort((a, b) => a.region.localeCompare(b.region))
                .map(r => r.region);
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