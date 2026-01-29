import { useEffect, useRef, useState } from "react";

import { FiltersType, PagesType, RowsType } from "@/types";
import { createClient } from "@/lib/supabase/client";
import useIsLoading from "@/Context/IsLoading/useIsLoading";
import { showToast } from "@/lib/Toast";



export default function useTable(screenWidth: number, sectionSelected: string){
    const supabase = createClient();
    const [rows, setRows] = useState<RowsType[]>([]);
    const [filters, setFilters] = useState<FiltersType>({
        nationality: '',
        year: [],
        event: [],
        name: '',
        col_order: 'golds',
        ascending: true,
        country: "all",
        more_filters: {
            no_golds: false,
            no_silvers: false,
            no_bronzes: false
        },
        region: 'all'
    });
    
    const [pages, setPages] = useState<PagesType>({page: 1, total: 0});
    const last_update = useRef<string>("")
    const try_count = useRef<number>(0)

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
        try_count.current++
        try{
            const { data, error } = await supabase.functions.invoke('get_medal_leaderboard', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    page,
                    in_name: newFilters.name || null,
                    in_year: newFilters.year,
                    in_event_id: newFilters.event || null,
                    in_country_id: newFilters.nationality || null,
                    in_order_col: newFilters.col_order,
                    in_ascending: newFilters.ascending,
                    in_no_bronzes: newFilters.more_filters.no_bronzes,
                    in_no_silvers: newFilters.more_filters.no_silvers,
                    in_no_golds: newFilters.more_filters.no_golds,
                    in_location_filter: newFilters.country,
                    in_mode: sectionSelected,
                    in_region: newFilters.region === "all" || newFilters.region === "" ? null : newFilters.region
                })
            })
            if (error) throw error.message
            setRows(data.data);
            try_count.current = 0
            if (data.count) setPages(prev => ({...prev, total: Math.ceil(data.count / 50)}));
        } catch (error) {
            if (try_count.current < 3) getRows(1)
            else showToast("Attention!", JSON.stringify(error), "danger")
        }
    }

    // async function getRows(page = pages.page, newFilters = filters){
    //     try {
    //         const { data, count, error } = await supabase.rpc('get_medal_leaderboard', {
    //             in_name: newFilters.name || null,
    //             in_year: newFilters.year,
    //             in_event_id: newFilters.event || null,
    //             in_country_id: newFilters.nationality || null,
    //             in_order_col: newFilters.col_order,
    //             in_ascending: !newFilters.ascending,
    //             in_no_bronzes: newFilters.more_filters.no_bronzes,
    //             in_no_silvers: newFilters.more_filters.no_silvers,
    //             in_no_golds: newFilters.more_filters.no_golds,
    //             in_location_filter: newFilters.country,
    //             in_mode: sectionSelected,
    //             in_region: newFilters.region === "all" || newFilters.region === "" ? null : newFilters.region
    //         }, {count: "exact"})
    //         .range((page - 1) * 50, page * 50 - 1);
    //         if (error) throw error.message
    //         setRows(data);
    //         if (count) setPages(prev => ({...prev, total: Math.ceil(count / 50)}));
    //     } catch (error) {
    //         showToast("Attention!", JSON.stringify(error), "danger")
    //     }
    // }

    async function getLastUpdate(){
        try {
            const { data, error } = await supabase
            .from("results")
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
            ascending: true,
            country: 'all',
            more_filters: {
                no_golds: false,
                no_silvers: false,
                no_bronzes: false
            },
            region: 'all'
        }
        setFilters(resettedFilters)
        showLoader(() => getRows(1, resettedFilters))
    }

    useEffect(() => {
        showLoader(getLastUpdate)
    }, []);

    useEffect(() => {
        if (screenWidth < 1024) return
        showLoader(() => getRows(1))
    }, [filters.country, filters.event, filters.name, filters.nationality, filters.year, filters.more_filters, filters.region]);

    useEffect(() => {
        showLoader(() => getRows(1))
    }, [filters.col_order, filters.ascending, sectionSelected]);

    return {
        rows,
        filters,
        pages,
        last_update,
        changePage,
        handleFiltersChange,
        handleMoreFiltersChange,
        getRows,
        resetFilters
    }
}