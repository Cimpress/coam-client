const rewire = require('rewire');
const CoamClient = rewire('../src/CoamClient');
const sinon = require('sinon');
const expect = require('chai').expect;

let fakeAxios = {};

CoamClient.__set__('axiosRetry', function() {

});

let requestStub;
const groupUrl = 'http://full.url.com/132123';
const groupId = '132123';
const roleName = 'Dummy Role';
const accessToken = 'xToken';
const principal = 'xPrincipal';
const resourceType = 'xResourceType';
const resourceIdentifier = 'xResourceIdentifier';
const permission = 'xPermission';


function calledOnceWith(requestStub, args, withNoCache = true) {
    calledWith(requestStub, args, withNoCache, 1);
}

function calledWith(requestStub, args, withNoCache = true, times = 1) {
    expect(requestStub.callCount).to.equal(times);
    if (withNoCache && requestStub.args[0][0]['params'] && requestStub.args[0][0].method === 'GET') {
        expect(requestStub.args[0][0]['params'].skipCache).to.exist;
        delete requestStub.args[0][0]['params'].skipCache;
    }
    expect(requestStub.args[0]).to.deep.equal([args]);
}

function calledWithAtExactSequence(requestStub, sequenceNo, args) {
    expect(requestStub.getCall(sequenceNo).args).to.deep.equal([args]);
}

function mockRequestResponse(resolveWith) {
    requestStub = sinon.stub().returns(Promise.resolve({data: resolveWith}));
    fakeAxios = {
        create: sinon.stub().returns({
            request: requestStub,
        }),
    };
    CoamClient.__set__('axios', fakeAxios);

    return requestStub;
}

function mockRequestResponseWithExactArgs(requestStub, args, resolveWith = undefined) {
    requestStub.withArgs(args).returns(Promise.resolve({data: resolveWith}));
}

