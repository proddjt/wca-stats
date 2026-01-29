import useIsLoading from "@/Context/IsLoading/useIsLoading";
import { regions_icon } from "@/Utils/regions_icon";
import { Button } from "@heroui/button";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { Select, SelectItem } from "@heroui/select";
import { useRef } from "react";

export default function EditRegionModal({
    isOpen,
    person,
    onOpenChange,
    action
} : {
    isOpen: boolean,
    person: any,
    onOpenChange: () => void,
    action: (region: string, wca_id: string) => Promise<void>
}){
    const region = useRef<string>("");

    const {showLoader} = useIsLoading();
    
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
            {(onClose) => (
                <>
                <ModalHeader className="flex flex-col gap-1">Update region for {person.name}</ModalHeader>
                <ModalBody>
                    <Select
                    className="lg:w-1/5 w-full"
                    label="Select a region"
                    placeholder="Region"
                    variant="faded"
                    size="sm"
                    radius="sm"
                    onChange={(e) => region.current = e.target.value}
                    >
                        {regions_icon.map((region) =><SelectItem key={region.name} textValue={region.name}>{region.name}</SelectItem>)}
                    </Select>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                    Close
                    </Button>
                    <Popover showArrow offset={5} placement="top">
                        <PopoverTrigger>
                            <Button color="primary">
                                Update region
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent >
                            <div className="flex flex-col">
                                <p>Confirm to update region for {person.name}</p>
                                <Button color="danger" variant="light" onPress={() =>  {region.current && showLoader(() => action(region.current, person.wca_id)); onClose(); region.current = ""}}>Confirm</Button>
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