import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

// const client = new MongoClient("mongodb://localhost:27017/database");
const client = new MongoClient(process.env.MONGODB_URI);

const db = client.db("recipehouse"); // Replace with your database name

export const auth = betterAuth({


  database: mongodbAdapter(db, {
        client: client
    }),

     emailAndPassword: {    
        enabled: true
    },




    
    socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET  
        }
    },
    


    // session



    session: {

        cookieCache: {
            enabled: true,
            strategy :"jwt",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        }
    },





    // plag

     plugins: [
        jwt()
    ]



  
});