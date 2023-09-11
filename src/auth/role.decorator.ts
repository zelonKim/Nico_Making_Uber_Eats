import { SetMetadata } from '@nestjs/common'
import { UserRole } from 'src/users/entities/user.entity';

export type AllowedRoles = keyof typeof UserRole | 'Any';

// If you set Metadata, that means caring about authentication and check it
export const Role = (roles: AllowedRoles[]) => SetMetadata('roles', roles);

// @SetMetadata(key, value)
// assings metadata to class or function using the specified 'key'
// the metadata can be reflected using 'Reflector' class