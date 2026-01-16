import { useEffect, useRef } from "react";
import { ConfigContext } from "./ConfigContext";
import { EventType, NationType } from "@/types";
import { showToast } from "@/lib/Toast";
import { createClient } from "@/lib/supabase/client";
import { order } from "@/Utils/event-order";
import useIsLoading from "../IsLoading/useIsLoading";

export default function ConfigProvider({ children } : { children: React.ReactNode }) {
    const nations = useRef<NationType[]>([]);
    const events = useRef<EventType[]>([]);

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

    useEffect(() => {
        showLoader(getNations);
        showLoader(getEvents);
    }, []);

    return (
        <ConfigContext.Provider value={{nations, events}}>
            {children}
        </ConfigContext.Provider>
    )
}