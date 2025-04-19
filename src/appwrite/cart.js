import conf from "../conf/config";
import {
    useId
} from "react";
import {
    Client,
    ID,
    Databases,
    Storage,
    Query
} from 'appwrite';

export class Service {
    client = new Client();
    databases;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async addEntryToCart(userId, cartProducts) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                userId, {
                    cartProducts
                }
            )
        } catch (err) {
            console.error(err);
        }
    }

    async updateCart(userId, cartProducts) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                userId, {
                    cartProducts
                }
            )
        } catch (err) {
            console.error(err);
        }
    }

    async getCart(userId) {
        try {
            const cartItems = await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                userId
            );
            return cartItems
        } catch (err) {
            console.error(err);
            return ""
        }
    }

    async deleteCart(userId) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                userId
            )
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    async createOrder(userId, orderDetails, orderDate) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteOrdersCollectionId,
                ID.unique(), {
                    userId,
                    orderDetails,
                    orderDate
                }
            )
        } catch (err) {
            console.error(err);
        }
    }

    async getUserOrders(userId) {
        try {
            const orders = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteOrdersCollectionId
            )
            orders.documents = orders.documents.filter(order => order.userId === userId)
            return orders
        } catch (err) {
            console.error(err);
            return ""
        }
    }

    async getProfile(userId) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteProfileCollectionId,
                userId
            )
        } catch (err) {
            console.error(err);
            return ""
        }
    }

    async createProfile(userId, profile) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteProfileCollectionId,
                userId,
                profile
            )
        } catch (err) {
            console.error(err);
        }
    }

    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            );
        } catch (e) {
            console.log("Upload File Failed" + e.message);
            return false;
        }
    }

    async updateProfile(userId, {
        profilePicture,
        name,
        email,
        phoneNo,
        address
    }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteProfileCollectionId,
                userId, {
                    profilePicture,
                    name,
                    email,
                    phoneNo,
                    address
                }
            );
        } catch (e) {
            console.log("Update Profile Failed" + e.message);
        }
    }

    getFilePreviewUrl(fileId) {
        return this.bucket.getFilePreview(conf.appwriteBucketId, fileId);
    }
}

const service = new Service();
export default service;