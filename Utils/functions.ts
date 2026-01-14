export function checkId(e: React.ChangeEvent<HTMLInputElement>, update_fn: (id: string) => void){
    const onlyNumbers = /^[0-9]+$/;
    const onlyLetters = /^[A-Za-z]+$/;

    switch (e.target.value.length) {
        case 0:
            return update_fn("");
        case 1:
        case 2:
        case 3:
        case 4:
        case 9:
        case 10:
            return onlyNumbers.test(e.target.value[e.target.value.length - 1]) && update_fn(e.target.value.toUpperCase());
        case 5:
        case 6:
        case 7:
        case 8:
            return onlyLetters.test(e.target.value[e.target.value.length - 1]) && update_fn(e.target.value.toUpperCase());
        default:
            return false;
    }
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
