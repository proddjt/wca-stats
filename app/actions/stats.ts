"use server"

import { createClient } from "@/lib/supabase/server"
import { PersonType, StatsFiltersType } from "@/types"
import { parseString, safe } from "@/Utils/functions"
import { it_cities } from "@/Utils/it_cities"
import dayjs from "dayjs"

export async function calculateCities(person_data: PersonType){
    const new_ita = [] as any
    const new_int = [] as any
    const comps_ids = [...person_data.championshipIds, ...person_data.competitionIds]
    await Promise.all(
        comps_ids.map(async compId => {

            const [error, response] = await safe(fetch(`https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/competitions/${compId}.json`));
            if (error) throw error
            if (!response.ok) throw {code: response.status}

            const data = await response.json();
            const city = parseString(data.city);
            const ita_arr = new_ita as {city: string, region: string}[]
            const int_arr = new_int as {city: string, country: string}[]
            if (data.country === "IT" && !data.isCanceled && dayjs(data.date.from) < dayjs()){
                if (!ita_arr.some(c => c.city === city)) new_ita.push({city: city, region: it_cities.find(citta => citta.denominazione_ita.toLowerCase() === city.toLowerCase() )?.denominazione_regione || `${city} non trovata nell'elenco`})
            }
            if (!int_arr.some(c => c.city === city)) new_int.push({city: city, country: data.country})
        })
    );
    
    return {new_ita, new_int}
}

export async function calculateDelegatesMet(person_data: PersonType){
    const supabase = await createClient()

    const { data: delegate_data, error: delegate_error } = await supabase
    .rpc("get_delegates", {wca_id_input: person_data.id})
    if (delegate_error) throw delegate_error + "delegates met"
    if (delegate_data) return delegate_data.filter((delegate: PersonType) => delegate.name !== person_data.name)
}

export async function calculateLastPodiums(person_data: PersonType, filters: StatsFiltersType){
    const supabase = await createClient()

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
    if (error) throw error + "last podiums"
    if (data) return data[0]
}

export async function calculateMedalsByCountry(person_data: PersonType, filters: StatsFiltersType){
    const supabase = await createClient()
    
    const { data: medals_data, error: medals_error } = await supabase
    .rpc("get_medals_by_country", {
        wca_id: person_data.id,
        year_input: filters.year
    })
    if (medals_error) throw medals_error + "medals by country"
    if (medals_data) return medals_data
}