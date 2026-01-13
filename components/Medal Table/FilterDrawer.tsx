import { Button } from "@heroui/button";
import {Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter} from "@heroui/drawer";
import Filterbar from "./Filterbar";
import { EventType, FiltersType, NationType } from "@/types";

export default function FilterDrawer({
    isOpen,
    onOpenChange,
    handleFiltersChange,
    handleMoreFiltersChange,
    filters,
    nations,
    events,
    years,
    getRows,
    resetFilters
} : {
    isOpen: boolean,
    onOpenChange: () => void,
    handleFiltersChange: (value: string | string[] | [], key: string, ascending?: boolean) => void,
    handleMoreFiltersChange: (value: string[]) => void,
    filters: FiltersType,
    nations: NationType[],
    events: EventType[],
    years: {year: string}[],
    getRows: (n?: number) => Promise<void>,
    resetFilters: () => void
}){
    return (
        <Drawer isOpen={isOpen} placement="bottom" onOpenChange={onOpenChange}>
            <DrawerContent>
            {(onClose) => (
                <>
                <DrawerHeader className="flex flex-col gap-1">Filters</DrawerHeader>
                <DrawerBody>
                    <Filterbar {...{handleFiltersChange, handleMoreFiltersChange, filters, nations, events, years}} isDrawer={true}/>
                </DrawerBody>
                <DrawerFooter className="flex justify-between">
                    <Button color="danger" onPress={() => {resetFilters(); onClose()}}>
                    Reset filters
                    </Button>
                    <Button color="danger" variant="bordered" onPress={onClose}>
                    Close
                    </Button>
                    <Button color="warning" onPress={() => {getRows(1); onClose()}}>
                    Apply filters
                    </Button>
                </DrawerFooter>
                </>
            )}
            </DrawerContent>
        </Drawer>
    )
}