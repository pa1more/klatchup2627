#!/usr/bin/env node
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

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
    ],
    profilePicture: 'https://i.pravatar.cc/150?img=1',
    currentLocation: { latitude: 18.5204, longitude: 73.8567 },
    profileId: 'user001',
    lastSeen: new Date().toISOString(),
    showPictures: true,
    friends: [],
    isOnline: true
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
    ],
    profilePicture: 'https://i.pravatar.cc/150?img=2',
    currentLocation: { latitude: 18.5204, longitude: 73.8567 },
    profileId: 'user002',
    lastSeen: new Date().toISOString(),
    showPictures: true,
    friends: [],
    isOnline: true
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
      { name: 'Culture', subInterest: 'Theater' }
    ],
    profilePicture: 'https://i.pravatar.cc/150?img=3',
    currentLocation: { latitude: 18.5204, longitude: 73.8567 },
    profileId: 'user003',
    lastSeen: new Date().toISOString(),
    showPictures: true,
    friends: [],
    isOnline: true
  },
  {
    name: 'Vikram Singh',
    mobile: '+918001001004',
    birthDate: '1996-11-30',
    gender: 'Male',
    city: 'Pune',
    bio: 'Tech enthusiast and startup founder',
    work: 'Founder, AI Solutions',
    education: 'MBA, ISB',
    lookingFor: 'Friends',
    interests: [
      { name: 'Technology', subInterest: 'AI/ML' },
      { name: 'Business', subInterest: 'Startups' }
    ],
    profilePicture: 'https://i.pravatar.cc/150?img=4',
    currentLocation: { latitude: 18.5204, longitude: 73.8567 },
    profileId: 'user004',
    lastSeen: new Date().toISOString(),
    showPictures: true,
    friends: [],
    isOnline: true
  },
  {
    name: 'Neha Verma',
    mobile: '+918001001005',
    birthDate: '1997-06-14',
    gender: 'Female',
    city: 'Pune',
    bio: 'Yoga instructor and wellness coach',
    work: 'Yoga Teacher',
    education: 'B.Sc Biology',
    lookingFor: 'Friends',
    interests: [
      { name: 'Wellness', subInterest: 'Yoga' },
      { name: 'Health', subInterest: 'Nutrition' }
    ],
    profilePicture: 'https://i.pravatar.cc/150?img=5',
    currentLocation: { latitude: 18.5204, longitude: 73.8567 },
    profileId: 'user005',
    lastSeen: new Date().toISOString(),
    showPictures: true,
    friends: [],
    isOnline: true
  },
  {
    name: 'Arjun Desai',
    mobile: '+918001001006',
    birthDate: '1993-09-05',
    gender: 'Male',
    city: 'Pune',
    bio: 'Music producer and DJ',
    work: 'Music Producer',
    education: 'Diploma in Sound Engineering',
    lookingFor: 'Friends',
    interests: [
      { name: 'Music', subInterest: 'Electronic' },
      { name: 'Entertainment', subInterest: 'Concerts' }
    ],
    profilePicture: 'https://i.pravatar.cc/150?img=6',
    currentLocation: { latitude: 18.5204, longitude: 73.8567 },
    profileId: 'user006',
    lastSeen: new Date().toISOString(),
    showPictures: true,
    friends: [],
    isOnline: true
  },
  {
    name: 'Divya Gupta',
    mobile: '+918001001007',
    birthDate: '1994-12-20',
    gender: 'Female',
    city: 'Pune',
    bio: 'Food blogger and chef',
    work: 'Content Creator',
    education: 'B.Com',
    lookingFor: 'Friends',
    interests: [
      { name: 'Cooking', subInterest: 'Baking' },
      { name: 'Food', subInterest: 'Indian Cuisine' }
    ],
    profilePicture: 'https://i.pravatar.cc/150?img=7',
    currentLocation: { latitude: 18.5204, longitude: 73.8567 },
    profileId: 'user007',
    lastSeen: new Date().toISOString(),
    showPictures: true,
    friends: [],
    isOnline: true
  },
  {
    name: 'Rohit Kumar',
    mobile: '+918001001008',
    birthDate: '1991-04-17',
    gender: 'Male',
    city: 'Pune',
    bio: 'Marathon runner and fitness enthusiast',
    work: 'Fitness Coach',
    education: 'B.Tech, Mechanical',
    lookingFor: 'Friends',
    interests: [
      { name: 'Running', subInterest: 'Marathon' },
      { name: 'Sports', subInterest: 'Cycling' }
    ],
    profilePicture: 'https://i.pravatar.cc/150?img=8',
    currentLocation: { latitude: 18.5204, longitude: 73.8567 },
    profileId: 'user008',
    lastSeen: new Date().toISOString(),
    showPictures: true,
    friends: [],
    isOnline: true
  },
  {
    name: 'Kavya Nair',
    mobile: '+918001001009',
    birthDate: '1999-01-28',
    gender: 'Female',
    city: 'Pune',
    bio: 'Travel blogger and adventure seeker',
    work: 'Travel Vlogger',
    education: 'BA, English Literature',
    lookingFor: 'Friends',
    interests: [
      { name: 'Travel', subInterest: 'Solo Travel' },
      { name: 'Adventure', subInterest: 'Backpacking' }
    ],
    profilePicture: 'https://i.pravatar.cc/150?img=9',
    currentLocation: { latitude: 18.5204, longitude: 73.8567 },
    profileId: 'user009',
    lastSeen: new Date().toISOString(),
    showPictures: true,
    friends: [],
    isOnline: true
  },
  {
    name: 'Sanjay Reddy',
    mobile: '+918001001010',
    birthDate: '1990-07-11',
    gender: 'Male',
    city: 'Pune',
    bio: 'Software architect and tech mentor',
    work: 'Senior Tech Lead',
    education: 'M.Tech, Computer Science',
    lookingFor: 'Friends',
    interests: [
      { name: 'Software', subInterest: 'Architecture' },
      { name: 'Mentoring', subInterest: 'Tech Education' }
    ],
    profilePicture: 'https://i.pravatar.cc/150?img=10',
    currentLocation: { latitude: 18.5204, longitude: 73.8567 },
    profileId: 'user010',
    lastSeen: new Date().toISOString(),
    showPictures: true,
    friends: [],
    isOnline: true
  }
];

async function seedUsers() {
  try {
    console.log('🚀 Starting to seed users via Firebase CLI...');
    
    for (let i = 0; i < dummyUsers.length; i++) {
      const user = dummyUsers[i];
      const docId = user.profileId;
      const userJson = JSON.stringify(user).replace(/'/g, "'\\''");
      
      const command = `firebase firestore:set profiles/${docId} '${userJson}' --project klatchup-pavan2`;
      
      try {
        await execPromise(command);
        console.log(`✅ Created user ${i+1}/10: ${user.name} (${user.mobile})`);
      } catch (error) {
        console.error(`❌ Error creating ${user.name}:`, error.message);
      }
    }
    
    console.log('🎉 Seed process complete!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

seedUsers();
