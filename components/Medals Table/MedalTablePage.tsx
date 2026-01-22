'use client'

import { useEffect, useMemo, useRef, useState } from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@heroui/table";
import { Button } from "@heroui/button";
import {useDisclosure} from "@heroui/use-disclosure";
import {Pagination} from "@heroui/pagination";
import Flag from 'react-world-flags'
import { useRouter } from "next/navigation";
import { Link } from "@heroui/link";
import dayjs from "dayjs";

import { GiItalia } from "react-icons/gi";
import { BiWorld } from "react-icons/bi";

import useTable from "./hooks/useTable";
import useIsLoading from "@/Context/IsLoading/useIsLoading";
import useConfig from "@/Context/Config/useConfig"

import Filterbar from "./Filterbar";
import Loader from "../Layout/Loader";
import FilterDrawer from "./FilterDrawer";
import TabNavigation from "../Layout/TabNavigation";
import { CircleFlag } from "react-circle-flags";
import { regions_icon } from "@/Utils/regions_icon";

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

const sections = [
  {
    key: "worldwide",
    title: "Worldwide",
    icon: BiWorld
  },
  {
    key: "region",
    title: "Regional (Italian Only)",
    icon: GiItalia
  }
]


export default function MedalTablePage() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [sectionSelected, setSectionSelected] = useState<string>("worldwide");

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
  } = useTable(screenWidth.current, sectionSelected)

  const {
    nations,
    events,
    years
  } = useConfig();

  const handleClick = (id: string) => {
    router.push(`/person-stats/${id}`)
  }

  const tableColumns = useMemo(() => {
    return sectionSelected === "worldwide"
      ? columns
      : [...columns, { key: "region", label: "Region", sortable: true }];
  }, [sectionSelected]);

  if (isPending && (!nations.current.length || !events.current.length || !years.current.length)) return <Loader />

  return (
      <>
      <div className="grow flex flex-col justify-center lg:items-center py-2 gap-2">
        <div className="flex justify-center">
          <TabNavigation
          sections={sections}
          selectedKey={sectionSelected}
          onSelectionChange={setSectionSelected}
          isDisabled={isPending}
          />
        </div>

        <Table
        aria-label="medals-table"
        isStriped
        isCompact
        fullWidth={false}
        rowHeight={5}
        color="warning"
        classNames={{
          wrapper: "h-[65vh] max-h-[65vh] lg:max-h-[52vh] min-w-[70vw] lg:h-[55vh] overflow-auto",
          td: "whitespace-nowrap min-h-[45px]"
        }}
        topContent={
          screenWidth.current < 1024 ? 
          <Button onPress={onOpen} color="warning" isDisabled={isPending}>Filters</Button> :
          <Filterbar {...{handleFiltersChange, handleMoreFiltersChange, filters, sectionSelected}} />
        }
        topContentPlacement="outside"
        bottomContent={
          pages.total > 0 ? (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                isDisabled={isPending}
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
          handleFiltersChange(d.column.toString(), "col_order", d.direction === "ascending")
        }}
        >
            <TableHeader columns={tableColumns}>
                {
                (column) =>
                  <TableColumn key={column.key} allowsSorting={column.sortable}>
                    <span>{column.label}</span>
                  </TableColumn>
                }
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
                      onPress={() => !isPending && handleClick(item.wca_id)}
                      color="warning"
                      size="sm"
                      >
                        {getKeyValue(item, columnKey)}
                      </Link>
                    </TableCell>
                    :
                    columnKey === "region" && item.region ?
                    <TableCell className="flex flex-row gap-1 items-center">
                      <CircleFlag countryCode={regions_icon.find((region) => region.name === item.region.trim())?.icon||"it"} width="12" />
                        <span className="truncate">{item.region}</span>
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

      <FilterDrawer {...{resetFilters, isOpen, onOpenChange, getRows,handleFiltersChange, handleMoreFiltersChange, filters, sectionSelected}}/>
      </>
  )
}