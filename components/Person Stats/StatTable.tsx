import { getKeyValue, Table,TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/table";
import Flag from "react-world-flags";
import { CircleFlag } from "react-circle-flags";

import useConfig from "@/Context/Config/useConfig"
import { regions_icon } from "@/Utils/regions_icon";
import { secondDiffToHuman } from "@/Utils/functions";
import { useMemo, useState } from "react";
import { Pagination } from "@heroui/pagination";

export default function StatTable({
    mode,
    data,
    paginated,
    page_number,
    pageSize,
    total,
    handlePagination
} : {
    mode: string,
    data: {rows: any[], cols: any[]},
    paginated?: boolean
    page_number?: number
    pageSize?: number
    total?: number,
    handlePagination?: (page: number, pageSize: number) => void
}){
    const {nations, events} = useConfig();

    const [page, setPage] = useState(1);
    const rowsPerPage = pageSize || 50;
    const pages = Math.ceil((total || data.rows.length) / rowsPerPage);

    let items
    if(paginated && !total){
        items = useMemo(() => {
            const start = (page - 1) * rowsPerPage;
            const end = start + rowsPerPage;

            return data.rows.slice(start, end);
        }, [page, data.rows]);
    }
    
    return (
        <Table
        aria-label="stats-table"
        isCompact
        isStriped
        key={page_number || mode}
        className="mt-2"
        classNames={{
          wrapper: "max-h-[50vh] lg:max-h-[60vh] w-full max-w-[90vw] lg:w-[40vw] lg:max-w-[65vw] overflow-auto",
          td: "whitespace-nowrap overflow-hidden text-ellipsis",
        }}
        isHeaderSticky
        bottomContent={
          pages > 0 && paginated ? (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="warning"
                page={page_number || page}
                total={pages}
                onChange={(page) => {
                    if (handlePagination) return handlePagination(page, rowsPerPage)
                    return setPage(page)
                }}
              />
            </div>
          ) : null
        }
        bottomContentPlacement="outside"
        >
            <TableHeader columns={data?.cols||[]}>
                {(column) => <TableColumn key={column.key} allowsSorting={column.sortable}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody
            items={paginated && !total ? items : data.rows ||[]}
            emptyContent="No data available"
            >
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