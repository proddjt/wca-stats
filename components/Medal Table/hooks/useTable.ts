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