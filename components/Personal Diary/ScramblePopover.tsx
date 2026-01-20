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
    return (
        <Popover
        showArrow
        offset={10}
        placement="bottom"
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
            <PopoverContent className="w-[240px]">
                <Input
                placeholder="Scramble (optional)"
                value={scramble}
                onChange={(e) => changeScramble(e.target.value, index)}
                />
            </PopoverContent>
        </Popover>
    )
}