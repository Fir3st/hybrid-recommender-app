module.exports = {
    apps: [
        {
            name: 'API',
            instances: "2",
            exec_mode: "cluster",
            script: "yarn",
            args: "server:start",
            env: {
                COMMON_VARIABLE: 'true',
                NODE_ENV: 'production'
            }
        },
        {
            name: 'Client',
            instances: "2",
            exec_mode: "cluster",
            script: "yarn",
            args: "client:start",
            env: {
                COMMON_VARIABLE: 'true',
                NODE_ENV: 'production'
            }
        }
    ]
};