describe('CoamClient', function() {
    beforeEach(function() {
        requestStub = mockRequestResponse('yes!');
    });

    it("buildGroupIdFromUrl", function() {
      const baseUrl = "https://www.example.com";
      const client = new CoamClient({ baseUrl });
      const groupId = 12345;

      const actual = client.buildGroupUrlFromId(groupId);

      expect(actual).to.equal(`${baseUrl}/auth/access-management/v1/groups/${groupId}`);

    });

    it('getGroupInfo', async function() {
        const client = new CoamClient({accessToken: accessToken});

        await client.getGroupInfo(groupUrl);

        calledOnceWith(requestStub, {
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'method': 'GET',
            'params': {
                'canonicalize': 'true',
            },
            'url': groupUrl,
        });
    });

    it('hasPermission', async function() {
        const client = new CoamClient({accessToken: accessToken});

        await client.hasPermission(principal, resourceType, resourceIdentifier, permission);

        calledOnceWith(requestStub, {
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'method': 'GET',
            'params': {
            },
            'url': `/auth/access-management/v1/principals/${encodeURIComponent(principal)}/permissions/${encodeURIComponent(resourceType)}/${encodeURIComponent(resourceIdentifier)}/${encodeURIComponent(permission)}`,
        });
    });

    it('grantRoleToPrincipal', async function() {
        const client = new CoamClient({accessToken: accessToken});

        await client.grantRoleToPrincipal(groupUrl, principal, roleName);

        calledWith(requestStub, {
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'method': 'GET',
            'params': {
                'canonicalize': 'true',
            },
            'url': groupUrl,
        }, true, 3);
    });

    it('setAdminFlag', async function() {
        const client = new CoamClient({accessToken: accessToken});

        await client.setAdminFlag(groupId, principal, true);

        calledOnceWith(requestStub, {
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'method': 'PATCH',
            'data': {
                'is_admin': true,
            },
            'url': `/auth/access-management/v1/groups/${groupId}/members/${principal}`,
        });
    });

    it('removeUserRole', async function() {
        const client = new CoamClient({accessToken: accessToken});

        await client.removeUserRole(groupId, principal, roleName);

        calledOnceWith(requestStub, {
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'method': 'PATCH',
            'data': {
                'remove': [
                    'Dummy Role',
                ],
            },
            'url': `/auth/access-management/v1/groups/${groupId}/members/${principal}/roles`,
        });
    });

    it('addUserRole', async function() {
        const client = new CoamClient({accessToken: accessToken});

        await client.addUserRole(groupId, principal, roleName);

        calledOnceWith(requestStub, {
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'method': 'PATCH',
            'data': {
                'add': [
                    'Dummy Role',
                ],
            },
            'url': `/auth/access-management/v1/groups/${groupId}/members/${principal}/roles`,
        });
    });

    it('group56', async function() {
        requestStub = mockRequestResponse({groups: []});
        const client = new CoamClient({accessToken: accessToken});

        await client.group56( principal);

        calledOnceWith(requestStub, {
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'method': 'GET',
            'params': {

            },
            'url': `/auth/access-management/v1/principals/${principal}/groups`,
        });
    });

    it('modifyUserRoles', async function() {
        const client = new CoamClient({accessToken: accessToken});

        await client.modifyUserRoles(groupId, principal, {'add': [roleName]});

        calledOnceWith(requestStub, {
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'method': 'PATCH',
            'data': {
                'add': [
                    'Dummy Role',
                ],
            },
            'url': `/auth/access-management/v1/groups/${groupId}/members/${principal}/roles`,
        });
    });

    it('addGroupMember', async function() {
        const client = new CoamClient({accessToken: accessToken});

        await client.addGroupMember(groupId, principal, true);

        calledOnceWith(requestStub, {
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'method': 'PATCH',
            'data': {
                'add': [
                    {
                        'is_admin': true,
                        'principal': principal,
                    },
                ],
            },
            'params': {
                'canonicalize': true,
            },
            'url': `/auth/access-management/v1/groups/${groupId}/members`,
        });
    });

    it('removeGroupMember', async function() {
        const client = new CoamClient({accessToken: accessToken});

        await client.removeGroupMember(groupId, principal);

        calledOnceWith(requestStub, {
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'method': 'PATCH',
            'data': {
                'remove': [
                    principal,
                ],
            },
            'url': `/auth/access-management/v1/groups/${groupId}/members`,
        });
    });

    it('getRoles', async function() {
        const client = new CoamClient({accessToken: accessToken});

        await client.getRoles();

        calledOnceWith(requestStub, {
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'method': 'GET',
            'url': `/auth/access-management/v1/roles`,
        });
    });

    it('findPrincipals', async function() {
        let requestStub = mockRequestResponse({data: {canonical_principals: []}});
        const client = new CoamClient({accessToken: accessToken});

        await client.findPrincipals('asd');

        calledOnceWith(requestStub, {
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'method': 'GET',
            'params': {
                'canonicalize': true,
                'q': 'asd',
            },
            'url': '/auth/access-management/v1/search/canonicalPrincipals/bySubstring',
        });
    });

    it('getPrincipal', async function() {
        let requestStub = mockRequestResponse({
            'canonical_principal': 'vcuenagarcia@cimpress.com',
            'is_client': false,
            'is_pending': false,
            'profile': {
                '_id': 'dc8c45ab5c6d016efbd37ad02a7e3911',
                'email': 'vcuenagarcia@cimpress.com',
                'name': 'Victor Cuena Garcia',
                'given_name': 'Victor',
                'family_name': 'Cuena Garcia',
                'email_verified': true,
                'clientID': 'G17HdNd01gAPfiSV5upbWdiDUnAU8is9',
                'updated_at': '2018-09-07T01:20:46.219Z',
                'picture': 'https://s.gravatar.com/avatar/e4780d0c8212f0fbea1014e6646f395d?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fvc.png',
                'user_id': 'adfs|vcuenagarcia@cimpress.com',
                'nickname': 'vcuenagarcia',
            },
        });
        const client = new CoamClient({accessToken: accessToken});

        await client.getPrincipal('asd');

        calledOnceWith(requestStub, {
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'method': 'GET',
            'params': {},
            'url': '/auth/access-management/v1/principals/asd',
        });
    });

    it('createGroup', async function() {
        let newGroupDescription = {
            'name': 'string',
            'description': 'string',
            'id': '123',
            'created_by': 'string',
            'created_at': '2019-02-06T08:02:09.419Z',
            'members': [
                {
                    'is_admin': true,
                    'principal': 'string',
                    'roles': [
                        'string',
                    ],
                },
            ],
            'resources': [
                {
                    'resource_type': 'string',
                    'resource_identifier': 'string',
                },
            ],
            'permissions': {
                'additionalProp1': [
                    {
                        'identifier': 'string',
                        'permissions': [
                            'string',
                        ],
                    },
                ],
            },
        };
        let requestStub = mockRequestResponse(newGroupDescription);

        const client = new CoamClient({accessToken: accessToken});

        let result = await client.createGroup('name', 'desc');

        expect(result).to.deep.equal(newGroupDescription);

        calledOnceWith(requestStub, {
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'method': 'POST',
            'data': {
                'description': 'desc',
                'name': 'name',
            },
            'url': `/auth/access-management/v1/groups`,
        });
    });

    it('removeGroup', async function() {
        const client = new CoamClient({accessToken: accessToken});

        await client.removeGroup(groupId);

        calledOnceWith(requestStub, {
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'method': 'DELETE',
            'url': `/auth/access-management/v1/groups/${groupId}`,
        });
    });

    it('findGroups', async function() {
        let requestStub = mockRequestResponse({data: {canonical_principals: []}});
        const client = new CoamClient({accessToken: accessToken});

        await client.findGroups(resourceType, resourceIdentifier);

        calledOnceWith(requestStub, {
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'params': {
                'resource_identifier': resourceIdentifier,
                'resource_type': resourceType,
            },
            'method': 'GET',
            'url': `/auth/access-management/v1/groups`,
        });
    });

    it('addResourceToGroup', async function() {
        let requestStub = mockRequestResponse({data: {canonical_principals: []}});
        const client = new CoamClient({accessToken: accessToken});

        await client.addResourceToGroup(groupId, resourceType, resourceIdentifier);

        calledOnceWith(requestStub, {
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'method': 'PATCH',
            'data': {
                'add': [
                    {
                        'resource_identifier': resourceIdentifier,
                        'resource_type': resourceType,
                    },
                ],
                'remove': [],
            },
            'url': `/auth/access-management/v1/groups/${groupId}/resources`,
        });
    });

    it('removeResourceFromGroup', async function() {
        const client = new CoamClient({accessToken: accessToken});

        await client.removeResourceFromGroup(groupId, resourceType, resourceIdentifier);

        calledOnceWith(requestStub, {
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'data': {
                'add': [],
                'remove': [{
                    'resource_identifier': resourceIdentifier,
                    'resource_type': resourceType,
                }],
            },
            'method': 'PATCH',
            'url': `/auth/access-management/v1/groups/${groupId}/resources`,
        });
    });

    it('getUserPermissionsForResourceType', async function() {
        const client = new CoamClient({accessToken: accessToken});

        await client.getUserPermissionsForResourceType(principal, resourceType);

        calledOnceWith(requestStub, {
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'method': 'GET',
            'url': `/auth/access-management/v1/principals/${principal}/permissions/${resourceType}`,
        });
    });

    it('getUsersWithPermission', async function() {
        const client = new CoamClient({accessToken: accessToken});

        await client.getUsersWithPermission(resourceType, resourceIdentifier, permission);

        calledOnceWith(requestStub, {
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'method': 'GET',
            'url': `/auth/access-management/v1/search/canonicalPrincipals/byPermission?resource_type=${resourceType}&resource_identifier=${resourceIdentifier}&permission=${permission}`,
        });
    });


    it('createGroupWithUser', async function() {
        // define the user and group details that we want to use for this test
        const principalToCreateGroup = 'principal-that-creates-the-group';
        const principalToAddToGroup = 'principal-to-add-to-group';
        const groupName = 'unit-test-group';
        const groupId = 'unit-test-group-id';
        const groupDescription = 'unit-test-group-desc';
        const rolesToAdd = ['unit-test-role-1', 'unit-test-role-2'];
        const resourcesToAdd = [{resourceType: 'rt-unit-test-1', resourceId: 'id-unit-test-1'}, {resourceType: 'rt-unit-test-2', resourceId: 'id-unit-test-2'}];

        // define all the arguments and return values
        const newGroupDescription = {
            'name': groupName,
            'description': groupDescription,
            'id': groupId,
        };
        const createGroupArgs = {
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'method': 'POST',
            'data': {
                'description': groupDescription,
                'name': groupName,
            },
            'url': `/auth/access-management/v1/groups`,
        };
        const addMemberArgs = {
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'method': 'PATCH',
            'data': {
                'add': [
                    {
                        'is_admin': false,
                        'principal': principalToAddToGroup,
                    },
                ],
            },
            'params': {
                'canonicalize': true,
            },
            'url': `/auth/access-management/v1/groups/${groupId}/members`,
        };
        const setAdminFlagArgs = {
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'method': 'PATCH',
            'data': {
                'is_admin': true,
            },
            'url': `/auth/access-management/v1/groups/${groupId}/members/${principalToAddToGroup}`,
        };
        const principalRolesArgs = rolesToAdd.map((r) => ({
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'method': 'PATCH',
            'data': {
                'add': [r],
            },
            'url': `/auth/access-management/v1/groups/${groupId}/members/${principalToAddToGroup}/roles`,
        }));
        const principalResourcesArgs = resourcesToAdd.map((r) => ({
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'method': 'PATCH',
            'data': {
                'add': [
                    {
                        'resource_identifier': r.resourceId,
                        'resource_type': r.resourceType,
                    },
                ],
                'remove': [],
            },
            'url': `/auth/access-management/v1/groups/${groupId}/resources`,
        }));
        const removeCreatorArgs = {
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'method': 'PATCH',
            'data': {
                'remove': [
                    principalToCreateGroup,
                ],
            },
            'url': `/auth/access-management/v1/groups/${groupId}/members`,
        };

        // mock the responses with the exact arguments
        mockRequestResponseWithExactArgs(requestStub, createGroupArgs, newGroupDescription);
        mockRequestResponseWithExactArgs(requestStub, addMemberArgs);
        mockRequestResponseWithExactArgs(requestStub, setAdminFlagArgs);
        for (let i = 0; i < principalRolesArgs.length; i++) {
            mockRequestResponseWithExactArgs(requestStub, principalRolesArgs[i]);
        }
        for (let i = 0; i < principalResourcesArgs.length; i++) {
            mockRequestResponseWithExactArgs(requestStub, principalResourcesArgs[i]);
        }
        mockRequestResponseWithExactArgs(requestStub, removeCreatorArgs);

        // execute the actual test
        const client = new CoamClient({accessToken: accessToken});

        await client.createGroupWithUser(principalToCreateGroup, principalToAddToGroup, groupName, groupDescription, rolesToAdd, resourcesToAdd);

        // validate that the exact sequence was executed
        expect(requestStub.callCount).to.equal(4 + principalRolesArgs.length + principalResourcesArgs.length);
        let i = 0;
        calledWithAtExactSequence(requestStub, i++, createGroupArgs);
        calledWithAtExactSequence(requestStub, i++, addMemberArgs);
        calledWithAtExactSequence(requestStub, i++, setAdminFlagArgs);
        for (let j = 0; j < principalRolesArgs.length; j++) {
            calledWithAtExactSequence(requestStub, i++, principalRolesArgs[j]);
        }
        for (let j = 0; j < principalResourcesArgs.length; j++) {
            calledWithAtExactSequence(requestStub, i++, principalResourcesArgs[j]);
        }
        calledWithAtExactSequence(requestStub, i++, removeCreatorArgs);
    });
});
