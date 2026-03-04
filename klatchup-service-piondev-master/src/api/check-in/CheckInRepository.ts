import { LoctionProfiles } from "./CheckIn";

export interface CheckInRepository {
  fetchProfilesByLocationId(locationId: string): Promise<LoctionProfiles | undefined>;
  create(loctionProfiles: LoctionProfiles): Promise<LoctionProfiles>;
  delete(profileId: string): Promise<boolean>;
}
