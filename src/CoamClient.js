const axios = require('axios');
const axiosRetry = require('axios-retry');
const {pope} = require('pope');

const DEFAULT_BASE_URL = 'https://api.cimpress.io';

class CoamClient {
    constructor(options) {
        let opts = options || {};
        this.baseUrl = opts.baseUrl || DEFAULT_BASE_URL;
        this.timeout = Number.isInteger(opts.timeout) ? opts.timeout : 8000;
        this.accessToken = opts.accessToken || undefined;
        this.retryAttempts = Number.isInteger(opts.retryAttempts) ? opts.retryAttempts : 2;
        this.retryDelayInMs = Number.isInteger(opts.retryDelayInMs) ? opts.retryDelayInMs : 200;
        this.retryOnForbidden = 'retryOnForbidden' in opts ? opts.retryOnForbidden : true;
        this.debugFunction = 'debugFunction' in opts ? opts.debugFunction : undefined;
        // eslint-disable-next-line
        this.errorFunction = 'errorFunction' in opts ? opts.errorFunction : console.error;
        this.skipCache = 'skipCache' in opts ? opts.skipCache : false;

        this.logPrefix = '[CoamClient]';

        let validOptions = ['baseUrl', 'accessToken', 'timeout',
            'retryAttempts', 'retryDelayInMs', 'retryOnForbidden',
            'debugFunction', 'errorFunction', 'skipCache'];

        Object.keys(opts).forEach((passedOption) => {
            if (validOptions.indexOf(passedOption) === -1) {
                // eslint-disable-next-line no-console
                this.__logError(`${this.logPrefix} Option '${passedOption}' is not understood and will be ignored.`);
            }
        });

        this.instance = axios.create({
            baseURL: this.baseUrl,
            timeout: this.timeout,
        });
        this.instance.interceptors.response.use((response) => response, (error) => {
            let newError = error && error.response && {
                data: error.response.data,
                status: error.response.status,
                headers: error.response.headers,
            } || error.message && {message: error.message, code: error.code, stack: error.stack} || error;
            throw newError;
        });

        if (this.retryAttempts > 0) {
            axiosRetry(this.instance, {
                retries: this.retryAttempts,
                retryCondition: (error) => {
                    if ( axiosRetry.isNetworkOrIdempotentRequestError(error)) {
                        return true;
                    }

                    if (this.retryOnForbidden && error && error.response && error.response.status === 403) {
                        return true;
                    }
                    // do not retry
                    return false;
                },
                retryDelay: () => {
                    return this.retryDelayInMs;
                },
                shouldResetTimeout: true,
            });
        }
    }

    __exec(data) {
        if (this.skipCache && data.method === 'GET') {
            data.params = Object.assign(data.params || {}, {skipCache: Math.random()});
        }
        return this.instance
            .request(data)
            .then((response) => {
                return response.data;
            })
            .catch((err) => {
                this.__logError(err);
                throw err;
            });
    }

