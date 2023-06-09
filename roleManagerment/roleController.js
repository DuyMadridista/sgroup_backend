const RoleService = require('./roleService');

class RoleController {
    constructor() {
        this.roleService = new RoleService();
    }

    async createRole(req, res) {
        try {
            const { roleName } = req.body;
            const roleId = await this.roleService.createRole(roleName);
            res.status(200).json({ message: 'Role added', roleId } );
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to create role' });
        }
    }

    async deleteRole(req, res) {
        try {
            const { roleId } = req.params;
            await this.roleService.deleteRole(roleId);
            res.status(200).json({ message: 'Role deleted' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to delete role' });
        }
    }

    async assignPermissionToRole(req, res) {
        try {
            const { roleId }=req.params
            const { permission} = req.body;
            await this.roleService.assignPermissionToRole(roleId, permission);
            res.status(200).json({ message: 'Permission assigned to role' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to assign permission to role',error });
        }
    }

    async revokePermissionFromRole(req, res) {
        try {
            const { roleId } = req.params
            const { permission } = req.body;
            await this.roleService.revokePermissionFromRole(roleId, permission);
            res.status(200).json({ message: 'Permission revoked from role' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to revoke permission from role',error });
        }
    }

    async getRolePermissions(req, res) {
        try {
            const { roleId } = req.params;
            const permissions = await this.roleService.getRolePermissions(roleId);
            res.status(200).json({ permissions });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to get role permissions',error });
        }
    }

    async hasPermission(req, res) {
        try {
            const { roleId, permission } = req.params;
            const hasPermission = await this.roleService.hasPermission(roleId, permission);
            res.status(200).json({ hasPermission });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to check role permission',error });
        }
    }
}

module.exports = RoleController;
