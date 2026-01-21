import useConfig from "@/Context/Config/useConfig";
import { formatTime } from "@/Utils/functions";
import { Button } from "@heroui/button";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";

export default function ResultModal({
    isOpen,
    result,
    onOpenChange,
    deleteAction
} : {
    isOpen: boolean,
    result: any,
    onOpenChange: () => void,
    deleteAction: (result: any) => void
}){
    const {events} = useConfig();
    
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
            {(onClose) => (
                <>
                <ModalHeader className="flex flex-col gap-1">Result details</ModalHeader>
                <ModalBody>
                    <p className="flex items-center gap-1">Event:<span className={`cubing-icon event-${result?.event_id}`}></span> {events.current.find(ev => ev.id === result?.event_id)?.name}</p>
                    <p className="flex items-center gap-1">Result type:<span className={`cubing-icon result-${result?.result_type}`}></span> {result?.result_type}</p>
                    <p className="flex items-center gap-1">Result:<span className={`cubing-icon result-${result?.result_type}`}></span> {result?.result}</p>
                    {result?.result_type !== "Single" &&
                    <p className="flex items-center gap-1">Times: {result?.results.map((time: string) => formatTime(time)).join(", ")}</p>
                    }
                    <ol>
                        Scrambles:
                        {result?.scrambles.map((scramble: string, index: number) => <li key={index}>{index+1}: {scramble}</li>)}
                    </ol>
                    <p className="flex items-center gap-1">Date: {result?.date}</p>
                    <p className="flex items-center gap-1">Notes: {result?.notes || "No notes"}</p>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                    Close
                    </Button>
                    <Popover showArrow offset={5} placement="top">
                        <PopoverTrigger>
                            <Button color="primary">
                                Delete result
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent >
                            <div className="flex flex-col">
                                <p>Confirm to delete this result</p>
                                <Button color="danger" variant="light" onPress={() => {deleteAction(result); onClose()}}>Confirm</Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </ModalFooter>
                </>
            )}
            </ModalContent>
        </Modal>
    )
}