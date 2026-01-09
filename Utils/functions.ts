import { RowsType } from "@/types";

export function sortRows(
  data: RowsType[],
  col: keyof RowsType,
  ascending: boolean
) {
  return [...data].sort((a, b) => {
    const valA = a[col];
    const valB = b[col];

    // Se sono stringhe → ordina alfabeticamente
    if (typeof valA === "string" && typeof valB === "string") {
      return ascending
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    // Se sono numeri → ordina numericamente
    if (typeof valA === "number" && typeof valB === "number") {
      return ascending ? valA - valB : valB - valA;
    }

    return 0;
  });
}
