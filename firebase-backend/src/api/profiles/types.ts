// Profile types matching your existing schema
export interface Profile {
  name: string;
  mobile: string;
  birthDate: string;
  gender: string;
  interests: Interest[];
  city: string;
  bio: string;
  profilePicture: string;
  showPictures: ShowPicture[];
  work: string;
  education: string;
  lookingFor: string;
  currentLocation: CurrentLocation;
  friendRequest: UserIds;
  friends: UserIds;
  isActive: boolean;
  isDeleted: boolean;
  updatedAt: Date;
}

export interface Interest {
  name: string;
  subInterest: string;
}

export interface ShowPicture {
  priority: number;
  path: string;
}

export interface CurrentLocation {
  placeName: string;
  lat: string;
  long: string;
}

export interface UserIds {
  user_ids: string[];
}

export interface NewProfile extends Profile {
  profileId: string;
  createdAt: Date;
}
