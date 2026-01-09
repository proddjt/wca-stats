import { useEffect, useState } from "react";

import { EventType, FiltersType, MedalType, NationType, PagesType, RowsType } from "@/types";
import { createClient } from "@/lib/supabase/client";
import useIsLoading from "@/Context/IsLoading/useIsLoading";
import { showToast } from "@/lib/Toast";
import { order } from "@/Utils/event-order";
import { sortRows } from "@/Utils/functions";


export default function useTable(){
    const supabase = createClient();
    const [rows, setRows] = useState<RowsType[]>([]);
    const [filters, setFilters] = useState<FiltersType>({
        nationality: '',
        year: '',
        event: '',
        name: '',
        col_order: 'total_medals',
        ascending: false,
        more_filters: {
            no_golds: false,
            no_silvers: false,
            no_bronzes: false
        }
    });
    const [nations, setNations] = useState<NationType[]>([]);
    const [events, setEvents] = useState<EventType[]>([]);
    const [years, setYears] = useState<{year: string}[]>([]);
    const [pages, setPages] = useState<PagesType>({page: 1, total: 0});

    const {showLoader} = useIsLoading();

    function handleFiltersChange(value: string, key: string, ascending?: boolean){
        setFilters(prev => ({...prev, [key]: value}))
        if (ascending !== undefined) setFilters(prev => ({...prev, ascending: ascending}))
    }

    function handleMoreFiltersChange(value: string[]){
        const newMoreFilters = {no_golds: false, no_silvers: false, no_bronzes: false};
        if (value.length){ 
            value.forEach(filter => newMoreFilters[filter as keyof typeof newMoreFilters] = true)
        }
        setFilters(prev => ({...prev, more_filters: newMoreFilters}))
    }

    async function getRowsFromPersons(){
        let query = supabase.from("persons").select("*", { count: "exact" });
        if (filters.name) query = query.ilike('name', `%${filters.name}%`);
        if (filters.nationality) query = query.ilike('country_id', `%${filters.nationality}%`);
        if (filters.year) query = query.eq('year', filters.year);
        if (filters.event) query = query.eq('event', filters.event);
        if (filters.more_filters.no_bronzes) query = query.eq('bronzes', 0);
        if (filters.more_filters.no_silvers) query = query.eq('silvers', 0);
        if (filters.more_filters.no_golds) query = query.eq('golds', 0);
        
        try {
            const { data, count, error } = await query
            .order(filters.col_order, { ascending: filters.ascending })
            .range((pages.page - 1) * 50, pages.page * 50 - 1);
            if (error) throw error.message
            setRows(data);
            if (count) setPages(prev => ({...prev, total: Math.ceil(count / 50)}));
        } catch (error) {
            showToast("Attention!", JSON.stringify(error), "danger")
        }
    }

    async function getRows(){
        try {
            const { data, count, error } = await supabase.rpc('get_medal_leaderboard', {
                in_name: filters.name || null,
                in_year: filters.year || null,
                in_event_id: filters.event || null,
                in_country_id: filters.nationality || null,
                in_order_col: filters.col_order,
                in_ascending: filters.ascending,
                in_no_bronzes: filters.more_filters.no_bronzes,
                in_no_silvers: filters.more_filters.no_silvers,
                in_no_golds: filters.more_filters.no_golds
            }, {count: "exact"})
            .range((pages.page - 1) * 50, pages.page * 50 - 1);
            if (error) throw error.message
            setRows(data);
            if (count) setPages(prev => ({...prev, total: Math.ceil(count / 50)}));
        } catch (error) {
            showToast("Attention!", JSON.stringify(error), "danger")
        }
    }

    async function getRowsFromMedals(){
        let query = supabase.from("medals").select("*", { count: "exact" });
        if (filters.name) query = query.ilike('name', `%${filters.name}%`);
        if (filters.nationality) query = query.ilike('country_id', `%${filters.nationality}%`);
        if (filters.year) query = query.eq('year', filters.year);
        if (filters.event) query = query.eq('event_id', filters.event);
        try {
            const { data, count, error } = await query
            .range((pages.page - 1) * 50, pages.page * 50 - 1);
            if (error) throw error.message
            let filteredData = [] as RowsType[];
            data.forEach((row: MedalType) => {
                if (filteredData.length && filteredData.some(d => d.wca_id === row.person_id)){
                    const index = filteredData.findIndex(d => d.wca_id === row.person_id);
                    filteredData[index].total_medals += 1;
                    if (row.medal_type === "gold") filteredData[index].golds += 1;
                    if (row.medal_type === "silver") filteredData[index].silvers += 1;
                    if (row.medal_type === "bronze") filteredData[index].bronzes += 1;
                } else {
                    filteredData.push({
                        name: row.name,
                        wca_id: row.person_id,
                        country_id: row.country_id,
                        golds: row.medal_type === "gold" ? 1 : 0,
                        silvers: row.medal_type === "silver" ? 1 : 0,
                        bronzes: row.medal_type === "bronze" ? 1 : 0,
                        total_medals: 1
                    })
                }
            })
            if (filters.more_filters.no_bronzes) filteredData = filteredData.filter(d => d.bronzes === 0);
            if (filters.more_filters.no_silvers) filteredData = filteredData.filter(d => d.silvers === 0);
            if (filters.more_filters.no_golds) filteredData = filteredData.filter(d => d.golds === 0);
            filteredData = sortRows(filteredData, filters.col_order as keyof RowsType, filters.ascending);
            setRows(filteredData);
            if (count) setPages(prev => ({...prev, total: Math.ceil(count / 50)}));
        } catch (error) {
            showToast("Attention!", JSON.stringify(error), "danger")
        }
    }

    async function getNations(){
        try {
            const { data, error } = await supabase
            .from("countries")
            .select("*")
            .order("name", { ascending: true });
            if (error) throw error.message
            setNations(data);
        } catch (error) {
            showToast("Attention!", JSON.stringify(error), "danger")
        }
    }

    async function getEvents(){
        try {
            const { data, error } = await supabase
            .from("events")
            .select("id, name")
            if (error) throw error.message
            const sorted = data.sort((a, b) => { const ai = order.indexOf(a.id); const bi = order.indexOf(b.id); return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi); });
            setEvents(sorted);
        } catch (error) {
            showToast("Attention!", JSON.stringify(error), "danger")
        }
    }

    async function getYears(){
        try {
            const { data, error } = await supabase
            .rpc("get_years");
            if (error) throw error.message
            setYears(data);
        } catch (error) {
            showToast("Attention!", JSON.stringify(error), "danger")
        }
    }

    function changePage(page: number){
        setPages(prev => ({...prev, page: page}));
    }

    useEffect(() => {
        showLoader(getNations)
        showLoader(getEvents)
        showLoader(getYears)
    }, []);

    useEffect(() => {
        showLoader(getRows)
    }, [filters, pages.page]);

    return {
        rows,
        filters,
        nations,
        events,
        years,
        pages,
        changePage,
        handleFiltersChange,
        handleMoreFiltersChange
    }
}