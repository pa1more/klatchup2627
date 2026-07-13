import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// Try to load service account from common locations
function getServiceAccount() {
  const possiblePaths = [
    path.join(process.cwd(), 'service-account.json'),
    path.join(process.cwd(), '.env.service-account.json'),
    path.join(os.homedir(), '.firebase', 'service-account.json'),
  ];

  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      console.log(`📁 Found service account at: ${filePath}`);
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  }
  
  return null;
}

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID || 'your-firebase-project-id';
  const serviceAccount = getServiceAccount();

  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId
    });
    console.log('✅ Using service account credentials');
  } else {
    // Fallback: use default credentials (Firebase CLI login)
    admin.initializeApp({
      projectId
    });
    console.log('⚠️  Using Firebase CLI authentication (make sure you\'re logged in with: firebase login)');
  }
}

// Use default Firestore database
// The SDK will automatically connect to the default database when projectId is set
const firestoreDatabaseId = process.env.FIRESTORE_DATABASE_ID || 'klatchupdb';
const db = getFirestore(admin.app(), firestoreDatabaseId);

console.log(`📚 Using Firestore database: ${firestoreDatabaseId}`);

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
    
    // Test connection first
    try {
      console.log('🔌 Testing Firestore connection...');
      const testDoc = await db.collection('_test').doc('connection').get();
      console.log('✅ Firestore connection OK');
      // Clean up test
      await db.collection('_test').doc('connection').delete();
    } catch (connError: any) {
      console.warn(`⚠️  Firestore test write failed (this might be expected)`, connError.message);
    }
    
    // McDonald's Hijewadi, Pune coordinates
    const mcDonalds = {
      placeName: 'McDonald\'s - Hijewadi Happiness Street',
      lat: '18.5912',
      long: '73.8235'
    };

    for (let i = 0; i < dummyUsers.length; i++) {
      const user = dummyUsers[i];
      const userId = `dummy-user-${i + 1}`;
      
      const profileData: any = {
        profileId: userId,  // Explicitly include profileId
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
        showPictures: [],  // Empty array as per schema
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
  } catch (error) {
    console.error('❌ Error creating users:', error);
    process.exit(1);
  }
}

createDummyUsers();
