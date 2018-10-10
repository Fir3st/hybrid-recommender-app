const config = require('config');

module.exports = {
    "type": config.get('dbConfig.dialect') || "mysql",
    "host": config.get('dbConfig.host') || "localhost",
    "port": config.get('dbConfig.port') || 3306,
    "username": config.get('dbConfig.user') || "root",
    "password": config.get('dbConfig.password') || "",
    "database": config.get('dbConfig.name') || "recommender",
    "synchronize": config.get('dbConfig.synchronize'),
    "entities": ["server/src/entities/*.ts"],
    "migrationsTableName": "custom_migration_table",
    "migrations": ["server/src/migrations/*.ts"],
    "cli": {
        "entitiesDir": "server/src/entities",
        "migrationsDir": "server/src/migrations"
    }
};
