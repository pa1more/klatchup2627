import { combineSlices } from "@reduxjs/toolkit";
import auth from '@react-native-firebase/auth';
import { API_PROVIDER, BASE_URL, FALLBACK_URL, logConfig } from './apiConfig';

// Log the current API configuration on app start
logConfig();

// Get current auth token from Firebase with refresh
export async function getFirebaseToken(forceRefresh: boolean = false): Promise<string> {
    try {
        const user = auth().currentUser;
        if (!user) {
            throw new Error('No user logged in');
        }
        // Force refresh to ensure token is not expired
        const token = await user.getIdToken(forceRefresh);
        console.log("Firebase token obtained:", token ? "success" : "failed");
        return token;
    } catch (error) {
        console.error('Error getting Firebase token:', error);
        // Try to refresh user to get new token
        try {
            await auth().currentUser?.reload();
            const refreshedToken = await auth().currentUser?.getIdToken(true);
            if (refreshedToken) {
                console.log("Token refreshed successfully after error");
                return refreshedToken;
            }
        } catch (refreshError) {
            console.error("Failed to refresh token:", refreshError);
        }
        throw error;
    }
}

// Fetch auth token with proper error handling
export async function fetchAuthToken() {
    try {
        console.log("Fetching Firebase auth token...");
        const token = await getFirebaseToken(true); // Force refresh
        console.log("Auth token obtained from Firebase successfully");
        return token;
    } catch (error) {
        console.error("fetchAuthToken error:", error);
        // Don't fall back to dev token - instead ensure user is logged in
        throw new Error('Failed to obtain valid Firebase token. Please verify you are logged in.');
    }
}

export async function fetchLocation(token: string, data: { longitude: number; latitude: number; radiusMeters?: number; placeTypes?: string[] }) {
    console.log('Fetching locations with params:', data)
    const response = await fetch(`${BASE_URL}/location`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    const Ldata = await response.json();
    console.log('Location response:', Ldata);
    if (!response.ok) throw new Error("Failed to fetch location");
    return Ldata;
}

export async function fetchCheckedInUsersAPI(id: string, token: string) {

    console.log(`Fetching Checked-in Users for ID: ${id}...`);
    console.log(token);

    const response = await fetch(`${BASE_URL}/checkin/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    console.log(await response.json());
    const data = await response.json();
    return data;
}

export async function insertProfile(token: string, profileData: any) {
    try {
        const url = `${BASE_URL}/profile`;
        console.log("\n========== PROFILE CREATION REQUEST ==========");
        console.log("Endpoint:", url);
        console.log("Auth token valid:", !!token);
        console.log("Token (first 50 chars):", token ? token.substring(0, 50) + "..." : "NO TOKEN");
        console.log("Profile data fields:", Object.keys(profileData));
        console.log("Profile name:", profileData.name);
        console.log("Profile mobile:", profileData.mobile);
        
        // The profileData coming in is already the full profile object
        // Firebase expects it wrapped in { profile: ... }
        const payload = { profile: profileData };
        const requestBody = JSON.stringify(payload);
        console.log("Request body size:", requestBody.length, "bytes");
        console.log("Ready to send request...");
        
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: requestBody,
        });
        
        console.log("Response status:", response.status, response.statusText);
        const responseText = await response.text();
        console.log("Raw response:", responseText.substring(0, 200));
        
        let Pdata;
        try {
            Pdata = JSON.parse(responseText);
        } catch (e) {
            Pdata = { rawResponse: responseText };
        }
        
        console.log("Parsed response:", Pdata);
        console.log("Response OK:", response.ok);
        console.log("========== END PROFILE CREATION REQUEST ==========");
        
        if (!response.ok) {
            console.error("❌ Profile insertion failed:");
            console.error("   Status:", response.status);
            console.error("   Message:", Pdata?.message);
            console.error("   Type:", Pdata?.type);
            console.error("   Error:", Pdata?.error);
            
            const errorMsg = Pdata?.message || Pdata?.error || `HTTP ${response.status}: ${response.statusText}`;
            throw new Error(errorMsg);
        }
        
        console.log("✅ Profile created successfully");
        return Pdata;
    } catch (error: any) {
        console.error("❌ Error in insertProfile:", error);
        throw new Error(error?.message || "Failed to insert profile");
    }
}

export async function userLocationcheckin(token: string, data: any) {
    console.log("Checking in user at location")
    console.log(data)
    const response = await fetch(`${BASE_URL}/checkin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    const User_data = await response.json();
    console.log(User_data);
    if (!response.ok) throw new Error("Failed to check in");
    return User_data;
}

export async function fetchUserByMobileAPI(moblieno: string, token: string) {
    try {
        console.log(`Fetching user by mobile: ${moblieno}...`);
        const response = await fetch(`${BASE_URL}/profile/mobile/${moblieno}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        
        const data = await response.json();
        console.log("Fetch user by mobile response:", data, "Status:", response.status);
        
        // If it's a 404 or "Not Found", treat as new user
        if (!response.ok || data.message === 'Not Found') {
            console.log("User not found - new user, returning PROFILE_NOT_FOUND");
            return { type: "PROFILE_NOT_FOUND", profile: null, message: "Not Found" };
        }
        
        // Return the response
        return data;
    } catch (error) {
        console.error("Error in fetchUserByMobileAPI:", error);
        // For development, return a PROFILE_NOT_FOUND response so the user can create a profile
        return { type: "PROFILE_NOT_FOUND", profile: null, message: "Not Found" };
    }
}

export async function fetchUserByIdAPI(profileId: string, token: string) {

    console.log(`Fetching Checked-in Users for ID: ${profileId}...`);
    const response = await fetch(`${BASE_URL}/profile/${profileId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    //console.log(await response.json());
    const data = await response.json();
    return data;
}

export async function updateUserProfile(token: string, profile: any, profileId: string) {

    console.log('in update apio')
    const extracted = {
        "profile": profile.profile
    };
    const response = await fetch(`${BASE_URL}/profile/${profileId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(extracted),
    });
    const data = await response.json();
    console.log(data);
    return data;
}

export async function fetchUserByLocationNameAPI(placeName: string, token: string) {

    console.log(`Fetching Checked-in Users for ID: ${placeName}...`);
    const response = await fetch(`${BASE_URL}/profile/place/${placeName}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    //console.log(await response.json());
    const data = await response.json();
    console.log(data)
    return data;
}

export async function fetchFriendRequestAPI(profileId: string, token: string) {

    console.log(`Fetching Checked-in Users for ID: ${profileId}...`);
    const response = await fetch(`${BASE_URL}/profile/friends/${profileId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch friend requests");
    }
    return data;
}

export async function fetchAcceptRequestAPI(profileId: string, token: string) {

    console.log(`Fetching Checked-in Users for ID: ${profileId}...`);
    const response = await fetch(`${BASE_URL}/profile/friends/${profileId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch accepted friends");
    }
    return data;
}

export async function fetchNearbyUsersAPI(token: string, data: { latitude: number; longitude: number; radiusMeters: number }) {
    console.log('Fetching nearby users with params:', data);
    const response = await fetch(`${BASE_URL}/profile/nearby`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    const responseData = await response.json();
    console.log('Nearby users response:', responseData);
    if (!response.ok) throw new Error("Failed to fetch nearby users");
    return responseData;
}
