import {pope} from 'pope';
import axios from 'axios';
import axiosRetry from 'axios-retry';

const DEFAULT_BASE_URL = 'https://api.cimpress.io';

// TODO

class CoamClient {
    constructor(options) {
        this.baseUrl = options.baseUrl || DEFAULT_BASE_URL;
        this.resource = encodeURIComponent(options.resource);
        this.timeout = options.timeout || 3000;
        this.retryAttempts = options.retryAttempts || 2;
        this.retryDelayInMs = options.retryDelayInMs || 1000;

        let understoodOptions = ['baseUrl', 'resource', 'timeout', 'retryAttempts', 'retryDelayInMs'];
        Object.keys(options).forEach((passedOption) => {
            if (understoodOptions.indexOf(passedOption) === -1) {
                // eslint-disable-next-line no-console
                console.error(`[CoamClient] Option '${passedOption}' is not understood and will be ignored.`);
            }
        });
    }

    __getUrl(resource) {
        return `${pope('/v1/resources/{{resource}}/settings', {resource: resource || this.resource})}`;
    }

    __getAxiosInstance(accessToken) {
        let instance = axios.create({
            baseURL: this.baseUrl,
            timeout: this.timeout,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (this.retryAttempts > 0) {
            axiosRetry(instance, {
                retries: this.retryAttempts,
                retryDelay: (retryCount) => {
                    return this.retryDelayInMs;
                },
            });
        }

        return instance;
    }
}

export default CoamClient;
