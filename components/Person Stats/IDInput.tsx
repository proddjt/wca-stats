import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { FaRegCheckCircle } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";

import { checkId } from "@/Utils/functions";
import { useState } from "react";

export default function IDInput({
    sendID
}: {
    sendID: (id: string) => void
}){

    const [id, setId] = useState<string>("");
    return (
        <>
        <h1 className="font-bold lg:text-5xl text-3xl">Insert a WCA ID</h1>
        <div className="flex flex-col justify-center items-center lg:w-1/8 w-7/10 gap-3">

            <Input
            label="WCA ID"
            id="wca_id"
            size="sm"
            type="text"
            variant="faded"
            value={id}
            onChange={(e) => e.target.value.length <= 10 && /^[A-Za-z0-9]*$/.test(e.target.value) ? setId(e.target.value.toUpperCase()) : null}
            endContent={id && id.length === 10 && checkId(id) ? <FaRegCheckCircle color="green" size="1.2em"/> : <MdOutlineCancel color="red" size="1.2em"/>}
            />

            <Button
            fullWidth
            color="warning"
            variant="bordered"
            onPress={() => checkId(id) && sendID(id)}
            >
                Submit
            </Button>
        </div>
        </>
    )
}