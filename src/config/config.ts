import dotenv from 'dotenv';

dotenv.config();

export const config = {
    mongo: {
        url: `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.slhir.mongodb.net/passport-jwt`,
    },
    jwt: {
        accessTokenSecret: process.env.ACCESS_TOKEN_SECRET!,
        refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET!,
    },
};
