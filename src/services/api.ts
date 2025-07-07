import { combineSlices } from "@reduxjs/toolkit";

export async function fetchAuthToken() {

    const response = await fetch("https://dgwnbw5ly3.execute-api.us-east-1.amazonaws.com/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "anonymous" }),
    });

    const data = await response.json();
    console.log(data.body)
    if (!response.ok) throw new Error("Failed to get auth token");
    return data.body;
}

export async function fetchLocation(token: string, data: { longitude: number; latitude: number }) {
    console.log(data)
    const response = await fetch("https://dgwnbw5ly3.execute-api.us-east-1.amazonaws.com/location", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    const Ldata = await response.json();
    console.log(Ldata);
    if (!response.ok) throw new Error("Failed to fetch location");
    return Ldata;
}

export async function fetchCheckedInUsersAPI(id: string, token: string) {

    console.log(`Fetching Checked-in Users for ID: ${id}...`);
    console.log(token);

    const response = await fetch(`https://dgwnbw5ly3.execute-api.us-east-1.amazonaws.com/checkin/${id}`, {
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

    const response = await fetch("https://dgwnbw5ly3.execute-api.us-east-1.amazonaws.com/profile", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
    });
    const Pdata = await response.json();
    console.log("Insert profile");
    console.log(Pdata);
    if (!response.ok) throw new Error("Failed to fetch profile data");
    return Pdata;
}

export async function userLocationcheckin(token: string, data: any) {
    console.log("in apin jskdadjl")
    console.log(data)
    const response = await fetch("https://dgwnbw5ly3.execute-api.us-east-1.amazonaws.com/checkin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    const User_data = await response.json();
    console.log(User_data);
    if (!response.ok) throw new Error("Failed to fetch location");
    return User_data;
}

export async function fetchUserByMobileAPI(moblieno: string, token: string) {

    console.log(`Fetching Checked-in Users for ID: ${moblieno}...`);
    const response = await fetch(`https://dgwnbw5ly3.execute-api.us-east-1.amazonaws.com/profile/mobile/${moblieno}`, {
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

export async function fetchUserByIdAPI(profileId: string, token: string) {

    console.log(`Fetching Checked-in Users for ID: ${profileId}...`);
    const response = await fetch(`https://dgwnbw5ly3.execute-api.us-east-1.amazonaws.com/profile/${profileId}`, {
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
    const response = await fetch(`https://dgwnbw5ly3.execute-api.us-east-1.amazonaws.com/profile/${profileId}`, {
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
    const response = await fetch(`https://dgwnbw5ly3.execute-api.us-east-1.amazonaws.com/profile/place/${placeName}`, {
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
    const response = await fetch(`https://dgwnbw5ly3.execute-api.us-east-1.amazonaws.com/profile/friendRequest/${profileId}`, {
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

export async function fetchAcceptRequestAPI(profileId: string, token: string) {

    console.log(`Fetching Checked-in Users for ID: ${profileId}...`);
    const response = await fetch(`https://dgwnbw5ly3.execute-api.us-east-1.amazonaws.com/profile/friendAccepted/${profileId}`, {
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
