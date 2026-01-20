import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";

export default function ScramblePopover({
    scramble,
    index,
    changeScramble
} : {
    scramble: string,
    index: number,
    changeScramble: (value: string, index: number) => void
}) {
    const checkScramble = (scramble: string) => {

        if (/^[BLRDUF2' ]*$/.test(scramble)) changeScramble(scramble, index);
    }

    return (
        <Popover
        showArrow
        offset={10}
        placement="top"
        backdrop="opaque"
        >
            <PopoverTrigger>
                <Button
                color="primary"
                size="sm"
                className="text-xs flex gap-1"
                >
                    Scramble
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <Input
                placeholder="Scramble (optional)"
                value={scramble}
                isClearable
                size="sm"
                onClear={() => changeScramble("", index)}
                onChange={(e) => checkScramble(e.target.value.toUpperCase())}
                />
            </PopoverContent>
        </Popover>
    )
}