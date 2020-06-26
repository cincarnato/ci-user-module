"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rootRecover = exports.initRootUser = exports.initRoles = exports.initAdminRole = exports.initPermissions = void 0;

var _RoleService = require("./RoleService");

var _UserService = require("./UserService");

var _PermissionService = require("./PermissionService");

var _admin = _interopRequireDefault(require("../roles/admin"));

var _operator = _interopRequireDefault(require("../roles/operator"));

var _rootUser = require("../data/root-user");

var _permissions = require("../permissions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const initPermissions = async permissions => {
  if (!permissions) {
    permissions = [_permissions.SECURITY_USER_CREATE, _permissions.SECURITY_USER_EDIT, _permissions.SECURITY_USER_DELETE, _permissions.SECURITY_USER_SHOW, _permissions.SECURITY_GROUP_CREATE, _permissions.SECURITY_GROUP_EDIT, _permissions.SECURITY_GROUP_DELETE, _permissions.SECURITY_GROUP_SHOW, _permissions.SECURITY_ROLE_CREATE, _permissions.SECURITY_ROLE_SHOW, _permissions.SECURITY_ROLE_EDIT, _permissions.SECURITY_ROLE_DELETE, _permissions.SECURITY_DASHBOARD_SHOW];
  } //Fetch permissions already created


  let permissionsFound = await (0, _PermissionService.fetchPermissionsInName)(permissions); //Filter permissions created (avoid duplicate)

  let permissionToCreate;

  if (permissionsFound) {
    permissionToCreate = permissions.filter(p => !permissionsFound.some(f => f.name == p));
  } else {
    permissionToCreate = permissions;
  } //permissions Found


  permissionsFound.forEach(p => {
    console.log("Permission Found: " + p.name + " " + p.id);
  }); // Exec All Create Promises

  let permissionsCreated = await Promise.all(permissionToCreate.map(name => (0, _PermissionService.createPermission)(name)));
  permissionsCreated.forEach(p => {
    console.log("Permissions Created: " + p.name + " " + p.id);
  });
};

exports.initPermissions = initPermissions;

const initAdminRole = async () => {
  let adminRoleT = await _admin.default;
  let adminRole = await (0, _RoleService.findRoleByName)(adminRoleT.name);

  if (adminRole) {
    let adminRoleUpdated = await (0, _RoleService.updateRole)(adminRole.id, {
      name: adminRole.name,
      permissions: adminRoleT.permissions
    });
    console.log("Admin Role Updated: " + adminRoleUpdated.name + " " + adminRoleUpdated.id);
  } else {
    adminRole = await (0, _RoleService.createRole)(adminRoleT);
    console.log("Admin Role Created: " + adminRole.name + " " + adminRole.id);
  }
};

exports.initAdminRole = initAdminRole;

const initRoles = async roles => {
  if (!roles) {
    roles = [_operator.default];
  }

  let rolesName = roles.map(r => r.name); //Fetch roles already created

  let rolesFound = await (0, _RoleService.fetchRolesInName)(rolesName); //Filter roles created (avoid duplicate)

  let rolesToCreate;

  if (rolesFound) {
    rolesToCreate = roles.filter(r => !rolesFound.some(f => f.name == r.name));
  } else {
    rolesToCreate = roles;
  } // Exec All Create Promises


  let rolesCreated = await Promise.all(rolesToCreate.map(role => (0, _RoleService.createRole)(role)));
  rolesCreated.forEach(r => {
    console.log("Role Created: " + r.name + " " + r.id);
  }); //Update Roles

  let rolesUpdated = await Promise.all(rolesFound.map(roleToUpdate => {
    let p = roles.find(r => r.name === roleToUpdate.name).permissions;
    return (0, _RoleService.updateRole)(roleToUpdate.id, {
      name: roleToUpdate.name,
      permissions: p
    });
  }));
  rolesUpdated.forEach(r => {
    console.log("Role Updated: " + r.name + " " + r.id);
  });
};

exports.initRoles = initRoles;

const initRootUser = async user => {
  if (!user) {
    user = _rootUser.rootUser;
  }

  let roleAdmin = await (0, _RoleService.findRoleByName)("admin");

  if (!roleAdmin) {
    throw Error('Root user cant be created. Role "admin" not found. ');
  }

  let u = await (0, _UserService.findUserByUsername)(user.username);

  if (!u) {
    u = await (0, _UserService.createUser)({ ...user,
      role: roleAdmin.id
    });
    console.log("User root created: ", u.id);
  } else {
    console.log("User root found: ", u.id);
  }
};

exports.initRootUser = initRootUser;

const rootRecover = async (password = "root.123") => {
  (0, _UserService.findUserByUsername)("root").then(rootUser => {
    (0, _UserService.changeRecoveryPassword)(rootUser.id, {
      newPassword: password
    }, rootUser).then(result => {
      console.log(result);
    });
  });
};

exports.rootRecover = rootRecover;