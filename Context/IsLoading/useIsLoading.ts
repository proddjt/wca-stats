import { useContext } from "react"
import { IsLoadingContext } from "./IsLoadingContext"

export default function useIsLoading(){
    const context = useContext(IsLoadingContext)
    if (context === undefined) {
      throw new Error("useIsLoading must be used within a IsLoadingProvider")
    }
    return context
}