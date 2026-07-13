import { inject } from "inversify";
import { Body, Controller, Delete, Get, Path, Post, Put, Response, Route, Security, SuccessResponse, Tags } from "tsoa";
import { provideSingleton } from "../../util/provideSingleton";
import { ApiError, ApiErrorJSON } from "../ApiError";
import securities from "../auth/securities";
import { Profile, NewProfile } from "./Profile";
import { ProfileRepository } from "./ProfileRepository";
import AWS from "aws-sdk";

interface UploadRequest {
    filename: string;
    contentType: string;
}

interface UploadResponse {
    uploadURL: string;
    finalUrl: string;
}

export type ProfileRequestBody = {
    profile: Profile;
};

export type ProfileResponseBody = {
    profile: NewProfile;
};

export interface MultipleProfilesResponseBody {
    profiles: NewProfile[];
}

@Tags("profile")
@Route("profile")
@provideSingleton(ProfileController)

export class ProfileController extends Controller {

    constructor(@inject("ProfileRepository") private profileRepositoryfile: ProfileRepository) {
        super();
    }

    @Get("{profileId}")
    @Security(securities.USER_AUTH)
    public async getProfile(@Path("profileId") profileId: string): Promise<ProfileResponseBody> {

        const profile = await this.profileRepositoryfile.fetchById(profileId);
        if (!profile) {
            throw new ApiError({
                statusCode: 404,
                type: "PROFILE_NOT_FOUND",
            });
        }

        return { profile };
    }

    @Security(securities.USER_AUTH)
    @Put("{profileId}")
    public async putProfile(@Path("profileId") profileId: string, @Body() reqBody: ProfileRequestBody): Promise<ProfileResponseBody> {
        const profile = await this.profileRepositoryfile.update(profileId, reqBody.profile);

        if (!profile) {
            throw new ApiError({
                statusCode: 404,
                type: "PROFILE_NOT_FOUND",
            });
        }

        return { profile };
    }

    @SuccessResponse(201)
    @Security(securities.USER_AUTH)
    @Post()
    public async postProfile(@Body() reqBody: ProfileRequestBody): Promise<ProfileResponseBody> {
        const profile = await this.profileRepositoryfile.create(reqBody.profile);
        return { profile };
    }

    @Response<ApiErrorJSON>(404, "Error: Not Found", {
        message: "profile not found",
        type: "PROFILE_NOT_FOUND",
    })

    @Delete("{profileId}")
    @Security(securities.USER_AUTH)
    public async deleteProfile(@Path("profileId") id: string): Promise<void> {
        const deleted = await this.profileRepositoryfile.delete(id);

        if (!deleted) {
            throw new ApiError({
                statusCode: 404,
                message: "profile not found",
                type: "PROFILE_NOT_FOUND",
            });
        }
    }

    @Get("mobile/{mobile}")
    @Security(securities.USER_AUTH)
    public async getProfileByMobile(@Path("mobile") mobile: string): Promise<ProfileResponseBody> {

        const profile = await this.profileRepositoryfile.fetchByMobile(mobile);
        if (!profile) {
            throw new ApiError({
                statusCode: 404,
                type: "PROFILE_NOT_FOUND",
            });
        }
        return { profile };
    }


    @Get("place/{placeName}")
    @Security(securities.USER_AUTH)
    public async getProfilesByPlaceName(@Path("placeName") placeName: string): Promise<MultipleProfilesResponseBody> {
        try {
            const profiles = await this.profileRepositoryfile.fetchByPlaceName(placeName);
            console.log("Profiles fetched:", profiles);

            if (!profiles || profiles.length === 0) {
                throw new ApiError({
                    statusCode: 404,
                    type: "PROFILE_NOT_FOUND",
                });
            }

            return { profiles };
        } catch (error) {
            console.error("Error", error);
            throw error;
        }
    }

    @Get("friendRequest/{profileId}")
    @Security(securities.USER_AUTH)
    public async fetchFriendRequestProfilesByUserId(@Path("profileId") profileId: string): Promise<MultipleProfilesResponseBody> {
        try {
            const profiles = await this.profileRepositoryfile.fetchFriendRequestProfilesByUserId(profileId);
            console.log("Profiles fetched:", profiles);

            if (!profiles || profiles.length === 0) {
                throw new ApiError({
                    statusCode: 404,
                    type: "PROFILE_NOT_FOUND",
                });
            }

            return { profiles };
        } catch (error) {
            console.error("Error", error);
            throw error;
        }
    }


    @Get("friendAccepted/{profileId}")
    @Security(securities.USER_AUTH)
    public async fetchFriendAcceptedProfilesByUserId(@Path("profileId") profileId: string): Promise<MultipleProfilesResponseBody> {
        try {
            const profiles = await this.profileRepositoryfile.fetchFriendAcceptedProfilesByUserId(profileId);
            console.log("Profiles fetched:", profiles);

            if (!profiles || profiles.length === 0) {
                throw new ApiError({
                    statusCode: 404,
                    type: "PROFILE_NOT_FOUND",
                });
            }

            return { profiles };
        } catch (error) {
            console.error("Error", error);
            throw error;
        }
    }

    // @Post("upload-url")
    // @Security(securities.USER_AUTH)
    // public async uploadProfileImage(@Body() body: UploadRequest): Promise<UploadResponse> {
    //     const { filename, contentType } = body;
    //     if (!filename || !contentType) {
    //         throw new ApiError({
    //             statusCode: 400,
    //             message: "Filename and contentType are required",
    //             type: "VALIDATION_ERROR",
    //         });
    //     }

    //     // AWS S3 setup
    //     const s3 = new AWS.S3({
    //         region: process.env.AWS_REGION || 'us-east-1',
    //         accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    //         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    //         signatureVersion: 'v4',
    //     });

    //     const BUCKET_NAME = "klatchup-uploads";
    //     if (!BUCKET_NAME) {
    //         throw new Error("AWS_BUCKET_NAME not set in environment");
    //     }

    //     const key = `photos/${Date.now()}-${filename}`;

    //     const uploadURL = await s3.getSignedUrlPromise('putObject', {
    //         Bucket: BUCKET_NAME,
    //         Key: key,
    //         Expires: 60, // URL expires in 60 seconds
    //         ContentType: contentType,
    //         ACL: 'public-read',
    //     });

    //     const finalUrl = `https://${BUCKET_NAME}.s3.us-east-1.amazonaws.com/${key}`;

    //     return { uploadURL, finalUrl };
    // }



}
