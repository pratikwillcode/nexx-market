const conf = {
        appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
        appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
        appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
        appwriteCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
        stripePublishKey: String(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY),
        stripeSecretKey: String(import.meta.env.VITE_STRIPE_SECRET_KEY),
        appwriteOrdersCollectionId : String(import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID),
        appwriteProfileCollectionId : String(import.meta.env.VITE_APPWRITE_PROFILE_COLLECTION_ID),
        appwriteBucketId : String(import.meta.env.VITE_APPWRITE_BUCKET_ID)     
}

export default conf