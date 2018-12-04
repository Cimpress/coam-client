const indexExports = require('../src/index');
const expect = require('chai').expect;

describe('Index', function() {
    it('exports are as expected', function() {
        expect(Object.keys(indexExports)).to.deep.equal(['CoamClient',
            'getRoles',
            'grantRoleToPrincipal',
            'addUserRole',
            'removeUserRole',
            'modifyUserRoles',
            'setAdminFlag',
            'createGroup',
            'removeGroup',
            'getGroupInfo',
            'addGroupMember',
            'removeGroupMember',
            'group56',
            'addResourceToGroup',
            'removeResourceFromGroup',
            'hasPermission',
            'getUserPermissionsForResourceType',
            'findGroups',
            'findPrincipals']);
    });
});
