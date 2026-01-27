'use client'

import { IoLogOut } from "react-icons/io5";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { getKeyValue, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/table";
import { useRouter } from "next/navigation";

import { CircleFlag } from "react-circle-flags";
import { GiCancel } from "react-icons/gi";

import useDatabase from "./hooks/useDatabase";
import useIsLoading from "@/Context/IsLoading/useIsLoading";
import useUser from "@/Context/User/useUser";

import { regions_icon } from "@/Utils/regions_icon";

import Loader from "../Layout/Loader";
import FullPageMsg from "../Layout/FullPageMsg";
import { useRef } from "react";
import { useDisclosure } from "@heroui/modal";


const cols = [
    {
        label: "Name",
        key: "name",
    },
    {
        label: "WCA ID",
        key: "wca_id",
    },
    {
        label: "Region",
        key: "region",
    }
]

export default function UpdateDatabasePage(){
    const {
        doUpdate,
        getRegistrations,
        registrations,
        comp_id,
        resetRegistration
    } = useDatabase();

    const modalPerson = useRef<any>(null);

    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const {doLogout} = useUser()

    const {user_role} = useUser();

    const {isPending, showLoader} = useIsLoading();

    // if (user_role.current !== "admin") return <FullPageMsg msg="You are not an admin. Please login with a valid admin account" />

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
            {
                !registrations || !registrations.length ?

                <div className="flex flex-col justify-center items-center gap-3">
                    <p className="text-xl">Get registrations list</p>
                    <Input
                    type="text"
                    placeholder="Insert competition id..."
                    onChange={(e) => comp_id.current = e.target.value}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === "NumpadEnter") && showLoader(() => getRegistrations())}
                    />
                    <Button
                    onPress={() => showLoader(() => getRegistrations())}
                    isDisabled={isPending}
                    fullWidth
                    >
                        Search
                    </Button>
                </div>
                :
                <div className="flex flex-col justify-center items-center gap-3">
                    <p className="text-xl">Registrations list</p>
                    
                    <Table
                    aria-label="registrations-table"
                    isCompact
                    isStriped
                    classNames={{
                        wrapper: "max-h-[50vh] lg:max-h-[60vh] w-full max-w-[90vw] lg:w-[40vw] lg:max-w-[65vw] overflow-auto",
                        td: "whitespace-nowrap overflow-hidden text-ellipsis",
                    }}
                    isHeaderSticky
                    >
                        <TableHeader columns={cols}>
                            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                        </TableHeader>
                        <TableBody
                        items={registrations.map((r: any) => ({...r, key: r.wca_id})) ||[]}
                        emptyContent="No data available"
                        >
                            {(item) => (
                            <TableRow
                            key={item.key}
                            onClick={() => {
                                if (item["region"]) {
                                    modalPerson.current = item;
                                    onOpen();
                                }
                            }}
                            >
                                {(columnKey) => <TableCell>
                                    <span className="flex flex-row gap-1">
                                    {
                                        columnKey === "region" ?
                                            item[columnKey] ?
                                            <>
                                            <CircleFlag countryCode={regions_icon.find((region) => region.name === item[columnKey])?.icon||"IT"} width="20" />
                                            {getKeyValue(item, columnKey)}
                                            </>
                                            :
                                            <>
                                            <GiCancel color="red" size={20}/>
                                            <p>Missing!</p>
                                            </>
                                        :
                                        getKeyValue(item, columnKey)
                                    }
                                    </span>
                                </TableCell>}
                            </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    <Button
                    onPress={resetRegistration}
                    isDisabled={isPending}
                    fullWidth
                    color="danger"
                    variant="flat"
                    >
                        Change competition
                    </Button>
                </div>
            }
            
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