import { Input } from "@heroui/input";
import { Form } from "@heroui/form";
import { Button } from "@heroui/button";

export default function PersonStatsPage(){
    return (
        <div className="grow flex flex-col justify-center items-center gap-5">
            <h1 className="font-bold lg:text-5xl text-3xl">Insert a WCA ID</h1>
            <Form
            className="flex flex-col justify-center items-center lg:w-1/8 w-7/10"
            // onSubmit={(e) => {
            //     e.preventDefault();
            //     const id = Object.fromEntries(new FormData(e.currentTarget));

            // }}
            >
                <Input
                label="WCA ID"
                size="sm"
                type="text"
                variant="faded"
                />
                <Button
                fullWidth
                color="warning"
                variant="bordered"
                type="submit"
                >
                    Submit
                </Button>
            </Form>
        </div>
    )
}