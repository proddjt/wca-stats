import { Input } from "@heroui/input";
import { Form } from "@heroui/form";
import { Button } from "@heroui/button";

export default function PersonStatsPage(){
    return (
        <div className="grow flex flex-col justify-center items-center">
            <h1 className="font-bold text-5xl">Person Stats</h1>
            <Form className="flex flex-col justify-center items-center w-1/8">
                <Input
                label="WCA ID"
                size="sm"
                type="text"
                variant="faded"
                />
                <Button>
                    Submit
                </Button>
            </Form>
        </div>
    )
}