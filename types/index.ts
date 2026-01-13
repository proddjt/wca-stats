export interface RowsType {
    name: string,
    wca_id: string,
    country_id: string,
    golds: number,
    silvers: number,
    bronzes: number,
    total_medals: number
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
    event: string,
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