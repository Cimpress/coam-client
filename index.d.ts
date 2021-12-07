type KeyValue<T> = {[key: string]: T};

type Profile = any;

export interface CoamClientOptions {
  baseUrl?: string;
  timeout?: number;
  accessToken?: string;
  retryAttempts?: number;
  retryDelayInMs?: number;
  retryOnForbidden?: boolean;
  debugFunction?: (message?: any, ...optionalParams: any[]) => void;
  errorFunction?: (message?: any, ...optionalParams: any[]) => void;
}

interface GroupPrimitiveArray {
  groups: GroupPrimitive[];
}

interface GroupPrimitive {
  name: string;
  description: string;
  id: number;
  created_by?: string;
  created_at?: string;
}

interface Group extends GroupPrimitive {
  members: GroupMember[];
  resources: Resource[];
  permissions: KeyValue<ResourceIdentifierPermissions[]>;
}

interface GroupMember {
  principal: string;
  is_admin: boolean;
  roles: string[];
  description?: string;
}

interface ResourceArray {
  resources: Resource[];
}

interface Resource {
  resource_type: string;
  resource_identifier: string;
}

interface ResourceIdentifierPermissions {
  identifier: string;
  permissions: string[];
  resource_type: string;
}

interface RoleArray {
  roles: Role[]
}

interface Role {
  name: string;
  description: string;
  permissions: ResourceTypePermissionDescription[];
  id: string;
  created_at?: string;
}

interface ResourceTypePermissionDescription {
  resource_type: string;
  name: string;
  description: string;
}

interface CanonicalPrincipalPrimitiveArrayObject {
  canonical_principals: CanonicalPrincipalPrimitive[];
}

interface CanonicalPrincipalPrimitive {
  is_client?: boolean;
  account_id?: string;
  canonical_principal: string;
  is_pending: boolean;
  profiles: Profile[];
}

interface Principal {
  groups: PrincipalGroup[];
  permissions: KeyValue<ResourceIdentifierPermissions[]>;
  canonical_principal: string;
  is_client: boolean;
  is_pending: boolean;
  profile?: Profile;
  account_id?: string;
}

interface PrincipalGroup {
  name: string;
  description: string;
  id: string;
  created_by?: string;
  created_at?: string;
  is_admin: boolean;
}

interface ByResourceSearchResult {
  canonical_principals: CanonicalPrincipalSearchResult[];
}

interface CanonicalPrincipalSearchResult {
  canonical_principal: string;
  resource_type: string;
  is_client: boolean;
  permissions: KeyValue<string[]>;
}

export declare class CoamClient {
  constructor(options: CoamClientOptions);

  buildGroupUrlFromId(groupId: string): string;
  hasPermission(principal: string, resourceType: string, resourceIdentifier: string, permission: string): Promise<boolean>;
  grantRoleToPrincipal(groupUrl: string, principal: string, roleName: string): Promise<void>;
  getGroupInfo(groupUrl: string): Promise<Group>;
  setAdminFlag(groupId: string, principal: string, isAdmin: boolean): Promise<void>;
  removeUserRole(groupId: string, principal: string, role: string): Promise<void>;
  addUserRole(groupId: string, principal: string, role: string): Promise<void>;
  modifyUserRoles(groupId: string, principal: string, rolesChanges: string): Promise<void>;
  addGroupMember(groupId: string, principal: string, isAdmin: boolean): Promise<void>;
  removeGroupMember(groupId: string, principal: string): Promise<void>;
  getRoles(): Promise<RoleArray>;
  findPrincipals(query: string): Promise<CanonicalPrincipalPrimitiveArrayObject>;
  getPrincipal(principal: string): Promise<Principal>;
  createGroup(name: string, description: string): Promise<Group>;
  removeGroup(groupId: string): Promise<void>;
  findGroups(resourceType: string, resourceIdentifier: string): Promise<GroupPrimitiveArray>;
  removeResourceFromGroup(groupId: string, resourceType: string, resourceId: string): Promise<ResourceArray>;
  addResourceToGroup(groupId: string, resourceType: string, resourceId: string): Promise<ResourceArray>;
  getUserPermissionsForResourceType(principal: string, resourceType: string): Promise<ResourceIdentifierPermissions[]>;
  getUsersWithPermission(resourceType: string, resourceIdentifier: string, permission: string): Promise<string[]>;
  getUsersWithResource(resourceType: string, permissionFilters: string[]): Promise<ByResourceSearchResult>;
  createGroupWithUser(principalToCreateGroup: string, principalToAddToGroup: string, groupName: string, groupDescription: string, rolesToAdd: string[], resourcesToAdd: { resourceType: string, resourceId: string }[]): Promise<string>;
}

export declare function buildGroupUrlFromId(groupId: string): string;
export declare function hasPermission(accessToken: string, principal: string, resourceType: string, resourceIdentifier: string, permission: string): Promise<boolean>;
export declare function grantRoleToPrincipal(accessToken: string, groupUrl: string, principal: string, roleName: string): Promise<void>;
export declare function getGroupInfo(accessToken: string, groupUrl: string): Promise<Group>;
export declare function setAdminFlag(accessToken: string, groupId: string, principal: string, isAdmin: boolean): Promise<void>;
export declare function removeUserRole(accessToken: string, groupId: string, principal: string, role: string): Promise<void>;
export declare function addUserRole(accessToken: string, groupId: string, principal: string, role: string): Promise<void>;
export declare function modifyUserRoles(accessToken: string, groupId: string, principal: string, rolesChanges: string): Promise<void>;
export declare function addGroupMember(accessToken: string, groupId: string, principal: string, isAdmin: boolean): Promise<void>;
export declare function removeGroupMember(accessToken: string, groupId: string, principal: string): Promise<void>;
export declare function getRoles(accessToken: string): Promise<RoleArray>;
export declare function findPrincipals(accessToken: string, query: string): Promise<CanonicalPrincipalPrimitiveArrayObject>;
export declare function getPrincipal(accessToken: string, principal: string): Promise<Principal>;
export declare function createGroup(accessToken: string, name: string, description: string): Promise<Group>;
export declare function removeGroup(accessToken: string, groupId: string): Promise<void>;
export declare function findGroups(accessToken: string, resourceType: string, resourceIdentifier: string): Promise<GroupPrimitiveArray>;
export declare function removeResourceFromGroup(accessToken: string, groupId: string, resourceType: string, resourceId: string): Promise<ResourceArray>;
export declare function addResourceToGroup(accessToken: string, groupId: string, resourceType: string, resourceId: string): Promise<ResourceArray>;
export declare function getUserPermissionsForResourceType(accessToken: string, principal: string, resourceType: string): Promise<ResourceIdentifierPermissions[]>;
export declare function getUsersWithPermission(accessToken: string, resourceType: string, resourceIdentifier: string, permission: string): Promise<string[]>;
export declare function getUsersWithResource(accessToken: string, resourceType: string, permissionFilters: string[]): Promise<ByResourceSearchResult>;
export declare function createGroupWithUser(accessToken: string, principalToCreateGroup: string, principalToAddToGroup: string, groupName: string, groupDescription: string, rolesToAdd: string[], resourcesToAdd: { resourceType: string, resourceId: string }[]): Promise<string>;
