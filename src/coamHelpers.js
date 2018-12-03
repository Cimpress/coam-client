import axios from 'axios';
import axiosRetry from 'axios-retry';

const defaultRequestData = (accessToken, additionalRequest) => {
    return Object.assign({}, {
        baseURL: `https://api.cimpress.io/auth/access-management`,
        timeout: 799,
        headers: {
            'Authorization': 'Bearer ' + accessToken,
        },
    }, additionalRequest);
};

const exec = (data) => {
    let instance = axios.create();

    axiosRetry(instance, {
        retries: 3,
        retryCondition: (error) => axiosRetry.isNetworkOrIdempotentRequestError(error) || (error && error.response && error.response.status === 403),
        retryDelay: (retryCount) => {
            return 200;
        },
    });

    return instance.request(data)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            // eslint-disable-next-line no-console
            console.error(err);
            throw err;
        });
};

const hasPermission = (accessToken, principal, resourceType, resourceIdentifier, permission) => {
    let data = defaultRequestData(accessToken, {
        url: `/v1/principals/${encodeURIComponent(principal)}/permissions/${encodeURIComponent(resourceType)}/${encodeURIComponent(resourceIdentifier)}/${encodeURIComponent(permission)}?skipCache=${Math.random()}`,
        method: 'GET',
    });

    return exec(data)
        .then(() => Promise.resolve(true))
        .catch(() => Promise.resolve(false));
};

const grantRoleToPrincipal = (accessToken, groupUrl, principal, roleName) => {
    return getGroupInfo(accessToken, groupUrl)
        .then((groupInfo) => {
            if (!groupInfo) {
                return Promise.reject('Failed to retrieve template COAM group.');
            }
            return addGroupMember(accessToken, groupInfo.id, principal, false)
                .then(() => patchUserRoles(accessToken, groupInfo.id, principal, {'add': [roleName]})
                );
        });
};


const getGroupInfo = (accessToken, groupUrl) => {
    let data = defaultRequestData(accessToken, {
        url: `${groupUrl}?canonicalize=true&${Math.random() * 1000000}`,
        method: 'GET',
    });

    return exec(data);
};


const setAdminFlag = (accessToken, groupId, principal, isAdmin) => {
    let data = defaultRequestData(accessToken, {
        url: `/v1/groups/${groupId}/members/${encodeURIComponent(principal)}`,
        method: 'PATCH',
        data: {
            'is_admin': isAdmin,
        },
    });

    return exec(data);
};

const removeUserRole = (accessToken, groupId, principal, role) => {
    let data = defaultRequestData(accessToken, {
        url: `/v1/groups/${groupId}/members/${encodeURIComponent(principal)}/roles`,
        method: 'PATCH',
        data: {
            'remove': [role],
        },
    });

    return exec(data);
};

const addUserRole = (accessToken, groupId, principal, role) => {
    let data = defaultRequestData(accessToken, {
        url: `/v1/groups/${groupId}/members/${encodeURIComponent(principal)}/roles`,
        method: 'PATCH',
        data: {
            'add': [role],
        },
    });

    return exec(data);
};

const group56 = (accessToken, principal) => {
    let data = defaultRequestData(accessToken, {
        url: `/v1/principals/${encodeURIComponent(principal)}/groups?${Math.random() * 1000000}`,
        method: 'GET',
    });

    return exec(data).then((data) => !!data.groups.find((a) => a.id === '56'));
};

const patchUserRoles = (accessToken, groupId, principal, rolesChanges) => {
    let data = defaultRequestData(accessToken, {
        url: `/v1/groups/${groupId}/members/${encodeURIComponent(principal)}/roles`,
        method: 'PATCH',
        data: rolesChanges,
    });

    return exec(data);
};

const addGroupMember = (accessToken, groupId, principal, isAdmin) => {
    let data = defaultRequestData(accessToken, {
        url: `/v1/groups/${groupId}/members`,
        method: 'PATCH',
        data: {
            'add': [{
                is_admin: !!isAdmin,
                principal: principal,
            }],
        },
    });

    return exec(data);
};

const deleteGroupMember = (accessToken, groupId, principal) => {
    let data = defaultRequestData(accessToken, {
        url: `/v1/groups/${groupId}/members`,
        method: 'PATCH',
        data: {
            'remove': [principal],
        },
    });

    return exec(data);
};

const getRoles = (accessToken) => {
    let data = defaultRequestData(accessToken, {
        url: `/v1/roles`,
        method: 'GET',
    });

    return exec(data);
};

const searchPrincipals = (accessToken, query) => {
    if (!query || query.length == 0) {
        return Promise.resolve([]);
    }

    let data = defaultRequestData(accessToken, {
        url: '/v1/search/canonicalPrincipals/bySubstring',
        method: 'GET',
        params: {
            q: query,
            canonicalize: true,
            m: Math.random() * 1000000,
        },
    });

    // [{user_id / name / email}]
    return exec(data).then((p) => p.canonical_principals);
};

const createGroup = (accessToken, name, description) => {
    let data = defaultRequestData(accessToken, {
        url: '/v1/groups',
        method: 'POST',
        data: {
            name: name,
            description: description,
        },
    });

    // [{user_id / name / email}]
    return exec(data).then((p) => p.canonical_principals);
};

const deleteGroup = (accessToken, groupId) => {
    let data = defaultRequestData(accessToken, {
        url: `/v1/groups/${groupId}`,
        method: 'DELETE',
    });

    return exec(data);
};

const findGroups = (accessToken, resourceType, resourceIdentifier) => {
    let data = defaultRequestData(accessToken, {
        url: `/v1/groups`,
        method: 'GET',
        params: {
            resource_type: resourceType,
            resource_identifier: resourceIdentifier,
            cache_bust: Math.random() * 1000000,
        },
    });

    return exec(data);
};

const removeResourceFromGroup = (accessToken, groupId, resourceType, resourceId) => {
    let data = defaultRequestData(accessToken, {
        url: `/v1/groups/${groupId}/resources`,
        method: 'PATCH',
        data: {
            add: [],
            remove: [{
                resource_type: resourceType,
                resource_identifier: resourceId,
            }],
        },
    });

    return exec(data);
};

const addResourceToGroup = (accessToken, groupId, resourceType, resourceId) => {
    let data = defaultRequestData(accessToken, {
        url: `/v1/groups/${groupId}/resources`,
        method: 'PATCH',
        data: {
            add: [{
                resource_type: resourceType,
                resource_identifier: resourceId,
            }],
            remove: [],
        },
    });

    return exec(data);
};

const getUserPermissionsForResourceType = (accessToken, principal, resourceType) => {
    let data = defaultRequestData(accessToken, {
        url: `/v1/principals/${encodeURIComponent(principal)}/permissions/${encodeURIComponent(resourceType)}`,
        method: 'GET',
    });

    return exec(data);
};

export {

    getRoles,
    patchUserRoles,
    removeUserRole,
    addUserRole,
    grantRoleToPrincipal,

    setAdminFlag,
    createGroup,
    deleteGroup,
    findGroups,
    getGroupInfo,
    addGroupMember,
    deleteGroupMember,
    group56,

    addResourceToGroup,
    removeResourceFromGroup,

    hasPermission,
    getUserPermissionsForResourceType,

    searchPrincipals,
};
