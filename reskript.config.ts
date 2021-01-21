import {configure} from '@reskript/settings';

export default configure(
    'webpack',
    {
        build: {
            appTitle: 'React Source View',
            uses: ['lodash'],
            style: {
                modules: resource => /demo\/.+\.less$/.test(resource),
            },
        },
        devServer: {
            port: 8623,
        },
    }
);
