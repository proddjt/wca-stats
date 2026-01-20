import { useEffect, useMemo, useState } from "react";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { DateInput } from "@heroui/date-input";
import { CalendarDate, now, parseZonedDateTime, ZonedDateTime } from "@internationalized/date";
import dayjs from "dayjs";

import useConfig from "@/Context/Config/useConfig";

import { formatTime, getAvg, getMean, normalizeRawTime } from "@/Utils/functions";

import { ResultInputType } from "@/types";
import ScramblePopover from "./ScramblePopover";
import { I18nProvider } from "@react-aria/i18n";
import { Button } from "@heroui/button";

const oldEvents = ["333ft", "magic", "mmagic", "333mbo"]

export default function ResultInsert(){
    const [result, setResult] = useState<ResultInputType>({
        event: "",
        result_type: "",
        result: [],
        date: dayjs().format("YYYY-MM-DD"),
        scrambles: []
    })
    const {events} = useConfig()

    const validateResult = (value: string, index: number) => {
        console.log(value);
        
        const newResults = [...(result?.result || [])];
        if (value.startsWith("/") && value.length > 1) return
        if (!/^\d*$/.test(value) && value !== "/") return;
        newResults[index] = value;
        return setResult(prev => ({ ...prev, result: newResults }));
    };

    const changeScramble = (value: string, index: number) => {
        const newScrambles = result?.scrambles || [];
        newScrambles[index] = value;
        return setResult(prev => ({ ...prev, scrambles: newScrambles }));
    };

    const avg = useMemo(() => {
        if (result.result_type === "ao5" && result.result.length === 5) {
            return getAvg(result.result);
        }
        if (result.result_type === "mo3" && result.result.length === 3) {
            return getMean(result.result);
        }
        return "";
    }, [result.result, result.result_type]);

    return (
        <div className="grow flex justify-center items-center w-full">
            <div className="bg-neutral-900 rounded-md shadow-amber-50 p-3 flex flex-col gap-3 justify-center items-center w-9/10 ">
                <p className="text-2xl font-bold">Add result</p>
                <div className="flex flex-col gap-2 max-h-[60vh] overflow-auto">
                    <Select
                    label="Event"
                    placeholder="Choose an event"
                    variant="faded"
                    size="sm"
                    radius="sm"
                    isClearable
                    startContent={result?.event &&<span className={`cubing-icon event-${result?.event}`}></span>}
                    onClear={() => setResult(prev => ({...prev, event: ""}))}
                    selectedKeys={result?.event ? [result.event] : []}
                    onChange={(e) => setResult(prev => ({...prev, event: e.target.value, result_type: "", result: [], scrambles: []}))}
                    >
                        {events.current.filter(event => !oldEvents.includes(event.id)).map((event) => 
                        <SelectItem key={event.id} textValue={event.name}>
                            <span className={`cubing-icon event-${event.id}`}></span> {event.name}
                        </SelectItem>)}
                    </Select>

                    <Select
                    label="Resul type"
                    placeholder="Choose a result type"
                    variant="faded"
                    size="sm"
                    radius="sm"
                    isClearable
                    isDisabled={!result?.event}
                    onClear={() => setResult(prev => ({...prev, result_type: ""}))}
                    selectedKeys={result?.result_type ? [result.result_type] : []}
                    onChange={(e) => setResult(prev => ({...prev, result_type: e.target.value, result: [], scrambles: []}))}
                    disabledKeys={result?.event === "333mbf" ? ["ao5", "mo3"] : []}
                    >
                        <SelectItem key="single">Single</SelectItem>
                        <SelectItem key="ao5">Average of 5</SelectItem>
                        <SelectItem key="mo3">Mean of 3</SelectItem>
                    </Select>

                    {
                        result?.result_type === "ao5" ?
                        new Array(5).fill(0).map((_, index) =>
                                <Input
                                type="text"
                                size="sm"
                                label={`Solve ${index + 1}`}
                                placeholder={`Solve ${index + 1}`}
                                variant="faded"
                                radius="sm"
                                isRequired
                                endContent={<ScramblePopover scramble={result?.scrambles?.[index]||""} changeScramble={changeScramble} index={index}/>}
                                onChange={(e) => validateResult(e.target.value, index)}
                                onBlur={() => result?.result?.[index] !== "/" && validateResult(normalizeRawTime(result?.result?.[index]||""), index)}
                                value={result?.result?.[index]||""}
                                key={index}
                                description={`Formatted time: ${formatTime(result?.result?.[index]||"")}`}
                                />
                            )
                            : result?.result_type === "mo3" ?
                            new Array(3).fill(0).map((_, index) => 
                                <Input
                                type="text"
                                size="sm"
                                label={`Solve ${index + 1}`}
                                placeholder={`Solve ${index + 1}`}
                                variant="faded"
                                radius="sm"
                                isRequired
                                value={result?.result?.[index]||""}
                                endContent={<ScramblePopover scramble={result?.scrambles?.[index]||""} changeScramble={changeScramble} index={index}/>}
                                onChange={(e) => validateResult(e.target.value, index)}
                                onBlur={() => result?.result?.[index] !== "/" && validateResult(normalizeRawTime(result?.result?.[index]||""), index)}
                                key={index}
                                description={`Formatted time: ${formatTime(result?.result?.[index]||"")}`}
                                />
                        )
                        :   
                        <Input
                        type="text"
                        size="sm"
                        label={result?.result_type !== "single" ? "Results" : "Result"}
                        placeholder={result?.result_type !== "single" ? "Results" : "Result"}
                        variant="faded"
                        radius="sm"
                        isDisabled={!result?.result_type}
                        value={result?.result?.[0]||""}
                        onChange={(e) => validateResult(e.target.value, 0)}
                        onBlur={() => result?.result?.[0] !== "/" && validateResult(normalizeRawTime(result?.result?.[0]||""), 0)}
                        endContent={<ScramblePopover scramble={result?.scrambles?.[0]||""} changeScramble={changeScramble} index={0}/>}
                        description={`Formatted time: ${formatTime(result?.result?.[0]||"")}`}
                        />
                    }
                    
                    <I18nProvider locale="it-IT">
                        <DateInput
                        label="Date"
                        size="sm"
                        variant="faded"
                        radius="sm"
                        defaultValue={now("Europe/Rome")}
                        granularity="day"
                        hideTimeZone
                        onChange={(value: ZonedDateTime | null) => setResult(prev => ({...prev, date: `${value?.year.toString().padStart(4, "0")}-${value?.month}-${value?.day}`}))}
                        />
                    </I18nProvider>

                    <Textarea
                    label="Notes (optional)"
                    placeholder="Add notes..."
                    variant="faded"
                    size="sm"
                    radius="sm"
                    value={result?.notes||""}
                    onChange={(e) => setResult(prev => ({...prev, notes: e.target.value}))}
                    isClearable
                    onClear={() => setResult(prev => ({...prev, notes: ""}))}
                    minRows={2}
                    maxRows={3}
                    />
                </div>
            <p className="text-sm">{avg}</p>
            <Button
            fullWidth
            color="warning"
            variant="bordered"
            size="sm"
            radius="sm"
            isDisabled={!result?.event || !result.result_type || (result.result_type === "single" && !result.result.length) || (result.result_type === "ao5" && result.result.length < 5) || (result.result_type === "mo3" && result.result.length < 3) || !result?.date}
            >
                Add result
            </Button>
            </div>
        </div>
    )
}