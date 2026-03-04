import * as admin from 'firebase-admin';
declare const db: admin.firestore.Firestore;
declare const storage: import("firebase-admin/lib/storage/storage").Storage;
export { db, storage };
export declare const initializeCollections: () => Promise<void>;
//# sourceMappingURL=firebase.d.ts.map