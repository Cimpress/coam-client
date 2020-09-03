let CoamClient = require('./CoamClient');

const buildGroupUrlFromId = (groupId) => {
    const client = new CoamClient();
    return client.buildGroupUrlFromId(groupId);
};

const hasPermission = (accessToken, principal, resourceType, resourceIdentifier, permission) => {
    const client = new CoamClient({
        accessToken: accessToken,
    });
    return client.hasPermission(principal, resourceType, resourceIdentifier, permission);
};

const grantRoleToPrincipal = (accessToken, groupUrl, principal, roleName) => {
    const client = new CoamClient({
        accessToken: accessToken,
    });
    return client.grantRoleToPrincipal(groupUrl, principal, roleName);
};


const getGroupInfo = (accessToken, groupUrl) => {
    const client = new CoamClient({
        accessToken: accessToken,
    });
    return client.getGroupInfo(groupUrl);
};


const setAdminFlag = (accessToken, groupId, principal, isAdmin) => {
    const client = new CoamClient({
        accessToken: accessToken,
    });
    return client.setAdminFlag(groupId, principal, isAdmin);
};

const removeUserRole = (accessToken, groupId, principal, role) => {
    const client = new CoamClient({
        accessToken: accessToken,
    });
    return client.removeUserRole(groupId, principal, role);
};

const addUserRole = (accessToken, groupId, principal, role) => {
    const client = new CoamClient({
        accessToken: accessToken,
    });
    return client.addUserRole(groupId, principal, role);
};

const group56 = (accessToken, principal) => {
    const client = new CoamClient({
        accessToken: accessToken,
    });
    return client.group56(principal);
};

const modifyUserRoles = (accessToken, groupId, principal, rolesChanges) => {
    const client = new CoamClient({
        accessToken: accessToken,
    });
    return client.modifyUserRoles(groupId, principal, rolesChanges);
};

const addGroupMember = (accessToken, groupId, principal, isAdmin) => {
    const client = new CoamClient({
        accessToken: accessToken,
    });
    return client.addGroupMember(groupId, principal, isAdmin);
};

const removeGroupMember = (accessToken, groupId, principal) => {
    const client = new CoamClient({
        accessToken: accessToken,
    });
    return client.removeGroupMember(groupId, principal);
};

const getRoles = (accessToken) => {
    const client = new CoamClient({
        accessToken: accessToken,
    });
    return client.getRoles();
};

const findPrincipals = (accessToken, query) => {
    const client = new CoamClient({
        accessToken: accessToken,
    });
    return client.findPrincipals(query);
};

const getPrincipal = (accessToken, principal) => {
    const client = new CoamClient({
        accessToken: accessToken,
    });
    return client.getPrincipal(principal);
};

const createGroup = (accessToken, name, description) => {
    const client = new CoamClient({
        accessToken: accessToken,
    });
    return client.createGroup(name, description);
};

const removeGroup = (accessToken, groupId) => {
    const client = new CoamClient({
        accessToken: accessToken,
    });
    return client.removeGroup(groupId);
};

const findGroups = (accessToken, resourceType, resourceIdentifier) => {
    const client = new CoamClient({
        accessToken: accessToken,
    });
    return client.findGroups(resourceType, resourceIdentifier);
};

const removeResourceFromGroup = (accessToken, groupId, resourceType, resourceId) => {
    const client = new CoamClient({
        accessToken: accessToken,
    });
    return client.removeResourceFromGroup(groupId, resourceType, resourceId);
};

const addResourceToGroup = (accessToken, groupId, resourceType, resourceId) => {
    const client = new CoamClient({
        accessToken: accessToken,
    });
    return client.addResourceToGroup(groupId, resourceType, resourceId);
};

const getUserPermissionsForResourceType = (accessToken, principal, resourceType, include = true, permissionFilters = null) => {
    const client = new CoamClient({
        accessToken: accessToken,
    });
    return client.getUserPermissionsForResourceType(principal, resourceType, include, permissionFilters);
};

const getUsersWithPermission = (accessToken, resourceType, permissionFilters) => {
    const client = new CoamClient({
        accessToken: accessToken,
    });
    return client.getUsersWithPermission(resourceType, permissionFilters);
};

const getUsersWithResource = (accessToken, resourceType, resourceIdentifier, permission) => {
    const client = new CoamClient({
        accessToken: accessToken,
    });
    return client.getUsersWithResource(resourceType, resourceIdentifier, permission);
};

const createGroupWithUser = (accessToken, principalToCreateGroup, principalToAddToGroup, groupName, groupDescription, rolesToAdd, resourcesToAdd) => {
    const client = new CoamClient({
        accessToken: accessToken,
    });
    return client.createGroupWithUser(principalToCreateGroup, principalToAddToGroup, groupName, groupDescription, rolesToAdd, resourcesToAdd);
};

module.exports = {
    getRoles,

    grantRoleToPrincipal,
    addUserRole,
    removeUserRole,
    modifyUserRoles,

    setAdminFlag,

    createGroup,
    removeGroup,
    getGroupInfo,
    addGroupMember,
    removeGroupMember,

    group56,
    buildGroupUrlFromId,

    addResourceToGroup,
    removeResourceFromGroup,

    hasPermission,
    getUserPermissionsForResourceType,

    findGroups,
    findPrincipals,
    getPrincipal,

    getUsersWithPermission,
    getUsersWithResource,

    createGroupWithUser,
};
