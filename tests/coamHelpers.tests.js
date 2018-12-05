const rewire = require('rewire');
const sinon = require('sinon');
const expect = require('chai').expect;
let coamHelpers = rewire('../src/coamHelpers');

describe('COAM Helpers', function() {
    [
        'getRoles',
        'modifyUserRoles',
        'removeUserRole',
        'addUserRole',
        'grantRoleToPrincipal',
        'setAdminFlag',
        'createGroup',
        'removeGroup',
        'findGroups',
        'getGroupInfo',
        'addGroupMember',
        'removeGroupMember',
        'group56',
        'addResourceToGroup',
        'removeResourceFromGroup',
        'hasPermission',
        'getUserPermissionsForResourceType',
        'getPrincipal',
        'findPrincipals',
    ].forEach((helperName) => {
        it(`${helperName} method calls appropriate client method`, function() {
            const stubs = {
                constructor: sinon.spy(),
                getRoles: sinon.stub(),
                modifyUserRoles: sinon.spy(),
                removeUserRole: sinon.spy(),
                addUserRole: sinon.spy(),
                grantRoleToPrincipal: sinon.spy(),
                setAdminFlag: sinon.spy(),
                createGroup: sinon.spy(),
                removeGroup: sinon.spy(),
                findGroups: sinon.spy(),
                getGroupInfo: sinon.spy(),
                addGroupMember: sinon.spy(),
                removeGroupMember: sinon.spy(),
                group56: sinon.spy(),
                addResourceToGroup: sinon.spy(),
                removeResourceFromGroup: sinon.spy(),
                hasPermission: sinon.spy(),
                getUserPermissionsForResourceType: sinon.spy(),
                getPrincipal: sinon.spy(),
                findPrincipals: sinon.spy(),
            };

            const fakeCoamClient = function() {
                return stubs;
            };

            coamHelpers.__set__('CoamClient', fakeCoamClient);

            coamHelpers[helperName]('token');

            expect(fakeCoamClient()[helperName].calledOnce).to.be.true;
        });
    });
});
