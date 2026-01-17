import { CircularProgress } from "@heroui/progress"

export default function ProgessLoader({noFullscreen = false, value} : {noFullscreen?: boolean, value?: number}){
    return (
        <div className={noFullscreen ? "" : "flex flex-col justify-center items-center grow"}>
            <CircularProgress
            size="lg"
            color="warning"
            label="Loading..."
            showValueLabel
            value={value}
            />
        </div>
    )
}