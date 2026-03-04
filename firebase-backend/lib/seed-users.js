"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const admin = __importStar(require("firebase-admin"));
const firestore_1 = require("firebase-admin/firestore");
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = (0, firestore_1.getFirestore)(admin.app());
const dummyUsers = [
    {
        name: 'Priya Singh',
        mobile: '+918001001001',
        birthDate: '1995-05-15',
        gender: 'Female',
        city: 'Pune',
        bio: 'Love coffee and good conversations!',
        work: 'Product Manager at Tech Startup',
        education: 'B.Tech, Computer Science',
        lookingFor: 'Friends',
        interests: [
            { name: 'Travel', subInterest: 'Hiking' },
            { name: 'Books', subInterest: 'Fiction' }
        ]
    },
    {
        name: 'Raj Patel',
        mobile: '+918001001002',
        birthDate: '1992-08-22',
        gender: 'Male',
        city: 'Pune',
        bio: 'Foodie and adventure seeker 🌍',
        work: 'Senior Developer',
        education: 'B.Tech, IT',
        lookingFor: 'Friends',
        interests: [
            { name: 'Fitness', subInterest: 'Gym' },
            { name: 'Sports', subInterest: 'Cricket' }
        ]
    },
    {
        name: 'Anjali Sharma',
        mobile: '+918001001003',
        birthDate: '1998-03-10',
        gender: 'Female',
        city: 'Pune',
        bio: 'Artist, photographer, coffee lover ☕',
        work: 'Graphic Designer',
        education: 'Diploma in Design',
        lookingFor: 'Friends',
        interests: [
            { name: 'Art', subInterest: 'Photography' },
            { name: 'Music', subInterest: 'Indie' }
        ]
    },
    {
        name: 'Vikram Desai',
        mobile: '+918001001004',
        birthDate: '1990-12-05',
        gender: 'Male',
        city: 'Pune',
        bio: 'Entrepreneur, love networking!',
        work: 'Business Analyst',
        education: 'MBA',
        lookingFor: 'Friends',
        interests: [
            { name: 'Business', subInterest: 'Startups' },
            { name: 'Tech', subInterest: 'AI' }
        ]
    },
    {
        name: 'Neha Gupta',
        mobile: '+918001001005',
        birthDate: '1996-07-18',
        gender: 'Female',
        city: 'Pune',
        bio: 'Yoga enthusiast and nature lover 🌿',
        work: 'HR Executive',
        education: 'B.A., Psychology',
        lookingFor: 'Friends',
        interests: [
            { name: 'Wellness', subInterest: 'Yoga' },
            { name: 'Nature', subInterest: 'Hiking' }
        ]
    },
    {
        name: 'Arjun Kumar',
        mobile: '+918001001006',
        birthDate: '1993-11-28',
        gender: 'Male',
        city: 'Pune',
        bio: 'Movie buff and trivia master 🎬',
        work: 'Marketing Manager',
        education: 'B.Com',
        lookingFor: 'Friends',
        interests: [
            { name: 'Movies', subInterest: 'Thriller' },
            { name: 'Games', subInterest: 'Board Games' }
        ]
    },
    {
        name: 'Pooja Reddy',
        mobile: '+918001001007',
        birthDate: '1997-02-14',
        gender: 'Female',
        city: 'Pune',
        bio: 'Food blogger and restaurant explorer 🍽️',
        work: 'Content Writer',
        education: 'B.A., English',
        lookingFor: 'Friends',
        interests: [
            { name: 'Food', subInterest: 'International' },
            { name: 'Travel', subInterest: 'Food Tours' }
        ]
    },
    {
        name: 'Rohit Singh',
        mobile: '+918001001008',
        birthDate: '1991-09-03',
        gender: 'Male',
        city: 'Pune',
        bio: 'Guitarist and music producer 🎸',
        work: 'Audio Engineer',
        education: 'Bachelor in Music',
        lookingFor: 'Friends',
        interests: [
            { name: 'Music', subInterest: 'Rock' },
            { name: 'Tech', subInterest: 'Sound Design' }
        ]
    },
    {
        name: 'Divya Nair',
        mobile: '+918001001009',
        birthDate: '1994-06-20',
        gender: 'Female',
        city: 'Pune',
        bio: 'Entrepreneur, fitness fanatic 💪',
        work: 'Founder - Fitness App',
        education: 'B.Tech, Biotech',
        lookingFor: 'Friends',
        interests: [
            { name: 'Fitness', subInterest: 'CrossFit' },
            { name: 'Business', subInterest: 'Health Tech' }
        ]
    },
    {
        name: 'Aman Verma',
        mobile: '+918001001010',
        birthDate: '1989-04-11',
        gender: 'Male',
        city: 'Pune',
        bio: 'Startup advisor, mentor, and investor 🚀',
        work: 'Business Consultant',
        education: 'MBA, Finance',
        lookingFor: 'Friends',
        interests: [
            { name: 'Business', subInterest: 'Mentoring' },
            { name: 'Finance', subInterest: 'Investing' }
        ]
    }
];
async function createDummyUsers() {
    try {
        console.log('🚀 Starting to create 10 dummy users...');
        // McDonald's Hijewadi, Pune coordinates
        const mcDonalds = {
            placeName: 'McDonald\'s - Hijewadi Happiness Street',
            lat: '18.5912',
            long: '73.8235'
        };
        for (let i = 0; i < dummyUsers.length; i++) {
            const user = dummyUsers[i];
            const userId = `dummy-user-${i + 1}`;
            const profileData = {
                name: user.name,
                mobile: user.mobile,
                birthDate: user.birthDate,
                gender: user.gender,
                city: user.city,
                bio: user.bio,
                work: user.work,
                education: user.education,
                lookingFor: user.lookingFor,
                interests: user.interests,
                profilePicture: `https://i.pravatar.cc/150?img=${i}`,
                showPictures: [],
                currentLocation: mcDonalds,
                friendRequest: { user_ids: [] },
                friends: { user_ids: [] },
                isActive: true,
                isDeleted: false,
                updatedAt: admin.firestore.Timestamp.now(),
                createdAt: admin.firestore.Timestamp.now()
            };
            await db.collection('profiles').doc(userId).set(profileData);
            console.log(`✅ Created: ${user.name} (${userId})`);
        }
        console.log('\n🎉 Successfully created 10 dummy users!');
        console.log('📍 Location: McDonald\'s - Hijewadi Happiness Street (Pune)');
        console.log('📱 Check the "People" section in the app to see them!');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error creating users:', error);
        process.exit(1);
    }
}
createDummyUsers();
//# sourceMappingURL=seed-users.js.map