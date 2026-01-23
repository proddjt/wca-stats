import { getKeyValue, Table,TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/table";

import useConfig from "@/Context/Config/useConfig"
import { useDisclosure } from "@heroui/modal";
import ResultModal from "../Layout/ResultModal";
import { useRef } from "react";
import Filters from "./Filters";
import { DiaryFilterType } from "@/types";

export default function ResTable({
    data,
    deleteAction,
    filters,
    setFilters,
    getResults
} : {
    data: {rows: any[], cols: any[]},
    deleteAction: (result: any) => void,
    filters: DiaryFilterType,
    setFilters: React.Dispatch<React.SetStateAction<DiaryFilterType>>
    getResults: () => Promise<void>
}){
    const modalResult = useRef()
    const {events} = useConfig();

    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    
    return (
        <>
        <Table
        aria-label="stats-table"
        isCompact
        isStriped
        className="mt-2"
        classNames={{
          wrapper: "h-[60vh] lg:h-[50vh] max-h-[50vh] lg:max-h-[60vh] w-full max-w-[90vw] lg:w-[40vw] lg:max-w-[65vw] overflow-auto",
          td: "whitespace-nowrap overflow-hidden text-ellipsis",
        }}
        topContent={
            <Filters
            filters={filters}
            setFilters={setFilters}
            getResults={getResults}
            />
        }
        topContentPlacement="outside"
        isHeaderSticky
        >
            <TableHeader columns={data?.cols||[]}>
                {(column) => <TableColumn key={column.key} allowsSorting={column.sortable}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody
            items={data.rows ||[]}
            emptyContent="Add a result to your diary"
            >
                {(item) => (
                <TableRow
                key={item.key}
                onClick={() => {
                    modalResult.current = item;
                    onOpen();
                }}
                >
                    {(columnKey) => <TableCell>
                        <span className="flex flex-row gap-1">
                            {

                                columnKey === "event_id" ?
                                <>
                                <span className={`cubing-icon event-${getKeyValue(item, columnKey)}`}></span>
                                {events.current.find((event) => event.id === getKeyValue(item, columnKey))?.name}
                                </>
                                :
                                getKeyValue(item, columnKey)
                            }
                        </span>
                    </TableCell>}
                </TableRow>
                )}
            </TableBody>
        </Table>

        <ResultModal isOpen={isOpen} onOpenChange={onOpenChange} result={modalResult.current} deleteAction={deleteAction}/>
        </>
    )
}