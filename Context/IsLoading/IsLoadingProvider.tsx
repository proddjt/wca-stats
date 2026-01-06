import { useTransition } from "react";
import { IsLoadingContext } from "./IsLoadingContext";

export default function IsLoadingProvider({ children } : { children: React.ReactNode }) {
    const [isPending, startTransition] = useTransition()

    const showLoader = async (f: () => Promise<void>) => {
        startTransition(() => f())
    }

    return (
        <IsLoadingContext.Provider value={{isPending, showLoader}}>
            {children}
        </IsLoadingContext.Provider>
    )
}