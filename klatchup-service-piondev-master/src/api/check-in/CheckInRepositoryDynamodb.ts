import config from "config";
import {
    DeleteItemCommand,
    DynamoDBClient,
    GetItemCommand,
    PutItemCommand,
    QueryCommand,
    ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { v4 } from "uuid";
import { LoctionProfiles } from "./CheckIn";
import { CheckInRepository } from "./CheckInRepository";

export class CheckInRepositoryDynamoDB implements CheckInRepository {
    
    fetchProfilesByLocationId(locationId: string): Promise<LoctionProfiles | undefined> {
        throw new Error("Method not implemented.");
    }
    create(loctionProfiles: LoctionProfiles): Promise<LoctionProfiles> {
        throw new Error("Method not implemented.");
    }
    delete(profileId: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}