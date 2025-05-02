import 'reflect-metadata'; // <- OBLIGATOIRE en premier
import path from "path";
import dotenv from 'dotenv';
import fastify from "fastify";
import { AppDataSource } from "./data-source";
// import { User } from "./entities/User";
import { userRoutes } from './routes/user.routes';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const app = fastify();


AppDataSource.initialize()
.then(async () => {
        // AppDataSource.synchronize(true);
        console.log("User service db connected");
        // await AppDataSource.synchronize();
        // await AppDataSource.dropDatabase();
        // await AppDataSource.synchronize();
        await app.register(userRoutes);

        app.listen({ port: 3001}, () => {
            console.log('User service running on http://localhost:3001');
        });
    })
    .catch((err) => {
        console.error('Error during db init:', err);
    });
