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
