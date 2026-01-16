export const safe = (prom: Promise<any>) => prom.then((res) => [null, res]).catch((err) => [err]);

export function checkId(id: string) {
    const value = id.toUpperCase();
    const pattern = /^[0-9]{4}[A-Za-z]{4}[0-9]{2}$/;

    return pattern.test(value);
}


const int_cities = [{en: "Rome", it: "Roma"}, {en: "Milan", it: "Milano"}, {en: "Turin", it: "Torino"}, {en: "Naples", it: "Napoli"}, {en: "Genoa", it: "Genova"}, {en: "Florence", it: "Firenze"}]

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

    const found = int_cities.find(c => c.en.toLowerCase() === city.toLowerCase());
    if (found) city = found.it;

    return city
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

