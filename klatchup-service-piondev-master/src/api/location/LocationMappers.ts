import { Location, LocationRequest, LocationResponse, RankPreference } from "./Location"

export const mapLocationRequest = (req: LocationRequest): Location => {
    return {
        languageCode: "en",
        includedTypes: ["restaurant", "cafe",
            // "bar,night club,pub,Lounge,gastropub,live music bar,brewpub,restaurant,sports bar"
        ],
        maxResultCount: 20,
        locationRestriction: {
            circle: {
                center: {
                    latitude: req.latitude,
                    longitude: req.longitude
                },
                radius: 5000
            }
        },
        rankPreference: RankPreference.DISTANCE
    }
}

export const mapLocationResponse = (res: any): LocationResponse => {
    const googlePlaces = res.places;
    return googlePlaces.map((_place: any) => ({
        name: _place.name,
        id: _place.id,
        displayName: _place.displayName.text,
        formattedAddress: _place.formattedAddress
    }));
}