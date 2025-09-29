
class Permission {
    id?: number;
    name?: string;
    permissions?: Record<string, boolean>;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    constructor(params: Partial<Permission> = {}) {
        this.id = params.id;
        this.name = params.name;
        this.permissions = params.permissions;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.deletedAt = params.deletedAt;
    }

    get permissionDetails() {
        return {
            name: this.name,
            permissions: this.permissions
        };
    }
}

export default Permission;