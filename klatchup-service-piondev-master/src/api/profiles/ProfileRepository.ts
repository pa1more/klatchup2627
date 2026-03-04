import { Profile, NewProfile } from "./Profile";

export interface ProfileRepository {
  fetchById(profileId: string): Promise<NewProfile | undefined>;
  create(profile: Profile): Promise<NewProfile>;
  update(profileId: string, profile: Profile): Promise<NewProfile | undefined>;
  delete(profileId: string): Promise<boolean>;
  fetchByMobile(mobile: string): Promise<NewProfile | undefined>;
  fetchByPlaceName(placeName: string): Promise<NewProfile[]>;
  fetchFriendRequestProfilesByUserId(profileId: string): Promise<NewProfile[] | undefined>;
  fetchFriendAcceptedProfilesByUserId(profileId: string): Promise<NewProfile[] | undefined>;
}
