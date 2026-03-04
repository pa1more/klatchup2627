import config from "config";
import {
  BatchGetItemCommand,
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
  ScanCommand,
  ScanCommandOutput,
} from "@aws-sdk/client-dynamodb";
import { v4 } from "uuid";
import { Profile, NewProfile } from "./Profile";
import { ProfileRepository } from "./ProfileRepository";
import { mapProfileDynamoDBItemToProfile, mapProfileToDynamoDBItem } from "./ProfileMappers";

export class ProfileRepositoryDynamoDB implements ProfileRepository {

  private client: DynamoDBClient;
  private tableName: string;

  constructor() {
    this.client = new DynamoDBClient(config.get("dynamodb"));
    this.tableName = config.get("dbTables.klatchup.name");
  }

  async fetchAll(): Promise<Profile[]> {
    const output = await this.client.send(
      new ScanCommand({
        TableName: this.tableName,
      }),
    );

    return (output.Items || []).map((item) => mapProfileDynamoDBItemToProfile(item));
  }

  async delete(profileId: string): Promise<boolean> {
    const existingProfile = await this.fetchById(profileId);
    if (!existingProfile) {
      return false;
    }

    await this.client.send(
      new DeleteItemCommand({
        TableName: this.tableName,
        Key: {
          ProfileID: { S: profileId },
        },
      }),
    );

    return true;
  }

  async update(profileId: string, data: Profile): Promise<NewProfile | undefined> {

    const existingProfile = await this.fetchById(profileId);
    if (!existingProfile) {
      return undefined;
    }
    const updatedProfile = {
      ...data,
      profileId,
      createdAt: existingProfile.createdAt,
    };

    await this.client.send(
      new PutItemCommand({
        TableName: this.tableName,
        Item: mapProfileToDynamoDBItem(updatedProfile),
      }),
    );

    return updatedProfile;
  }

  async create(newProfile: Profile): Promise<NewProfile> {
    const profile = {
      ...newProfile,
      profileId: v4(),
      createdAt: new Date(),
    };

    await this.client.send(
      new PutItemCommand({
        TableName: this.tableName,
        Item: mapProfileToDynamoDBItem(profile),
      }),
    );

    return profile;
  }

  async fetchById(profileId: string): Promise<NewProfile | undefined> {
    const output = await this.client.send(
      new GetItemCommand({
        TableName: this.tableName,
        Key: {
          profileId: { S: profileId },
        },
      }),
    );

    if (!output.Item) {
      return undefined;
    }

    return mapProfileDynamoDBItemToProfile(output.Item);
  }

  async fetchByMobile(mobile: string): Promise<NewProfile | undefined> {
    const output = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: "MobileIndex",
        KeyConditionExpression: "Mobile = :m",
        ExpressionAttributeValues: {
          ":m": { S: mobile },
        },
      })
    );

    if (!output.Items || output.Items.length === 0) {
      return undefined;
    }

    return mapProfileDynamoDBItemToProfile(output.Items[0]);
  }

  async fetchByPlaceName(placeName: string): Promise<NewProfile[]> {

    const results: NewProfile[] = [];
    let ExclusiveStartKey: Record<string, any> | undefined = undefined;

    do {
      const output = await this.client.send(
        new ScanCommand({
          TableName: this.tableName,
          FilterExpression: "contains(CurrentLocation, :place)",
          ExpressionAttributeValues: {
            ":place": { S: `"placeName":"${placeName}"` },
          },
        })
      );

      if (output.Items) {
        results.push(...output.Items.map(mapProfileDynamoDBItemToProfile));
      }

      ExclusiveStartKey = output.LastEvaluatedKey;
    } while (ExclusiveStartKey);

    return results;
  }

  async fetchFriendRequestProfilesByUserId(profileId: string): Promise<NewProfile[]> {
    console.log(profileId)
    // Step 1: Fetch the profile for the given userId
    const profileResult = await this.client.send(
      new GetItemCommand({
        TableName: this.tableName,
        Key: {
          profileId: { S: profileId }, // adjust key name if it's different
        },
      })
    );

    console.log(profileResult.Item)
    const item = profileResult.Item;

    // Check if FriendRequest exists and parse it from string
    const friendRequestStr = item?.FriendRequest?.S;
    if (!friendRequestStr) {
      return [];
    }

    let friendIds: string[] = [];

    try {
      const friendRequestObj = JSON.parse(friendRequestStr);
      if (Array.isArray(friendRequestObj.user_ids)) {
        friendIds = friendRequestObj.user_ids;
      }
    } catch (err) {
      console.error("Failed to parse FriendRequest JSON:", err);
      return [];
    }

    if (friendIds.length === 0) {
      return [];
    }

    // Step 2: Batch get all friend profiles
    const keys = friendIds.map((id) => ({
      profileId: { S: id },
    }));

    const batchResult = await this.client.send(
      new BatchGetItemCommand({
        RequestItems: {
          [this.tableName]: {
            Keys: keys,
          },
        },
      })
    );

    const friendItems = batchResult.Responses?.[this.tableName] ?? [];
    console.log("friendItems")
    console.log(friendItems)
    // Step 3: Convert DynamoDB items to NewProfile objects
    return friendItems.map(mapProfileDynamoDBItemToProfile);
  }

  async fetchFriendAcceptedProfilesByUserId(profileId: string): Promise<NewProfile[]> {
    // Step 1: Fetch the profile for the given userId
    const profileResult = await this.client.send(
      new GetItemCommand({
        TableName: this.tableName,
        Key: {
          profileId: { S: profileId }, // adjust key name if it's different
        },
      })
    );

    const item = profileResult.Item;

    // Check if FriendRequest exists and parse it from string
    const friendRequestStr = item?.Friends?.S;
    if (!friendRequestStr) {
      return [];
    }

    let friendIds: string[] = [];

    try {
      const friendRequestObj = JSON.parse(friendRequestStr);
      if (Array.isArray(friendRequestObj.user_ids)) {
        friendIds = friendRequestObj.user_ids;
      }
    } catch (err) {
      console.error("Failed to parse FriendRequest JSON:", err);
      return [];
    }

    if (friendIds.length === 0) {
      return [];
    }

    // Step 2: Batch get all friend profiles
    const keys = friendIds.map((id) => ({
      profileId: { S: id },
    }));

    const batchResult = await this.client.send(
      new BatchGetItemCommand({
        RequestItems: {
          [this.tableName]: {
            Keys: keys,
          },
        },
      })
    );

    const friendItems = batchResult.Responses?.[this.tableName] ?? [];
    console.log("friendItems")
    console.log(friendItems)
    // Step 3: Convert DynamoDB items to NewProfile objects
    return friendItems.map(mapProfileDynamoDBItemToProfile);
  }

}
