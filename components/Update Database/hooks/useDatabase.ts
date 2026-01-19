import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import dayjs from 'dayjs'
import pLimit from "p-limit";

import useIsLoading from "@/Context/IsLoading/useIsLoading";

import { showToast } from "@/lib/Toast";
import { continentsTable } from "@/Utils/continents";
import useUser from "@/Context/User/useUser";

export default function useDatabase () {
    const {showLoader} = useIsLoading();

    const {
        user
    } = useUser();

    const supabase = createClient();

    async function getPages(url: string){
        try {
            const response = await fetch(url)
            const data = await response.json();
            return Math.ceil(data.total / data.pagination.size)
        } catch (error) {
            showToast("Attention!", JSON.stringify(error), "danger")
            return null
        }
    }

    async function updateEvents(){
        try {
            const response = await fetch("https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/events.json")
            const data = await response.json();
            data.items.forEach(async (e: any) => {
                try {
                    const { error } = await supabase
                    .from("events")
                    .upsert({
                        id: e.id,
                        name: e.name,
                        rank_type: e.format,
                        last_update: new Date().toISOString()
                    }, { onConflict: "id" });
                    if (error) throw error.message
                } catch (error) {
                    showToast("Attention!", JSON.stringify(error), "danger")
                }
            })
            showToast("Success!", "Events updated", "success")
        } catch (error) {
            showToast("Attention!", JSON.stringify(error), "danger")
        }
    }

    async function updateCountries(){
        try {
            const response = await fetch("https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/countries.json")
            const data = await response.json();
            data.items.forEach(async (c: any, i: number) => {
                try {
                    const { error } = await supabase
                    .from("countries")
                    .upsert({
                        id: c.iso2Code,
                        name: c.name,
                        cont_id: continentsTable.find((ct: any) => ct.country === c.name)?.continent.toLowerCase(),
                        last_update: new Date().toISOString()
                    }, { onConflict: "id" });
                    if (error) throw error.message
                } catch (error) {
                    showToast("Attention!", JSON.stringify(error), "danger")
                }
            })
            showToast("Success!", "Countries updated", "success")
        } catch (error) {
            showToast("Attention!", JSON.stringify(error), "danger")
        }
    }

    async function updateContinents(){
        try {
            const response = await fetch("https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/continents.json")
            const data = await response.json();
            data.items.forEach(async (c: any) => {
                try {
                    const { error } = await supabase
                    .from("continents")
                    .upsert({
                        id: c.id,
                        name: c.name,
                        last_update: new Date().toISOString()
                    }, { onConflict: "id" });
                    if (error) throw error.message
                } catch (error) {
                    showToast("Attention!", JSON.stringify(error), "danger")
                }
            })
            showToast("Success!", "Continents updated", "success")
        } catch (error) {
            showToast("Attention!", JSON.stringify(error), "danger")
        }
    }

    async function updateComps(){
        const pages = await getPages("https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/competitions.json");
        if (pages) {
            for (let i = 1; i <= pages; i++) {
                const response = await fetch(`https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/competitions-page-${i}.json`)
                const data = await response.json();
                const competitions = data.items.filter((c:any) => !c.isCanceled && dayjs(c.date.from) < dayjs() ).map((c: any) => ({
                    id: c.id,
                    name: c.name,
                    city: c.city,
                    country_id: c.country,
                    start_date: c.date.from,
                    end_date: c.date.till,
                    year: c.date.from.slice(0, 4),
                    delegates: [
                        ...c.wcaDelegates.map((d: any) => d.name)
                    ],
                    last_update: new Date().toISOString()
                }))
                try {
                    const { error } = await supabase
                    .from("competitions")
                    .upsert(competitions, { onConflict: "id" });
                    if (error){
                        throw error.message
                    }
                } catch (error) {
                    showToast("Attention!", JSON.stringify(error), "danger")
                }
            }
            showToast("Success!", "Competitions updated", "success")
        }
    }

    async function updatePersons(){
        const pages = await getPages("https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/persons.json");
        if (pages) {
            for (let i = 1; i <= pages; i++) {
                const response = await fetch(`https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/persons-page-${i}.json`)
                const data = await response.json();
                const persons = data.items.map((p: any) => ({
                    wca_id: p.id,
                    name: p.name,
                    country_id: p.country,
                    comp_ids: [...p.competitionIds],
                    last_update: new Date().toISOString()
                }))
                try {
                    const { error } = await supabase
                    .from("persons")
                    .upsert(persons, { onConflict: "wca_id" });
                    if (error){
                        throw error.message
                    }
                } catch (error) {
                    showToast("Attention!", JSON.stringify(error), "danger")
                }
            }
            showToast("Success!", "Persons updated", "success")
        }
    }

    async function updateResults(){
        const limit = pLimit(15)
        let comps_ids = []
        try {
            const {data, error} = await supabase
            .from("competitions")
            .select("id", { count: "exact" })
            if (error) throw error.message
            comps_ids = data.map((c: any) => c.id)
        } catch (error) {
            showToast("Attention!", JSON.stringify(error), "danger")
        }
        if (comps_ids.length){
            await Promise.all(
                comps_ids.map(id =>
                    limit(async () => {
                        const response = await fetch(`https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/results/${id}.json`);
                        const data = await response.json();
                        const final_results = data.items.filter((r: any) => r.round === "Final" && [1,2,3].includes(r.position) );
                        const mapped = final_results.map((r: any) => ({
                            id: r.competitionId+r.eventId+r.position+r.personId,
                            competition_id: r.competitionId,
                            event_id: r.eventId,
                            person_id: r.personId,
                            position: r.position,
                            year: r.competitionId.slice(-4),
                            last_update: new Date().toISOString()
                        }));
                        await supabase
                        .from("results")
                        .upsert(mapped, { onConflict: "id" });
                    })
                )
            );
        }
        showToast("Success!", "Results updated", "success")
        try{
            await fetch("/api/run-update-results");
            showToast("Success!", "Results updated", "success")
        } catch (error) {
            showToast("Attention!", JSON.stringify(error), "danger")
        }
    }

    function doUpdate(action: "events" | "countries" | "comps" | "persons" | "medals" | "results" | "continents"){
        switch (action) {
            case "events":
                showLoader(updateEvents)
                break;
            case "countries":
                showLoader(updateCountries)
                break;
            case "comps":
                showLoader(updateComps)
                break;
            case "persons":
                showLoader(updatePersons)
                break;
            case "continents":
                showLoader(updateContinents)
                break;
            case "results":
                showLoader(updateResults)
                break;
            default:
                break;
        }
    }

    return {
        user,
        doUpdate,
    };
}
