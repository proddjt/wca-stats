'use client'

import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@heroui/table";
import {Pagination} from "@heroui/pagination";
import Flag from 'react-world-flags'

import useTable from "./hooks/useTable";
import useIsLoading from "@/Context/IsLoading/useIsLoading";

import Filterbar from "./Filterbar";
import Loader from "../Layout/Loader";

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
  const {isPending} = useIsLoading();

  const {
      rows,
      filters,
      nations,
      events,
      years,
      pages,
      changePage,
      handleFiltersChange,
      handleMoreFiltersChange
  } = useTable()

  if (isPending && (!nations.length || !events.length || !years.length)) return <Loader />

  return (
      <div className="grow flex flex-col justify-center items-center">
          <Table
          aria-label="medals-table"
          fullWidth={false}
          isStriped
          classNames={{
            wrapper: "h-[75vh] max-h-[75vh] w-[90vw] max-w-[90vw] overflow-auto", // <--- SCROLL QUI
            table: "min-h-full"
          }}
          topContent={<Filterbar
            handleFiltersChange={handleFiltersChange}
            handleMoreFiltersChange={handleMoreFiltersChange}
            filters={filters}
            nations={nations}
            events={events}
            years={years}
            />}
          topContentPlacement="outside"
          bottomContent={
            pages.total > 0 ? (
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
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
                      {(columnKey) => columnKey === "country_id" ? (<TableCell className="flex flex-row gap-1"><Flag code={item.country_id} width={15}/> {nations.find(n => n.id === item.country_id)?.name}</TableCell>) : (<TableCell>{getKeyValue(item, columnKey)}</TableCell>)}
                  </TableRow>
                  )}
              </TableBody>
          </Table>
      </div>
  )
}