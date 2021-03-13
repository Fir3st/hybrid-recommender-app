module.exports = {
    apps: [
        {
            name: 'API',
            instances: '1',
            exec_mode: 'cluster',
            script: 'npm',
            args: 'run server:start',
            env: {
                COMMON_VARIABLE: 'true',
                NODE_ENV: 'production'
            }
        },
        {
            name: 'Client',
            instances: '1',
            exec_mode: 'cluster',
            script: 'npm',
            args: 'run client:start',
            env: {
                COMMON_VARIABLE: 'true',
                NODE_ENV: 'production'
            }
        },
    ]
};
