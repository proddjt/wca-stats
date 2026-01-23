import { I18nProvider } from "@react-aria/i18n";
import { DatePicker } from "@heroui/date-picker";

import { getLocalTimeZone, parseDate, today } from "@internationalized/date";

import { DiaryFilterType } from "@/types";
import { CalendarDate } from "@heroui/system/dist/types";
import { Select, SelectItem } from "@heroui/select";
import useIsLoading from "@/Context/IsLoading/useIsLoading";
import useConfig from "@/Context/Config/useConfig";
import { Button } from "@heroui/button";

const oldEvents = ["333ft", "magic", "mmagic", "333mbo"]

export default function Filters({
    filters,
    setFilters,
    getResults
} : {
    filters: DiaryFilterType
    setFilters: React.Dispatch<React.SetStateAction<DiaryFilterType>>,
    getResults: () => Promise<void>
}){

    const {showLoader, isPending} = useIsLoading();

    const {events} = useConfig();

    return (
        <div className="flex flex-col gap-1">
          <p className="text-xs">Filter by:</p>
          <div className="flex justify-between gap-1">
            <I18nProvider locale="it-IT">
                <DatePicker
                label="Date"
                size="sm"
                variant="faded"
                radius="sm"
                value={parseDate(filters.date)}
                granularity="day"
                hideTimeZone
                fullWidth={false}
                isDisabled={isPending}
                className="w-1/2"
                maxValue={today(getLocalTimeZone())}
                onChange={(value: CalendarDate | null) => setFilters(prev => ({...prev, date: `${value?.year.toString().padStart(4, "0")}-${value?.month.toString().padStart(2, "0")}-${value?.day.toString().padStart(2, "0")}`}))}
                />
            </I18nProvider>

            <Select
            className="w-1/2"
            label="Event (multiple)"
            placeholder="All events"
            variant="faded"
            size="sm"
            isDisabled={isPending}
            radius="sm"
            isClearable
            onClear={() => setFilters(prev => ({...prev, event: "all"}))}
            selectedKeys={filters.event !== "all" ? filters.event : []}
            selectionMode="multiple"
            onChange={(e) => setFilters(prev => ({...prev, event: e.target.value.split(",")}))}
            >
            {
            events.current.filter(e => !oldEvents.includes(e.id)).map((event) =>
                <SelectItem key={event.id} textValue={event.name}><span className={`cubing-icon event-${event.id}`}></span> {event.name}</SelectItem>
            ) }
            </Select>
          </div>
          <div className="flex justify-between gap-1">
            <Select
            className="w-1/2"
            label="Result type"
            placeholder="All results"
            variant="faded"
            size="sm"
            isDisabled={isPending}
            radius="sm"
            isClearable
            onClear={() => setFilters(prev => ({...prev, result_type: "all"}))}
            selectedKeys={filters.result_type !== "all" ? filters.result_type : []}
            onChange={(e) => setFilters(prev => ({...prev, result_type: e.target.value}))}
            >
            <>
                <SelectItem key="single" textValue="Singles only">Singles only</SelectItem>
                <SelectItem key="ao5" textValue="Ao5 only">Ao5 only</SelectItem>
                <SelectItem key="mo3" textValue="Mo3 only">Mo3 only</SelectItem>
            </>
            </Select>
          </div>
          <Button
          onPress={() => showLoader(getResults)}
          isDisabled={isPending}
          size="sm"
          color="warning"
          variant="bordered"
          >
            Apply filters
          </Button>
        </div>
    )
}