#### Package deprecation notice

As of 2022-03-03, the package has been renamed and published internally. All further development of this library, including new features and bug fixes, will continue in the new repository. Thus, this repository will no longer be maintained.

You are welcome to migrate to `@cimpress-technology/coam-client`, sourcing it from the internal repository.

##### What will happen if I do nothing?

You will be using an unmaintained version of the library, which means that no support will be offered.

##### I am an external user without access to the internal repository. What can I do?

Unfortunately, at the time we are unable to provide you with a replacement component library. You may continue using the unmaintained library, albeit at your own risk.

# COAM thin client

A thin client to perform certain requests in COAM. This is **not** an exhaustive implementation
of COAM API. 

If you like to add a method (or tweak something), please open a pull-request. We love pull-requests!
But we also love solving issues, so in case you don't really have the time for a pull-request right now,
maybe you can [just tell us what you'd like](https://github.com/Cimpress/coam-client/issues)? 

Or maybe you just feel like [writing us a mail](mailto:TrdelnikSquad@cimpress.io)? Yes, you guessed right, we also love reading mails ;) 


#### CoamClient class
A simple client to make API calls to COAM. It has a few additional features that can be controlled
by the `options` parameter passed in the constructor.

    const client = new CoamClient(options);
    
###### Accepted options are:
* **accessToken** (required) - The access token to use to authenticate the API calls
* _baseUrl_ - Base COAM API URL. Defaults to https://api.cimpress.io
* _retryAttempts_ - How many tries to retry the requests in case of failure*. Defaults to 2.
* _retryDelayInMs_ - How many milliseconds to wait between retires. Defaults to 200.
* _retryOnForbidden_ - A flag specifying if a retry has to be performed in case of 'Forbidden' response. Defaults to 'true'
* _debugFunction_ - A function to call to provide debug information. Defaults to none.
* _errorFunction_ - A function to call on error. Defaults to console.err;
* _timeout_ - A value setting the timeout of the underlying HTTP calls to COAM. Defaults to 8000 (8 seconds). Set it to 0 for no timeout.
* _skipCache_ - A flag specifying if cache should be skipped. Defaults to 'false'

###### Provided methods 
* buildGroupUrlFromId(groupId)
* hasPermission(principal, resourceType, resourceIdentifier, permission)
* grantRoleToPrincipal(groupUrl, principal, roleName)
* getGroupInfo(groupUrl)
* setAdminFlag(groupId, principal, isAdmin)
* removeUserRole(groupId, principal, role)
* addUserRole(groupId, principal, role)
* modifyUserRoles(groupId, principal, rolesChanges)
* addGroupMember(groupId, principal, isAdmin)
* removeGroupMember(groupId, principal)
* getRoles()
* findPrincipals(query)
* createGroup(name, description)
* getPrincipal(accessToken, principal)
* removeGroup(groupId)
* findGroups(resourceType, resourceIdentifier)
* removeResourceFromGroup(groupId, resourceType, resourceId)
* addResourceToGroup(groupId, resourceType, resourceId)
* getUserPermissionsForResourceType(principal, resourceType, include, permissionFilters)
* getUsersWithPermission(resourceType, resourceIdentifier, permission)
* getUsersWithResource(resourceType, permissionFilters)
* createGroupWithUser(principalToCreateGroup, principalToAddToGroup, groupName, groupDescription, rolesToAdd, resourcesToAdd)

#### Direct helper functions
In some cases, it is easier to simply call a function to perform the required action
without the need for creating a specific client. The following helper methods satisfy these
needs by creating a default client and performing the necessary requests. 

Here is a list of helpers (name + required parameters):

* **buildGroupUrlFromId**(groupId)
* **hasPermission**(accessToken, principal, resourceType, resourceIdentifier, permission) 
* **grantRoleToPrincipal** (accessToken, groupUrl, principal, roleName) 
* **getGroupInfo** (accessToken, groupUrl) 
* **setAdminFlag** (accessToken, groupId, principal, isAdmin) 
* **removeUserRole** (accessToken, groupId, principal, role) 
* **addUserRole** (accessToken, groupId, principal, role) 
* **modifyUserRoles** (accessToken, groupId, principal, rolesChanges) 
* **addGroupMember** (accessToken, groupId, principal, isAdmin) 
* **removeGroupMember** (accessToken, groupId, principal) 
* **getRoles** (accessToken) 
* **findPrincipals** (accessToken, query) 
* **getPrincipal** (accessToken, principal)
* **createGroup** (accessToken, name, description) 
* **removeGroup** (accessToken, groupId) 
* **findGroups** (accessToken, resourceType, resourceIdentifier) 
* **removeResourceFromGroup** (accessToken, groupId, resourceType, resourceId) 
* **addResourceToGroup** (accessToken, groupId, resourceType, resourceId) 
* **getUserPermissionsForResourceType** (accessToken, principal, resourceType, include, permissionFilters)
* **getUsersWithPermission** (accessToken, resourceType, resourceIdentifier, permission)
* **getUsersWithResource** (accessToken, resourceType, permissionFilters)
* **createGroupWithUser** (accessToken, principalToCreateGroup, principalToAddToGroup, groupName, groupDescription, rolesToAdd, resourcesToAdd)

**Important**: All helper methods are using the CoamClient class with default settings (see above).  
