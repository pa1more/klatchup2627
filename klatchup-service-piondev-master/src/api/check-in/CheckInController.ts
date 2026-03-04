import { inject } from "inversify";
import { Body, Controller, Delete, Get, Path, Post, Response, Route, Security, SuccessResponse, Tags } from "tsoa";
import { provideSingleton } from "../../util/provideSingleton";
import { ApiError, ApiErrorJSON } from "../ApiError";
import securities from "../auth/securities";
import { CheckInRepository } from "./CheckInRepository";
import { LoctionProfiles } from "./CheckIn";


@Tags("checkin")
@Route("checkin")
@provideSingleton(CheckInController)

export class CheckInController extends Controller {
    
    constructor(@inject("CheckInRepository") private  checkInRepositoryfile: CheckInRepository) {
        super();
    }

    @Get("{locationId}")
    @Security(securities.USER_AUTH)
    public async getLocationProfileIds(@Path("locationId") locationId: string): Promise<LoctionProfiles> {
        const profiles = await this.checkInRepositoryfile.fetchProfilesByLocationId(locationId);
        if (!profiles) {
            throw new ApiError({
                statusCode: 404,
                type: "LOCATION_PROFILES_NOT_FOUND",
            });
        }
        return profiles;
    }

    @SuccessResponse(201)
    @Security(securities.USER_AUTH)
    @Post()
    public async postProfile(@Body() reqBody: LoctionProfiles): Promise<LoctionProfiles> {
        const profiles = await this.checkInRepositoryfile.create(reqBody);
        return  profiles;
    }

    @Delete("{profileId}")
    @Security(securities.USER_AUTH)
    public async deleteProfile(@Path("profileId") id: string): Promise<void> {
        const deleted = await this.checkInRepositoryfile.delete(id);

        if (!deleted) {
            throw new ApiError({
                statusCode: 404,
                message: "profile not found",
                type: "LOCATION_PROFILES_NOT_FOUND",
            });
        }
    }
}
