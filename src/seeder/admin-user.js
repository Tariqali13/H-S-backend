const config = require('config');
const { Seeder } = require('mongo-seeding');
const MONGODB_URL = config.get('dataSource.databaseUrl');
const path = require('path');
const seederConfig = {
    database: MONGODB_URL,
    dropDatabase: false,
};
const seeder = new Seeder(seederConfig);
const collections = seeder.readCollectionsFromPath(path.resolve("./src/seeder/seeder-data"));

async function seedData() {
        try {
            return await seeder.import(collections);
        } catch (err) {
            console.log("err", err)
            return err;
        }
};

seedData();
