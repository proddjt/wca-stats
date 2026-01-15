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

export interface PersonType {
    id: string,
    name: string,
    slug: string,
    country: string,
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
        },
        average: {
            WR: number,
            CR: number,
            NR: number
        }
    },
    results: object,
    img?: string,
    last_medals: {
        last_pos1_date: string,
        last_pos2_date: string,
        last_pos3_date: string
    }
}