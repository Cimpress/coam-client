require('regenerator-runtime/runtime');
const CoamClient = require('./CoamClient');

const {getRoles,
    modifyUserRoles,
    removeUserRole,
    addUserRole,
    grantRoleToPrincipal,
    setAdminFlag,
    createGroup,
    removeGroup,
    findGroups,
    getGroupInfo,
    addGroupMember,
    removeGroupMember,
    group56,
    addResourceToGroup,
    removeResourceFromGroup,
    hasPermission,
    getUserPermissionsForResourceType,
    findPrincipals} = require('./coamHelpers');

export {
    CoamClient,

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

    addResourceToGroup,
    removeResourceFromGroup,

    hasPermission,
    getUserPermissionsForResourceType,

    findGroups,
    findPrincipals,
};