    __config(data) {
        return Object.assign({}, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
            },
        }, data);
    }

    __buildUrl(urlPattern, dataToEncode) {
        let encoded = {};
        Object.keys(dataToEncode).forEach( (k) => encoded[k] = encodeURIComponent(dataToEncode[k]));
        return pope(urlPattern, encoded);
    }

    __logDebug(...args) {
        if (this.debugFunction) {
            this.debugFunction.apply(null, args);
        }
    }

    __logError(...args) {
        if (this.errorFunction) {
            this.errorFunction.apply(null, args);
        }
    }

    buildGroupUrlFromId(groupId) {
        return `${this.baseUrl}/auth/access-management/v1/groups/${groupId}`;
    }

    hasPermission(principal, resourceType, resourceIdentifier, permission) {
        let url = this.__buildUrl(
            `/auth/access-management/v1/principals/{{principal}}/permissions/{{resourceType}}/{{resourceIdentifier}}/{{permission}}`, {
                principal,
                resourceType,
                resourceIdentifier,
                permission,
            });

        let data = this.__config({
            url: url,
            method: 'GET',
        });

        return this.__exec(data)
            .then(() => Promise.resolve(true))
            .catch((e) => {
                // COAM returns a 404 if the principal does not have access to a resource
                if (e.status === 404) {
                    return false;
                }

                // for all other errors, we want to throw an exception so that clients
                // can retry instead of assuming the user does not have access
                throw e;
            });
    }

    grantRoleToPrincipal(groupUrl, principal, roleName) {
        return this.getGroupInfo(groupUrl)
            .then((groupInfo) => {
                if (!groupInfo) {
                    return Promise.reject('Failed to retrieve template COAM group.');
                }
                return this.addGroupMember(groupInfo.id, principal, false)
                    .then(() => this.modifyUserRoles(groupInfo.id, principal, {'add': [roleName]})
                    );
            });
    }

    getGroupInfo(groupUrl) {
        let data = this.__config({
            url: groupUrl,
            method: 'GET',
            params: {
                canonicalize: 'true',
            },
        });

        return this.__exec(data);
    }

    setAdminFlag(groupId, principal, isAdmin) {
        let url = this.__buildUrl(`/auth/access-management/v1/groups/{{groupId}}/members/{{principal}}`, {
            groupId,
            principal,
        });

        let data = this.__config({
            url: url,
            method: 'PATCH',
            data: {
                'is_admin': isAdmin,
            },
        });

        return this.__exec(data);
    }

    removeUserRole(groupId, principal, role) {
        let url = this.__buildUrl(`/auth/access-management/v1/groups/{{groupId}}/members/{{principal}}/roles`, {
            groupId,
            principal,
        });

        let data = this.__config({
            url: url,
            method: 'PATCH',
            data: {
                'remove': [role],
            },
        });

        return this.__exec(data);
    }

    addUserRole(groupId, principal, role) {
        let url = this.__buildUrl(`/auth/access-management/v1/groups/{{groupId}}/members/{{principal}}/roles`, {
            groupId,
            principal,
        });

        let data = this.__config({
            url: url,
            method: 'PATCH',
            data: {
                'add': [role],
            },
        });

        return this.__exec(data);
    }

    group56(principal) {
        let url = this.__buildUrl(`/auth/access-management/v1/principals/{{principal}}/groups`, {
            principal,
        });

        let data = this.__config({
            url: url,
            method: 'GET',
        });

        return this.__exec(data).then((data) => !!data.groups.find((a) => a.id === '56'));
    }

    modifyUserRoles(groupId, principal, rolesChanges) {
        let url = this.__buildUrl(`/auth/access-management/v1/groups/{{groupId}}/members/{{principal}}/roles`, {
            groupId,
            principal,
        });

        let data = this.__config({
            url: url,
            method: 'PATCH',
            data: rolesChanges,
        });

        return this.__exec(data);
    }

    addGroupMember(groupId, principal, isAdmin) {
        let url = this.__buildUrl(`/auth/access-management/v1/groups/{{groupId}}/members`, {
            groupId,
            principal,
        });
        let data = this.__config({
            url: url,
            method: 'PATCH',
            data: {
                'add': [{
                    is_admin: !!isAdmin,
                    principal: principal,
                }],
            },
            params: {
                canonicalize: true,
            },
        });

        return this.__exec(data);
    }

    removeGroupMember(groupId, principal) {
        let url = this.__buildUrl(`/auth/access-management/v1/groups/{{groupId}}/members`, {
            groupId,
        });
        let data = this.__config({
            url: url,
            method: 'PATCH',
            data: {
                'remove': [principal],
            },
        });

        return this.__exec(data);
    }

    getRoles() {
        let data = this.__config({
            url: `/auth/access-management/v1/roles`,
            method: 'GET',
        });

        return this.__exec(data);
    }

    findPrincipals(query) {
        if (!query || query.length === 0) {
            return Promise.resolve([]);
        }

        let data = this.__config({
            url: '/auth/access-management/v1/search/canonicalPrincipals/bySubstring',
            method: 'GET',
            params: {
                q: query,
                canonicalize: true,
            },
        });

        // [{user_id / name / email}]
        return this.__exec(data).then((p) => p.canonical_principals);
    }

    getPrincipal(principal) {
        let url = this.__buildUrl(`/auth/access-management/v1/principals/{{principal}}`, {
            principal,
        });
        let data = this.__config({
            url,
            method: 'GET',
        });
        return this.__exec(data);
    }

    createGroup(name, description) {
        let data = this.__config({
            url: '/auth/access-management/v1/groups',
            method: 'POST',
            data: {
                name: name,
                description: description,
            },
        });

        // [{user_id / name / email}]
        return this.__exec(data);
    }

    removeGroup(groupId) {
        let url = this.__buildUrl(`/auth/access-management/v1/groups/{{groupId}}`, {
            groupId,
        });

        let data = this.__config({
            url: url,
            method: 'DELETE',
        });

        return this.__exec(data);
    }

    findGroups(resourceType, resourceIdentifier) {
        let data = this.__config({
            url: `/auth/access-management/v1/groups`,
            method: 'GET',
            params: {
                resource_type: resourceType,
                resource_identifier: resourceIdentifier,
            },
        });

        return this.__exec(data);
    }

    removeResourceFromGroup(groupId, resourceType, resourceId) {
        let url = this.__buildUrl(`/auth/access-management/v1/groups/{{groupId}}/resources`, {
            groupId,
        });

        let data = this.__config({
            url: url,
            method: 'PATCH',
            data: {
                add: [],
                remove: [{
                    resource_type: resourceType,
                    resource_identifier: resourceId,
                }],
            },
        });

        return this.__exec(data);
    }

    addResourceToGroup(groupId, resourceType, resourceId) {
        let url = this.__buildUrl(`/auth/access-management/v1/groups/{{groupId}}/resources`, {
            groupId,
        });

        let data = this.__config({
            url: url,
            method: 'PATCH',
            data: {
                add: [{
                    resource_type: resourceType,
                    resource_identifier: resourceId,
                }],
                remove: [],
            },
        });

        return this.__exec(data);
    }

    getUserPermissionsForResourceType(principal, resourceType, include = true, permissionFilters = null) {
        let urlString = `/auth/access-management/v1/principals/{{principal}}/permissions/{{resourceType}}?include=${include}`.concat(permissionFilters ? `&permissionFilter=${permissionFilters.join(',')}`:'');
        let url = this.__buildUrl(urlString, {
            principal,
            resourceType,
        });

        let data = this.__config({
            url: url,
            method: 'GET',
        });

        return this.__exec(data);
    }

    getUserPermissionsForResourceTypes(principal, resourceTypes, include = true, permissionFilters = null) {
        let urlString = `/auth/access-management/v1/principals/{{principal}}/permissions?resourceTypes=${resourceTypes.join(',')}&include=${include}`.concat(permissionFilters ? `&permissionFilter=${permissionFilters.join(',')}`:'');
        let url = this.__buildUrl(urlString, {
            principal,
        });

        let data = this.__config({
            url: url,
            method: 'GET',
        });

        return this.__exec(data);
    }

    getUsersWithPermission(resourceType, resourceIdentifier, permission) {
        let url = this.__buildUrl(`/auth/access-management/v1/search/canonicalPrincipals/byPermission?resource_type={{resourceType}}${resourceIdentifier ? '&resource_identifier={{resourceIdentifier}}' : ''}&permission={{permission}}`, {
            resourceType,
            resourceIdentifier,
            permission,
        });

        let data = this.__config({
            url: url,
            method: 'GET',
        });

        // [{user_id / name / email}]
        return this.__exec(data).then((p) => p.canonical_principals);
    }


    getUsersWithResource(resourceType, permissionFilters) {
        let url = this.__buildUrl(`/auth/access-management/v1/search/canonicalPrincipals/byResource?resource_type={{resourceType}}${permissionFilters && permissionFilters.length > 0 ? '&permissionFilter={{commaSeparatedPermissionFilter}}' : ''}`, {
            resourceType,
            commaSeparatedPermissionFilter: permissionFilters && permissionFilters.length > 0 && permissionFilters.join(','),
        });

        let data = this.__config({
            url: url,
            method: 'GET',
        });

        // [{canonical_principal / resource_type / is_client / permissions}]
        return this.__exec(data);
    }

    async createGroupWithUser(principalToCreateGroup, principalToAddToGroup, groupName, groupDescription, rolesToAdd, resourcesToAdd) {
        let res = await this.createGroup(groupName, groupDescription);
        let groupId = res.id;

        await this.addGroupMember(groupId, principalToAddToGroup);
        await this.setAdminFlag(groupId, principalToAddToGroup, true);
        for (let i = 0; i < rolesToAdd.length; i++) {
            await this.addUserRole(groupId, principalToAddToGroup, rolesToAdd[i]);
        }
        for (let i = 0; i < resourcesToAdd.length; i++) {
            let resource = resourcesToAdd[i];
            await this.addResourceToGroup(groupId, resource.resourceType, resource.resourceId);
        }
        try {
            await this.removeGroupMember(groupId, principalToCreateGroup);
        } catch (err) {
            //  Removing the creator of a COAM group causes a 404, known issue
            if (err.response.status !== 404) {
                throw err;
            }
        }
        return groupId;
    }
}

module.exports = CoamClient;
