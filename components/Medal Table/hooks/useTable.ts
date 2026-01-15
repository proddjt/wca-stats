import { useEffect, useRef, useState } from "react";

import { EventType, FiltersType, MedalType, NationType, PagesType, RowsType } from "@/types";
import { createClient } from "@/lib/supabase/client";
import useIsLoading from "@/Context/IsLoading/useIsLoading";
import { showToast } from "@/lib/Toast";
import { order } from "@/Utils/event-order";


export default function useTable(screenWidth: number){
    const supabase = createClient();
    const [rows, setRows] = useState<RowsType[]>([]);
    const [filters, setFilters] = useState<FiltersType>({
        nationality: '',
        year: [],
        event: [],
        name: '',
        col_order: 'golds',
        ascending: false,
        country: "all",
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
    const last_update = useRef<string>("")

    const {showLoader} = useIsLoading();

    function handleFiltersChange(value: string | string[] | [], key: string, ascending?: boolean){
        setPages(prev => ({...prev, page: 1}))
        if (!value) setFilters(prev => ({...prev, [key]: ""}))
        else setFilters(prev => ({...prev, [key]: value}))
        if (ascending !== undefined) setFilters(prev => ({...prev, ascending: ascending}))
    }

    function handleMoreFiltersChange(value: string[]){
        setPages(prev => ({...prev, page: 1}))
        const newMoreFilters = {no_golds: false, no_silvers: false, no_bronzes: false};
        if (value.length){ 
            value.forEach(filter => newMoreFilters[filter as keyof typeof newMoreFilters] = true)
        }
        setFilters(prev => ({...prev, more_filters: newMoreFilters}))
    }

    async function getRows(page = pages.page, newFilters = filters){
        try {
            const { data, count, error } = await supabase.rpc('get_medal_leaderboard', {
                in_name: newFilters.name || null,
                in_year: newFilters.year,
                in_event_id: newFilters.event || null,
                in_country_id: newFilters.nationality || null,
                in_order_col: newFilters.col_order,
                in_ascending: newFilters.ascending,
                in_no_bronzes: newFilters.more_filters.no_bronzes,
                in_no_silvers: newFilters.more_filters.no_silvers,
                in_no_golds: newFilters.more_filters.no_golds,
                in_location_filter: newFilters.country
            }, {count: "exact"})
            .range((page - 1) * 50, page * 50 - 1);
            if (error) throw error.message
            setRows(data);
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

    async function getLastUpdate(){
        try {
            const { data, error } = await supabase
            .from("medals")
            .select("last_update")
            .order("last_update", { ascending: false })
            .limit(1)
            if (error) throw error.message
            last_update.current = data[0].last_update
        } catch (error) {
            showToast("Attention!", JSON.stringify(error), "danger")
        }
    }

    function changePage(page: number){
        setPages(prev => ({...prev, page: page}));
        showLoader(() => getRows(page))
    }

    function resetFilters(){
        setPages({page: 1, total: 0})
        const resettedFilters = {
            nationality: '',
            year: [],
            event: [],
            name: '',
            col_order: 'golds',
            ascending: false,
            country: 'all',
            more_filters: {
                no_golds: false,
                no_silvers: false,
                no_bronzes: false
            }
        }
        setFilters(resettedFilters)
        showLoader(() => getRows(1, resettedFilters))
    }

    useEffect(() => {
        showLoader(getNations)
        showLoader(getEvents)
        showLoader(getYears)
        showLoader(getLastUpdate)
        if (screenWidth < 1024) showLoader(() => getRows(1))
    }, []);

    useEffect(() => {
        if (screenWidth < 1024) return
        showLoader(() => getRows(1))
    }, [filters.country, filters.event, filters.name, filters.nationality, filters.year, filters.more_filters]);

    useEffect(() => {
        showLoader(() => getRows(1))
    }, [filters.col_order, filters.ascending]);

    return {
        rows,
        filters,
        nations,
        events,
        years,
        pages,
        last_update,
        changePage,
        handleFiltersChange,
        handleMoreFiltersChange,
        getRows,
        resetFilters
    }
}