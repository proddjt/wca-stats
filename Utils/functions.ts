export const safe = (prom: Promise<any>) => prom.then((res) => [null, res]).catch((err) => [err]);

export function checkId(id: string) {
    const value = id.toUpperCase();
    const pattern = /^[0-9]{4}[A-Za-z]{4}[0-9]{2}$/;

    return pattern.test(value);
}

export function parseString(input: string) {
    if (typeof input !== "string") return "";

    const parts = input.split(",");
    let city = ""

    switch (parts.length) {
        case 1:
            city = parts[0].trim();
            break;
        case 2:
            city = parts[0].trim();
            break;
        case 3:
            city = parts[1].trim();
            break;
        default:
            city = input;
            break;
    }

    city = city.replace(/\s*\([^)]*\)/g, "").trim();

    return normalizeCity(city)
}

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

export function diffToHuman(date: string) {
    const start = dayjs(date, "YYYY-MM-DD");
    const end = dayjs();

    let years = end.diff(start, "year");
    let temp = start.add(years, "year");

    let months = end.diff(temp, "month");
    temp = temp.add(months, "month");

    let weeks = end.diff(temp, "week");
    temp = temp.add(weeks, "week");

    let days = end.diff(temp, "day");

    const parts = [];
    if (years > 0) parts.push(`${years} ${years === 1 ? "year" : "years"}`);
    if (months > 0) parts.push(`${months} ${months === 1 ? "month" : "months"}`);
    if (weeks > 0) parts.push(`${weeks} ${weeks === 1 ? "week" : "weeks"}`);
    if (days > 0) parts.push(`${days} ${days === 1 ? "day" : "days"}`);

    return parts.join(", ");
}

export function secondDiffToHuman(totalSeconds: number) {
    let remaining = totalSeconds;

    const years = Math.floor(remaining / (365 * 24 * 3600));
    remaining -= years * 365 * 24 * 3600;

    const months = Math.floor(remaining / (30 * 24 * 3600));
    remaining -= months * 30 * 24 * 3600;

    const weeks = Math.floor(remaining / (7 * 24 * 3600));
    remaining -= weeks * 7 * 24 * 3600;

    const days = Math.floor(remaining / (24 * 3600));
    remaining -= days * 24 * 3600;

    const hours = Math.floor(remaining / 3600);
    remaining -= hours * 3600;

    const minutes = Math.floor(remaining / 60);
    remaining -= minutes * 60;

    // remaining ora contiene i secondi, anche decimali
    const seconds = Number(remaining.toFixed(2));

    const parts: string[] = [];

    if (years > 0) parts.push(`${years} ${years === 1 ? "year" : "years"}`);
    if (months > 0) parts.push(`${months} ${months === 1 ? "month" : "months"}`);
    if (weeks > 0) parts.push(`${weeks} ${weeks === 1 ? "week" : "weeks"}`);
    if (days > 0) parts.push(`${days} ${days === 1 ? "day" : "days"}`);
    if (hours > 0) parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
    if (minutes > 0) parts.push(`${minutes} ${minutes === 1 ? "minute" : "minutes"}`);
    if (seconds > 0) parts.push(`${seconds} ${seconds === 1 ? "second" : "seconds"}`);

    return parts.join(", ");
}

const normalized_cities = [
    {original: "Bucuresti", normalized: "Bucharest"},
    {original: "Rome", normalized: "Roma"},
    {original: "Milan", normalized: "Milano"},
    {original: "Turin", normalized: "Torino"},
    {original: "Naples", normalized: "Napoli"},
    {original: "Genoa", normalized: "Genova"},
    {original: "Florence", normalized: "Firenze"}
]

export function normalizeCity(city: string) {
    if (normalized_cities.find(c => c.original.toLowerCase() === city.toLowerCase())) return normalized_cities.find(c => c.original.toLowerCase() === city.toLowerCase())!.normalized
    return city
}

export function decodeMBF(value: number): number | null {
    const str = value.toString().padStart(8, "0");

    // OLD FORMAT: 1SSAATTTTT (10 digits)
    if (str.length === 10 && str.startsWith("1")) {
        const TTTTT = parseInt(str.slice(5, 10), 10);

        if (TTTTT === 99999) return null; // unknown time

        return TTTTT; // seconds
    }

    // NEW FORMAT: DDTTTTTMM (9 digits)
    if (str.length === 9) {
        const TTTTT = parseInt(str.slice(2, 7), 9);

        if (TTTTT === 99999) return null; // unknown time

        return TTTTT; // seconds
    }

    return null; // formato non valido
}