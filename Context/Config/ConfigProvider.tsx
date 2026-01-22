import { useEffect, useRef, useState } from "react";
import { ConfigContext } from "./ConfigContext";
import { EventType, NationType } from "@/types";
import { showToast } from "@/lib/Toast";
import { createClient } from "@/lib/supabase/client";
import { order } from "@/Utils/event-order";
import useIsLoading from "../IsLoading/useIsLoading";

export default function ConfigProvider({ children } : { children: React.ReactNode }) {
    const nations = useRef<NationType[]>([]);
    const events = useRef<EventType[]>([]);
    const years = useRef<{year: string}[]>([]);

    const supabase = createClient();
    const {showLoader} = useIsLoading();

    async function getNations(){
        try {
            const { data, error } = await supabase
            .from("countries")
            .select("*")
            .order("name", { ascending: true });
            if (error) throw error.message
            nations.current = data;
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
            events.current = sorted;
        } catch (error) {
            showToast("Attention!", JSON.stringify(error), "danger")
        }
    }

    async function getYears(){
        try {
            const { data, error } = await supabase
            .rpc("get_years");
            if (error) throw error.message
            years.current = data;
        } catch (error) {
            showToast("Attention!", JSON.stringify(error), "danger")
        }
    }

    async function dummyQuery(){
        await supabase
        .rpc("get_related_persons", {
            wca_id_input: "2009CONT01",
            page: 1,
            page_size: 1
        })
    }

    useEffect(() => {
        showLoader(getNations);
        showLoader(getEvents);
        showLoader(getYears);
        dummyQuery();
    }, []);

    return (
        <ConfigContext.Provider value={{nations, events, years}}>
            {children}
        </ConfigContext.Provider>
    )
}