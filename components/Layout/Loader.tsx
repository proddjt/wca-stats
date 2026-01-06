import { Spinner } from "@heroui/spinner"

export default function Loader({noFullscreen = false} : {noFullscreen?: boolean}){
    return (
        <div className={noFullscreen ? "" : "flex flex-col justify-center items-center grow"}>
            <Spinner
            size="lg"
            color="warning"
            label="Loading..."
            variant="spinner"
            />
        </div>
    )
}