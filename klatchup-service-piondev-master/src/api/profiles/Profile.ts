export interface Profile {
   name: string;
   mobile: string;
   birthDate: string;
   gender: string;
   interests: Interests[]
   city: string;
   bio: string;
   profilePicture: string;
   showPictures: showPictures[];
   work: string;
   education: string;
   lookingFor: string;
   currentLocation: CurrentLocation;
   friendRequest: UserIdsRequest;
   friends: UserIdsAccepted;
   isActive: boolean;
   isDeleted: boolean;
   updatedAt: boolean;
}

export interface CurrentLocation {
   placeName: string;
   lat: string;
   long: string;
}

export interface Interests {
   name: string;
   subInterest: string

}

export interface NewProfile extends Omit<Profile, "profileId" | "createdAt"> {
   profileId: string;
   createdAt: Date;
}

export interface showPictures {
   priority: number
   path: string
}

interface UserIdsRequest {
   user_ids: string[];  // Array of user IDs to store
}

interface UserIdsAccepted {
   user_ids: string[];  // Array of user IDs to store
}
