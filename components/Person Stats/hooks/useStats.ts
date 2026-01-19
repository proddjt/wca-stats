import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";

import useIsLoading from "@/Context/IsLoading/useIsLoading";

import { createClient } from "@/lib/supabase/client";
import { showToast } from "@/lib/Toast";
import { PersonType, StatsFiltersType } from "@/types";
import { decodeMBF, parseString, safe } from "@/Utils/functions";
import { it_cities } from "@/Utils/it_cities";

export default function useStats(){
    const [id, setId] = useState<string>("");
    const [person, setPerson] = useState<PersonType>();
    const [filters, setFilters] = useState<StatsFiltersType>({
        year: "all"
    });
    const [loadingValue, setLoadingValue] = useState(0);
    const regions = useRef<string[]>();
    const int_cities = useRef<{city: string, country: string}[]>([]);
    const ita_cities = useRef<{city: string, region: string}[]>([]);

    const {showLoader} = useIsLoading();

    const supabase = createClient();

    async function getPersonStats(){
        try {
            setLoadingValue(0);

            // PERSON
            const [person_error, response] = await safe(fetch(`https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/persons/${id}.json`));
            if (person_error) throw person_error
            if (!response.ok) throw {code: response.status}
            const person_data = await response.json();
            setLoadingValue(10);

            if (person_data){

                // IMAGE
                const [image_error, response] = await safe(fetch(`https://www.worldcubeassociation.org/api/v0/persons/${id}.json`));
                if (image_error) throw image_error
                if (!response.ok) throw {code: response.status}
                const img_data = await response.json();
                if (img_data.person.avatar.status === "approved" && img_data.person.avatar.url && !img_data.person.avatar.is_default) person_data.img = img_data.person.avatar.url
                setLoadingValue(20);

                // REGION
                const { data: region_data, error: region_error } = await supabase
                .from("persons")
                .select("region")
                .eq("wca_id", person_data.id)
                if (region_error) throw region_error
                if (region_data) person_data.region = region_data[0].region
                else person_data.region = ""
                setLoadingValue(30);

                // MEDALS BY COUNTRY
                const { data: medals_data, error: medals_error } = await supabase
                .rpc("get_medals_by_country", {
                    wca_id: person_data.id,
                    year_input: filters.year
                })
                if (medals_error) throw medals_error
                if (medals_data) person_data.medals_by_country = medals_data
                setLoadingValue(40);

                // TIME PASSED SOLVING
                const totals: Record<string, number> = {};

                for (const competitionId in person_data.results) {
                    if (filters.year !== "all" && competitionId.slice(-4) !== filters.year) return

                    const events = person_data.results[competitionId];

                    for (const eventId in events) {
                        if (!totals[eventId]) totals[eventId] = 0;

                        const rounds = events[eventId];

                        for (const round of rounds) {
                            for (const solve of round.solves) {
                            if (solve <= 0) continue;

                            // 333fm → ogni solve vale 1 ora
                            if (eventId === "333fm") {
                                totals[eventId] += 3600; // secondi
                                continue;
                            }

                            // 333mbf / 333mbo → decode
                            if (eventId === "333mbf" || eventId === "333mbo") {
                                const decoded = decodeMBF(solve);
                                if (decoded !== null) {
                                totals[eventId] += decoded;
                                }
                                continue;
                            }

                            // Eventi normali → valore in millisecondi
                            totals[eventId] = Math.round((totals[eventId] + solve / 100) * 100) / 100
                            }
                        }
                    }
                }
                person_data.time_passed = totals;
                setLoadingValue(50);
                
                // LAST PODIUMS
                const { data, error } = await supabase
                .rpc("get_last_podiums", {
                    wca_id: person_data.id,
                    comp_ids: [
                        ...person_data.championshipIds.filter((c: string) => 
                            filters.year === "all" ? true : c.slice(-4) === filters.year
                        ),
                        ...person_data.competitionIds.filter((c: string) => 
                            filters.year === "all" ? true : c.slice(-4) === filters.year
                        )
                    ]
                })
                if (error) throw error
                if (data) person_data.last_medals = data[0]
                setLoadingValue(60);

                // PEOPLE MET
                const { data: people_data, error: people_error } = await supabase
                .rpc("get_related_persons", {wca_id_input: person_data.id})
                if (people_error) throw people_error
                if (people_data) person_data.people_met = people_data
                setLoadingValue(70);

                // DELEGATES MET
                const { data: delegate_data, error: delegate_error } = await supabase
                .rpc("get_delegates", {wca_id_input: person_data.id})
                if (delegate_error) throw delegate_error
                if (delegate_data) person_data.delegates_met = delegate_data.filter((delegate: PersonType) => delegate.name !== person_data.name)
                setLoadingValue(80);

                console.log(person_data);

                // STATE SET
                setPerson(person_data)

                // CITIES
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
                setLoadingValue(90);

                // REGIONS
                regions.current = ita_cities.current.map(c => c.region)
                .filter((value, index, self) => self.indexOf(value) === index && !value.includes("Multiple cities non trovata nell'elenco"))
                .sort((a, b) => a.localeCompare(b))
                setLoadingValue(100);
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

    function sendID(){
        showLoader(getPersonStats)
    }

    function handleFiltersChange(value: string | string[] | [], key: string) {
        if (!value) setFilters(prev => ({...prev, [key]: ""}))
        else setFilters(prev => ({...prev, [key]: value}))
    }

    useEffect(() => {
        if (id) showLoader(getPersonStats)
    }, [filters])

    return {
        id,
        person,
        regions,
        ita_cities,
        int_cities,
        loadingValue,
        filters,
        setId,
        sendID,
        resetPerson,
        handleFiltersChange
    }
}