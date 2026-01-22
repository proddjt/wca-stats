export default function PwdRules({error}: {error: string}) {
    return (
        <ul className={`text-xs space-y-0.5 w-3/4 ${error === "vuoto" ? "text-neutral-300" : ""}`}>
            <li
            className={error.includes("lunghezza") ? "text-red-500" : 
                error === "vuoto" ? "" : "text-green-500" }
            >
                { error.includes("lunghezza") ? "🞮" : error === "vuoto" ? "•" : "✓" } At least 8 characters
            </li>
            <li
            className={error.includes("maiuscola") ? "text-red-500" : 
                error === "vuoto" ? "" : "text-green-500" }
            >
                { error.includes("maiuscola") ? "🞮" : error === "vuoto" ? "•" : "✓" } At lest an uppercase letter
            </li>
            <li
            className={ error.includes("minuscola") ? "text-red-500" : 
                error === "vuoto" ? "" : "text-green-500" }
            >
                { error.includes("minuscola") ? "🞮" : error === "vuoto" ? "•" : "✓" } At lest a lowercase letter
            </li>
            <li
            className={error.includes("numero") ? "text-red-500" : 
                error === "vuoto" ? "" : "text-green-500" }
            >
                { error.includes("numero") ? "🞮" : error === "vuoto" ? "•" : "✓" } At least a number
            </li>
            <li
            className={error.includes("speciale") ? "text-red-500" : 
                error === "vuoto" ? "" : "text-green-500" }
            >
                { error.includes("speciale") ? "🞮" : error === "vuoto" ? "•" : "✓" } At least a special character (!, @, #, $, %, ^, &, *, .)
            </li>
        </ul>
    )
}