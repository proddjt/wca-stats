import { Tab, Tabs } from "@heroui/tabs";
import { Key } from "@react-types/shared";

export default function TabNavigation({
    sections,
    selectedKey,
    onSelectionChange,
    isDisabled
} : {
    sections: any[]
    selectedKey: Key,
    onSelectionChange: (key: string) => void,
    isDisabled?: boolean
}){
    const getIcon = (key: string) => {
        const Icon = sections?.find((s: any) => s.key === key)?.icon || sections[0].icon
        return <Icon size={15}/>
    }
    return (
        <Tabs
        aria-label="Tab navigation"
        selectedKey={selectedKey}
        onSelectionChange={(key) => onSelectionChange(key as string)}
        color="warning"
        isDisabled={isDisabled}
        >
        {
        sections.map((section: any) =>
            <Tab
            key={section.key}
            title={
                <div className="flex items-center space-x-2">
                    {getIcon(section.key)}
                    <span>{section.title}</span>
                </div>
            }
            className="font-bold"
            />
        )
        }
        </Tabs>
    )
}