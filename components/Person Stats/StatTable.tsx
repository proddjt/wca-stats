import { getKeyValue, Table,TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/table";
import Flag from "react-world-flags";
import { CircleFlag } from "react-circle-flags";

import useConfig from "@/Context/Config/useConfig"
import { regions_icon } from "@/Utils/regions_icon";
import { secondDiffToHuman } from "@/Utils/functions";

export default function StatTable({
    mode,
    data
} : {
    mode: string,
    data: {rows: any[], cols: any[]},
}){
    const {nations, events} = useConfig();
    
    return (
        <Table
        aria-label="stats-table"
        isCompact
        isStriped
        key={mode}
        className="mt-2"
        classNames={{
          wrapper: "max-h-[50vh] lg:max-h-[60vh] w-[90vw] max-w-[90vw] overflow-auto",
          td: "whitespace-nowrap overflow-hidden text-ellipsis",
        }}
        isHeaderSticky
        >
            <TableHeader columns={data?.cols||[]}>
                {(column) => <TableColumn key={column.key} allowsSorting={column.sortable}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody items={data?.rows||[]} emptyContent="No data available">
                {(item) => (
                <TableRow key={item.key||item.city||item.country}>
                    {(columnKey) => <TableCell>
                        <span className="flex flex-row gap-1">
                        {columnKey === "country" ?
                            <>
                            <Flag code={item[columnKey]} width={15}/>
                            {nations.current.find((nation) => nation.id === item[columnKey])?.name}
                            </>
                        :
                            columnKey === "region" ?
                                <>
                                <CircleFlag countryCode={regions_icon.find((region) => region.name === item[columnKey])?.icon||"IT"} width="20" />
                                {getKeyValue(item, columnKey)}
                                </>
                            :
                                columnKey === "event_id" ?
                                    <>
                                    <span className={`cubing-icon event-${getKeyValue(item, columnKey)}`}></span>
                                    {events.current.find((event) => event.id === getKeyValue(item, columnKey))?.name}
                                    </>
                                :
                                    columnKey === "time" ?
                                        secondDiffToHuman(getKeyValue(item, columnKey))
                                    :
                                        getKeyValue(item, columnKey)
                        }
                        </span>
                    </TableCell>}
                </TableRow>
                )}
            </TableBody>
        </Table>
    )
}