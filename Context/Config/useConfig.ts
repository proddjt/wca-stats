import { useContext } from "react"
import { ConfigContext } from "./ConfigContext"

export default function useConfig(){
    const context = useContext(ConfigContext)
    if (context === undefined) {
      throw new Error("useConfig must be used within a ConfigProvider")
    }
    return context
}