import HomeCard from "./HomeCard"

const cards = [
    {
        title: "Medals table",
        link: "/medals-table"
    },
    {
        title: "Person stats",
        link: "/person-stats"
    },
    {
        title: "Personal diary",
        link: "/personal-diary"
    }
]

export default function Homepage(){
    return (
        <div className="grow flex flex-col p-5 justify-between">
            <h1 className="font-bold lg:text-5xl text-3xl text-center">Making statistics fun and accessible</h1>
            <div className="grow flex flex-col p-5 gap-10">
            {
                cards.map((c: any) => <HomeCard key={c.title} text={c.title} url={c.link} />)
            }
            </div>
        </div>
    )
}