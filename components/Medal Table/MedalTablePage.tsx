'use client'

import { useEffect, useRef } from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@heroui/table";
import {useDisclosure} from "@heroui/use-disclosure";
import {Pagination} from "@heroui/pagination";
import Flag from 'react-world-flags'

import useTable from "./hooks/useTable";
import useIsLoading from "@/Context/IsLoading/useIsLoading";

import Filterbar from "./Filterbar";
import Loader from "../Layout/Loader";
import { Button } from "@heroui/button";
import FilterDrawer from "./FilterDrawer";

export const columns = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "wca_id",
    label: "WCA ID",
  },
  {
    key: "country_id",
    label: "Nationality",
  },
  {
    key: "golds",
    label: "Golds",
  },
  {
    key: "silvers",
    label: "Silvers",
  },
  {
    key: "bronzes",
    label: "Bronzes",
  },
  {
    key: "total_medals",
    label: "Total medals",
  }
];


export default function MedalTablePage() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const {isPending} = useIsLoading();
  const screenWidth = useRef(0);

  useEffect(() => {
    screenWidth.current = window.screen.availWidth;
  }, []);


  const {
      rows,
      filters,
      nations,
      events,
      years,
      pages,
      changePage,
      handleFiltersChange,
      handleMoreFiltersChange,
      getRows,
      resetFilters
  } = useTable(screenWidth.current)

  if (isPending && (!nations.length || !events.length || !years.length)) return <Loader />

  return (
      <>
      <div className="grow flex flex-col justify-center lg:items-center py-2">
        <Table
        aria-label="medals-table"
        isStriped
        isCompact
        fullWidth={false}
        rowHeight={5}
        classNames={{
          wrapper: "h-[65vh] max-h-[65vh] overflow-auto",
          td: "whitespace-nowrap"
        }}
        topContent={
          screenWidth.current < 1024 ? 
          <Button onPress={onOpen} color="warning">Filters</Button> :
          <Filterbar {...{handleFiltersChange, handleMoreFiltersChange, filters, nations, events, years}} />
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
        >
            <TableHeader columns={columns}>
                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
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
                    <TableCell className="flex flex-row gap-1">
                      <Flag code={item.country_id} width={15}/> {nations.find(n => n.id === item.country_id)?.name}
                      </TableCell> :
                    <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                    }
                </TableRow>
                )}
            </TableBody>
        </Table>
      </div>

      <FilterDrawer {...{resetFilters, isOpen, onOpenChange, getRows,handleFiltersChange, handleMoreFiltersChange, filters, nations, events, years}}/>
      </>
  )
}