'use client'

import { IoLogOut } from "react-icons/io5";
import { Button } from "@heroui/button";

import useDatabase from "./hooks/useDatabase";
import useIsLoading from "@/Context/IsLoading/useIsLoading";

import Loader from "../Layout/Loader";
import { useRouter } from "next/navigation";
import FullPageMsg from "../Layout/FullPageMsg";
import useUser from "@/Context/User/useUser";

export default function UpdateDatabasePage(){
    const {
        user,
        doUpdate,
    } = useDatabase();

    const {doLogout} = useUser()

    const router = useRouter();

    const {isPending} = useIsLoading();

    if (user?.role !== "admin") return <FullPageMsg msg="You are not an admin. Please login with a valid admin account" />

    return (
        <div className="flex flex-col grow justify-center gap-10 items-center">
            <h1 className="font-bold text-5xl">Update database</h1>
            <div className="flex justify-center gap-10 items-center lg:flex-row flex-col">
                <Button
                onPress={() => doUpdate("continents")}
                isDisabled={isPending}
                >
                    Update Continents
                </Button>
                <Button
                onPress={() => doUpdate("countries")}
                isDisabled={isPending}
                >
                    Update Countries
                </Button>
                <Button
                onPress={() => doUpdate("events")}
                isDisabled={isPending}
                >
                    Update Events
                </Button>
                <Button
                onPress={() => doUpdate("comps")}
                isDisabled={isPending}
                >
                    Update Comps
                </Button>
                <Button
                onPress={() => doUpdate("persons")}
                isDisabled={isPending}
                >
                    Update Persons
                </Button>
                <Button
                onPress={() => doUpdate("results")}
                isDisabled={isPending}
                >
                    Update Results
                </Button>
            </div>
            <Button
            onPress={doLogout}
            isDisabled={isPending}
            size="sm"
            startContent={<IoLogOut />}
            color="danger"
            className="w-1/4"
            >
                Logout
            </Button>
            {
                isPending && <Loader noFullscreen/>
            }
        </div>
    )
}