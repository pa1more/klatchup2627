import { Body, Controller, Post, Route, Security, Tags } from "tsoa";
import { provideSingleton } from "../../util/provideSingleton";
import { ApiError } from "../ApiError";
import securities from "../auth/securities";
import { LocationRequest, LocationResponse } from "./Location";
import config from "config";
import { mapLocationRequest, mapLocationResponse } from "./LocationMappers";

// eslint-disable-next-line no-new-func
const importDynamic = new Function('modulePath', 'return import(modulePath)');

const fetch = async (...args: any[]) => {
    const module = await importDynamic('node-fetch');
    return module.default(...args);
};


@Tags("location")
@Route("location")
@provideSingleton(LocationController)
export class LocationController extends Controller {
    constructor() {
        super();
    }

    @Security(securities.USER_AUTH)
    @Post()
    public async getPlaces(@Body() reqBody: LocationRequest): Promise<LocationResponse> {
        const url =
            'https://places.googleapis.com/v1/places:searchNearby';

        const options: any = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': config.get("googleKey"),
                'X-Goog-FieldMask': 'places.displayName,places.id,places.formattedAddress'
            },
            body: JSON.stringify(mapLocationRequest(reqBody))
        };
        console.log(url, options)
        try {
            const response = await fetch(url, options);
            const places = await response.json();
            return mapLocationResponse(places);
        } catch (err) {
            console.log(err)
            throw new ApiError({
                statusCode: 404,
                message: "location not found",
                type: "LOCATION_NOT_FOUND",
            });
        }
    }
}