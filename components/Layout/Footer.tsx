import { Link } from "@heroui/link";

export default function Footer(){
    return (
        <footer className="flex items-center justify-center py-3 lg:gap-2 gap-1 lg:flex-row flex-col">
            <Link
            isExternal
            className="flex items-center gap-1 text-current lg:text-sm text-xs"
            href="https://github.com/proddjt"
            title="giovanni tramontano github profile"
            >
                <span className="text-default-600">Powered by</span>
                <p className="text-primary">Giovanni Tramontano</p>
            </Link>
            {/* <span className="lg:inline hidden">|</span>
            <Link isExternal className="flex items-center gap-1 text-current lg:text-sm text-xs" title="carmen gravano contact" href="mailto:carmen.grav998@gmail.com">
                <span className="text-default-600">Graphics by</span>
                <p className="text-primary">Carmen Gravano</p>
            </Link> */}
        </footer>
    )
}