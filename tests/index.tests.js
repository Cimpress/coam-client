const indexExports = require('../src/index');
const expect = require('chai').expect;

describe('Index', function() {
    it('exports are as expected', function() {
        const r = Object.keys(indexExports);
	r.sort();
	
	const e = ['CoamClient',
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
            'buildGroupUrlFromId',
            'addResourceToGroup',
            'removeResourceFromGroup',
            'hasPermission',
            'getUserPermissionsForResourceType',
            'findGroups',
            'findPrincipals',
            'getPrincipal'];
	e.sort();

        expect(r).to.deep.equal(e);
    });
});
