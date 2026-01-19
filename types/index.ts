import { MutableRefObject } from "react"

export interface RowsType {
    position: number,
    name: string,
    wca_id: string,
    country_id: string,
    golds: number,
    silvers: number,
    bronzes: number,
    total_medals: number,
    col_order: string
}

export interface MedalType {
    id: string,
    person_id: string,
    country_id: string,
    event_id: string,
    year: number,
    medal_type: string,
    name: string
}

export interface FiltersType {
    nationality: string,
    year: string[] | [],
    event: string[] | [],
    name: string,
    col_order: string,
    ascending: boolean,
    country: string,
    more_filters: {
        no_golds: boolean,
        no_silvers: boolean,
        no_bronzes: boolean
    }
}

export interface IsLoadingContextType {
    isPending: boolean,
    showLoader: (f: () => Promise<void>) => void
}

export interface ConfigContextType {
    nations: MutableRefObject<NationType[]>,
    events: MutableRefObject<EventType[]>
    years: MutableRefObject<{year: string}[]>
}

export interface FormType {
    email: string,
    password: string
}

export interface NationType {
    id: string,
    name: string,
    cont_id: string
}

export interface EventType {
    id: string,
    name: string
}

export interface PagesType {
    page: number
    total: number
}

export interface SolveRound {
    round: string;
    position: number;
    best: number;
    average: number;
    format: string;
    solves: number[];
}

export interface ResultType {
    [key: string]: EventResults
}

export interface TimePassedType{
    [key: string]: number
}

export type EventResults = Record<string, SolveRound[]>

export interface PersonType {
    id: string,
    name: string,
    slug: string,
    country: string,
    region: string,
    medals_by_country: {
        country: string,
        golds: number,
        silvers: number,
        bronzes: number,
        total_medals: number
    }[],
    numberOfCompetitions: number,
    competitionIds: string[] | [],
    numberOfChampionships: number,
    championshipIds: string[] | [],
    rank: {
        singles: object[],
        averages: object[]
    },
    medals: {
        bronze: number,
        silver: number,
        gold: number
    },
    records: {
        single: {
            WR: number,
            CR: number,
            NR: number
        } | any[],
        average: {
            WR: number,
            CR: number,
            NR: number
        } | any[]
    },
    time_passed: TimePassedType,
    people_met: PersonMetType[],
    delegates_met: PersonMetType[],
    results: ResultType,
    img?: string,
    last_medals: {
        last_pos1_date: string,
        first_pos1_date: string,
        first_pos1_comp: string,
        last_pos1_comp: string,
        last_pos2_date: string,
        first_pos2_date: string,
        first_pos2_comp: string,
        last_pos2_comp: string,
        last_pos3_date: string,
        first_pos3_date: string,
        first_pos3_comp: string,
        last_pos3_comp: string,
        first_comp: string
    }
}

export interface PersonMetType {
    name: string,
    wca_id: string,
    comp_ids: string[]
    country: string
}

export interface StatsFiltersType {
    year: string,
}