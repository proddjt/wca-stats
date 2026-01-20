import { useState } from "react";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { DateInput } from "@heroui/date-input";
import { CalendarDate, parseDate } from "@internationalized/date";
import dayjs from "dayjs";

import useConfig from "@/Context/Config/useConfig";

import { formatTime } from "@/Utils/functions";

import { ResultInputType } from "@/types";
import ScramblePopover from "./ScramblePopover";

const oldEvents = ["333ft", "magic", "mmagic", "333mbo"]

export default function ResultInsert(){
    const [result, setResult] = useState<ResultInputType>()
    const {events} = useConfig()

    const validateResult = (value: string, index: number) => {
        const raw = value;
        if (!/^\d*$/.test(raw)) return;
        const newResults = result?.result || [];
        newResults[index] = raw;
        return setResult(prev => ({ ...prev, result: newResults }));
    };

    const changeScramble = (value: string, index: number) => {
        const newScrambles = result?.scrambles || [];
        newScrambles[index] = value;
        return setResult(prev => ({ ...prev, scrambles: newScrambles }));
    };

    return (
        <div className="grow flex justify-center items-center w-full">
            <div className="bg-neutral-900 rounded-md shadow-amber-50 p-3 flex flex-col gap-3 justify-center items-center w-8/10 max-h-[75vh] overflow-auto">
                <p className="text-2xl font-bold">Add result</p>

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
                            type="number"
                            size="sm"
                            label={`Solve ${index + 1}`}
                            placeholder={`Solve ${index + 1}`}
                            variant="faded"
                            radius="sm"
                            endContent={<ScramblePopover scramble={result?.scrambles?.[index]||""} changeScramble={changeScramble} index={index}/>}
                            onChange={(e) => validateResult(e.target.value, index)}
                            value={result?.result?.[index]||""}
                            key={index}
                            description={`Formatted time: ${formatTime(result?.result?.[index]||"")}`}
                            />
                        )
                    : result?.result_type === "mo3" ?
                        new Array(3).fill(0).map((_, index) => 
                            <Input
                            type="number"
                            size="sm"
                            label={`Solve ${index + 1}`}
                            placeholder={`Solve ${index + 1}`}
                            variant="faded"
                            radius="sm"
                            value={result?.result?.[index]||""}
                            endContent={<ScramblePopover scramble={result?.scrambles?.[index]||""} changeScramble={changeScramble} index={index}/>}
                            onChange={(e) => validateResult(e.target.value, index)}
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
                        onChange={(e) => validateResult(e.target.value, 0)}
                        endContent={<ScramblePopover scramble={result?.scrambles?.[0]||""} changeScramble={changeScramble} index={0}/>}
                        description={`Formatted time: ${formatTime(result?.result?.[0]||"")}`}
                        />
                }

                <DateInput
                label="Date"
                size="sm"
                variant="faded"
                radius="sm"
                value={result?.date ? parseDate(result.date) : null}
                onChange={(value: CalendarDate | null) => setResult(prev => ({...prev, date: `${value?.year.toString().padStart(4, "0")}-${value?.month}-${value?.day}`}))}
                />
            </div>
        </div>
    )
}