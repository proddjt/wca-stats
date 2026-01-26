'use client'

import { Image } from "@heroui/image";
import { Card, CardHeader } from "@heroui/card";
import { useRouter } from "next/navigation";

export default function HomeCard({
    text,
    image = "https://heroui.com/images/hero-card.jpeg",
    url,
    textColor = "text-default-600"
} : {
    text: string,
    image?: string,
    url: string
    textColor?: string
}){
    const router = useRouter();

    return (
        <Card
        isPressable
        className="col-span-12 sm:col-span-4 h-[200px]"
        onPress={() => router.push(url)}
        >
            <CardHeader className="absolute z-10 top-1 flex-col items-start!">
            <h4 className={`font-medium text-large ${textColor}`}>{text}</h4>
            </CardHeader>
            <Image
            removeWrapper
            alt="Card background"
            className="z-0 w-full h-full object-cover"
            src={image}
            />
        </Card>
    )
}