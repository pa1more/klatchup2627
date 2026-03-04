import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { NewProfile } from "./Profile";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export const mapProfileToDynamoDBItem = (profile: NewProfile): Record<string, AttributeValue> => {
  const createdAt = typeof profile.createdAt === 'string' || typeof profile.createdAt === 'number'
    ? new Date(profile.createdAt)
    : profile.createdAt;
  return {
    profileId: { S: profile.profileId },
    Name: { S: profile.name },
    Mobile: { S: profile.mobile },
    BirthDate: { S: profile.birthDate },
    Gender: { S: profile.gender },
    Interests: { S: JSON.stringify(profile.interests) },
    City: { S: profile.city },
    Bio: { S: profile.bio },
    ProfilePicture: { S: profile.profilePicture },
    CreatedAt: { N: createdAt.getTime().toString() },
    Work: { S: profile.work },
    Education: { S: profile.education },
    LookingFor: { S: profile.lookingFor },
    CurrentLocation: { S: JSON.stringify(profile.currentLocation) },
    FriendRequest: { S: JSON.stringify(profile.friendRequest) },
    Friends: { S: JSON.stringify(profile.friends) },
    IsActive: { S: profile.isActive.toString() },
    IsDeleted: { S: profile.isDeleted.toString() },
    UpdatedFor: { N: createdAt.getTime().toString() },
    ShowPictures: { S: JSON.stringify(profile.showPictures) }
  };
};

export const mapProfileDynamoDBItemToProfile = (item: Record<string, AttributeValue>): NewProfile => {

  const obj = unmarshall(item);

  return {
    profileId: obj["profileId"],
    name: obj["Name"],
    mobile: obj["Mobile"],
    birthDate: obj["BirthDate"],
    gender: obj["Gender"],
    interests: obj["Interests"],
    city: obj["City"],
    bio: obj["Bio"],
    profilePicture: obj["ProfilePicture"],
    createdAt: obj["CreatedAt"],
    work: obj["Work"],
    education: obj["Education"],
    lookingFor: obj["LookingFor"],
    currentLocation: obj["CurrentLocation"],
    friendRequest: obj["FriendRequest"],
    friends: obj["Friends"],
    isActive: obj["IsActive"],
    isDeleted: obj["IsDeleted"],
    updatedAt: obj["CreatedAt"],
    showPictures: obj["ShowPictures"]
  };
};