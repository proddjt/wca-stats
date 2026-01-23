import { useEffect, useRef, useState } from "react";

import useIsLoading from "@/Context/IsLoading/useIsLoading";

import { createClient } from "@/lib/supabase/client";
import { showToast } from "@/lib/Toast";
import { PersonMetType, PersonType, StatsFiltersType } from "@/types";
import { decodeMBF, safe } from "@/Utils/functions";
import { useRouter } from "next/navigation";
import { calculateCities, calculateDelegatesMet, calculateLastPodiums, calculateMedalsByCountry } from "@/app/actions/stats";

export default function useStats(id: string){
    const [person, setPerson] = useState<PersonType>();
    const [peopleMet, setPeopleMet] = useState<PersonMetType | undefined>();
    const [filters, setFilters] = useState<StatsFiltersType>({
        year: "all"
    });
    const [loadingValue, setLoadingValue] = useState(0);
    const regions = useRef<string[]>();
    const int_cities = useRef<{city: string, country: string}[]>([]);
    const ita_cities = useRef<{city: string, region: string}[]>([]);
    

    const {showLoader} = useIsLoading();

    const supabase = createClient();

    const router = useRouter();

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

                // PEOPLE MET
                await calculatePeopleMet(person_data.id, 1, 50);
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
                person_data.last_medals = await calculateLastPodiums(person_data, filters);
                setLoadingValue(60);
                
                // MEDALS BY COUNTRY
                person_data.medals_by_country = await calculateMedalsByCountry(person_data, filters);
                setLoadingValue(70);

                // DELEGATES MET
                person_data.delegates_met = await calculateDelegatesMet(person_data);
                setLoadingValue(80);

                console.log(person_data);

                // STATE SET
                setPerson(person_data)

                // CITIES
                const {new_ita, new_int} = await calculateCities(person_data);
                if (new_ita) ita_cities.current = new_ita
                if (new_int) int_cities.current = new_int
                setLoadingValue(90);

                // REGIONS
                regions.current = ita_cities.current.map(c => c.region)
                .filter((value, index, self) => self.indexOf(value) === index && !value.includes("Multiple cities non trovata nell'elenco"))
                .sort((a, b) => a.localeCompare(b))
                setLoadingValue(100);
            }
        } catch (error: any) {
            console.log(error);
            
            if (error.code && error.code === 404) showToast("Attention!", "WCA ID non found.", "danger")
            else showToast("Attention!", JSON.stringify(error), "danger")
            return router.push("/person-stats")
        }
    }

    function resetPerson(){
        setPerson(undefined)
        setPeopleMet(undefined)
        setLoadingValue(0)
        regions.current = []
        int_cities.current = []
        ita_cities.current = []
        return router.back()
    }

    function handleFiltersChange(value: string | string[] | [], key: string) {
        if (!value) setFilters(prev => ({...prev, [key]: ""}))
        else setFilters(prev => ({...prev, [key]: value}))
    }

    // async function calculatePeopleMet(id: string, page: number, pageSize: number){
    //     const { data: people_data, error: people_error } = await supabase
    //     .rpc("get_related_persons", {
    //         wca_id_input: id,
    //         page: page,
    //         page_size: pageSize
    //     })
    //     if (people_error) throw people_error
    //     if (people_data) setPeopleMet(people_data)
    // }

    async function calculatePeopleMet(id: string, page: number, pageSize: number){
        try{
            const { data, error } = await supabase.functions.invoke('get_related_person', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    wca_id_input: id,
                    page,
                    page_size: pageSize
                })
            })
            if (error) throw error + "people met"
            if (data) setPeopleMet(data.data)
        } catch (error) {
            showToast("Attention!", JSON.stringify(error), "danger")
        }
    }

    useEffect(() => {
        if (id) showLoader(getPersonStats)
    }, [filters])

    return {
        person,
        regions,
        ita_cities,
        int_cities,
        loadingValue,
        filters,
        peopleMet,
        resetPerson,
        handleFiltersChange,
        calculatePeopleMet
    }
}