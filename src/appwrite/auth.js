import conf from "../conf/config";
import {
    Client,
    Account,
    ID
} from "appwrite";

class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
    }

    async createAccount({
        email,
        password,
        name
    }) {
        try {
            const userAccount =  await this.account.create(ID.unique(), email, password, name);
            if(userAccount) {
                //call another method
                return await this.login({email, password})
            }else{
                return userAccount;
            }
        } catch (e) {
            throw e;
        }
    }

    async login({
        email,
        password
    }) {
        try {
            const session = await this.account.createEmailPasswordSession(email, password);
            return session;
         
        } catch (e) {
            throw e;
        }
    }


    async getCurrentuser(){
        try {
            return await this.account.get();
        } catch (e) {
            console.log("Get Current User Failed"+ e.message);
        }
        return null;
    }

    async logout(){
        try {
            return await this.account.deleteSessions();
        } catch (e) {
            throw e;
        }
    }

    async updateAccountName(
        name
    ) {
        try {
            const updatedName =  await this.account.updateName(name)
            return updatedName;
        } catch (e) {
            throw e;
        }
    }

    async updatePassword(
        newPassword,
        oldPassword
    ) {
        try {
            const updatedPassword =  await this.account.updatePassword(newPassword, oldPassword)
            return updatedPassword;
        } catch (e) {
            throw e;
        }
    }

    async createRecovery(email, redirectUrl) {
        try {
            return await this.account.createRecovery(email, redirectUrl);
        } catch (e) {
            throw e;
        }
    }

    async updateRecovery(userId, secret, password, confirmPassword) {
        try {
            return await this.account.updateRecovery(userId, secret, password, confirmPassword);
        } catch (e) {
            throw e;
        }
    }



}

const authService = new AuthService();

export default authService;
