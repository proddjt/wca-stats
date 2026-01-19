export default function FullPageMsg({msg} : {msg: string}) {
    return (
        <div className="flex flex-col justify-center items-center grow text-lg font-bold text-default-600">{msg}</div>
    )
}