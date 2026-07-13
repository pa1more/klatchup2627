type UserIdsObject = {
  user_ids: string[];
};

export type SafeProfile = {
  profileId: string;
  name: string;
  mobile: string;
  birthDate: string;
  gender: string;
  interests: any[];
  city: string;
  bio: string;
  profilePicture: string;
  profilePic: string;
  showPictures: any[];
  work: string;
  education: string;
  lookingFor: string;
  currentLocation: {
    placeName: string;
    lat: string;
    long: string;
  };
  friendRequest: UserIdsObject | any;
  friends: UserIdsObject | any;
};

const EMPTY_PROFILE: SafeProfile = {
  profileId: '',
  name: '',
  mobile: '',
  birthDate: '',
  gender: '',
  interests: [],
  city: '',
  bio: '',
  profilePicture: '',
  profilePic: '',
  showPictures: [],
  work: '',
  education: '',
  lookingFor: '',
  currentLocation: { placeName: '', lat: '0', long: '0' },
  friendRequest: { user_ids: [] },
  friends: { user_ids: [] },
};

export const getSafeProfile = (mobileCheck: any): SafeProfile => {
  const rawProfile = mobileCheck?.profile;

  if (!rawProfile || typeof rawProfile !== 'object') {
    return { ...EMPTY_PROFILE };
  }

  const currentLocation =
    rawProfile.currentLocation && typeof rawProfile.currentLocation === 'object'
      ? {
          placeName: rawProfile.currentLocation.placeName || '',
          lat: String(rawProfile.currentLocation.lat || '0'),
          long: String(rawProfile.currentLocation.long || '0'),
        }
      : { ...EMPTY_PROFILE.currentLocation };

  return {
    ...EMPTY_PROFILE,
    ...rawProfile,
    profileId: typeof rawProfile.profileId === 'string' ? rawProfile.profileId : '',
    interests: Array.isArray(rawProfile.interests) ? rawProfile.interests : [],
    showPictures: Array.isArray(rawProfile.showPictures) ? rawProfile.showPictures : [],
    friendRequest: rawProfile.friendRequest || { user_ids: [] },
    friends: rawProfile.friends || { user_ids: [] },
    currentLocation,
  };
};

export const getSafeProfileId = (mobileCheck: any): string => {
  return getSafeProfile(mobileCheck).profileId;
};

export const hasSafeProfileId = (mobileCheck: any): boolean => {
  return getSafeProfileId(mobileCheck).length > 0;
};