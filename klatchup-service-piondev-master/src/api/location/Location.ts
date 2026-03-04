export interface Location {
    languageCode: string,
    includedTypes: string[
    ],
    maxResultCount: 20,
    locationRestriction: {
        circle: Circle
    },
    rankPreference: RankPreference.DISTANCE
}


export enum RankPreference {
    RANK_PREFERENCE_UNSPECIFIED,
    DISTANCE,
    POPULARITY
}

export interface Circle {
    center: LocationRequest,
    radius: number
}

export interface LocationRequest {
    latitude: number,
    longitude: number
}

export interface LocationResponse {
    places: Place[]
}

export interface Place {
    name: string,
    id: string
    displayName: {
        text: string
        languageCode: string
    },
    formattedAddress: string
    shortFormattedAddress: string
}

export interface IHeaderOptions {
    method: string;
    headers: {
        'X-Goog-Api-Key': string;
        'X-Goog-FieldMask': string;
    };
    body: any;
}