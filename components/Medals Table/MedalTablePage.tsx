'use client'

import { useEffect, useRef } from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@heroui/table";
import {useDisclosure} from "@heroui/use-disclosure";
import {Pagination} from "@heroui/pagination";
import Flag from 'react-world-flags'

import useTable from "./hooks/useTable";
import useIsLoading from "@/Context/IsLoading/useIsLoading";
import useConfig from "@/Context/Config/useConfig"

import Filterbar from "./Filterbar";
import Loader from "../Layout/Loader";
import { Button, PressEvent } from "@heroui/button";
import FilterDrawer from "./FilterDrawer";
import dayjs from "dayjs";
import { Link } from "@heroui/link";
import { useRouter } from "next/navigation";

export const columns = [
  {
    key: "rank_position",
    label: "Position",
    sortable: false
  },
  {
    key: "name",
    label: "Name",
    sortable: false
  },
  {
    key: "wca_id",
    label: "WCA ID",
    sortable: false
  },
  {
    key: "country_id",
    label: "Nationality",
    sortable: false
  },
  {
    key: "golds",
    label: "Golds",
    sortable: true
  },
  {
    key: "silvers",
    label: "Silvers",
    sortable: true
  },
  {
    key: "bronzes",
    label: "Bronzes",
    sortable: true
  },
  {
    key: "total_medals",
    label: "Total medals",
    sortable: true
  }
];


export default function MedalTablePage() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const {isPending} = useIsLoading();
  const screenWidth = useRef(0);

  const router = useRouter();

  useEffect(() => {
    screenWidth.current = window.screen.availWidth;
  }, []);

  const {
      rows,
      filters,
      pages,
      last_update,
      changePage,
      handleFiltersChange,
      handleMoreFiltersChange,
      getRows,
      resetFilters
  } = useTable(screenWidth.current)

  const {
    nations,
    events,
    years
  } = useConfig();

  const handleClick = (id: string) => {
    router.push(`/person-stats/${id}`)
  }

  if (isPending && (!nations.current.length || !events.current.length || !years.current.length)) return <Loader />

  return (
      <>
      <div className="grow flex flex-col justify-center lg:items-center py-2">
        <Table
        aria-label="medals-table"
        isStriped
        isCompact
        fullWidth={false}
        rowHeight={5}
        color="warning"
        classNames={{
          wrapper: "h-[65vh] max-h-[65vh] lg:max-h-[55vh] min-w-[70vw] lg:h-[55vh] overflow-auto",
          td: "whitespace-nowrap min-h-[40px]"
        }}
        topContent={
          screenWidth.current < 1024 ? 
          <Button onPress={onOpen} color="warning">Filters</Button> :
          <Filterbar {...{handleFiltersChange, handleMoreFiltersChange, filters}} />
        }
        topContentPlacement="outside"
        bottomContent={
          pages.total > 0 ? (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="warning"
                page={pages.page}
                total={pages.total}
                onChange={(page) => changePage(page)}
              />
            </div>
          ) : null
        }
        bottomContentPlacement="outside"
        isHeaderSticky
        sortDescriptor={{column: filters.col_order, direction: filters.ascending ? "ascending" : "descending"}}
        onSortChange={(d) => {
          if (isPending) return
          console.log(d)
          handleFiltersChange(d.column.toString(), "col_order", d.direction === "ascending")
        }}
        >
            <TableHeader columns={columns}>
                {(column) => 
                <TableColumn key={column.key} allowsSorting={column.sortable}>
                  <span>{column.label}</span>
                </TableColumn>}
            </TableHeader>
            <TableBody
            items={rows||[]}
            emptyContent="No results found"
            isLoading={isPending && !rows.length}
            loadingContent="Loading..."
            className="bg-red-400"
            >
                {(item) => (
                <TableRow key={item.wca_id}>
                    {columnKey => columnKey === "country_id" ?
                    <TableCell className="flex flex-row gap-1 items-center">
                      <Flag code={item.country_id} width={15}/> {nations.current.find(n => n.id === item.country_id)?.name}
                    </TableCell> :
                    columnKey === "name" || columnKey === "wca_id" ?
                    <TableCell>
                      <Link
                      isBlock
                      onPress={() => handleClick(item.wca_id)}
                      color="warning"
                      size="sm"
                      >
                        {getKeyValue(item, columnKey)}
                      </Link>
                    </TableCell>
                    :
                    <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                    }
                </TableRow>
                )}
            </TableBody>
        </Table>
        {last_update && last_update.current &&
        <p className="text-xs text-gray-400 text-center pt-1 italic">Last updated at: {dayjs(last_update.current).format("DD-MM-YYYY HH:mm")} UTC+1</p>}
      </div>

      <FilterDrawer {...{resetFilters, isOpen, onOpenChange, getRows,handleFiltersChange, handleMoreFiltersChange, filters}}/>
      </>
  )
}