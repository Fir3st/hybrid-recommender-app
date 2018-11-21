module.exports = {
    apps: [
        {
            name: 'API',
            instances: "2",
            exec_mode: "cluster",
            script: "./server/src/index.ts",
            env: {
                COMMON_VARIABLE: 'true',
                NODE_ENV: 'production'
            }
        }
    ]
};
