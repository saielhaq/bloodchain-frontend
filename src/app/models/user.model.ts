export interface User {
  userId: number;
  cin: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  bloodType: any;
  createdAt: any;
  lastUpdate: any;
  roles: Role[];
  enabled: boolean;
  authorities: Authority[];
  username: string;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
}

export interface Role {
  roleId: number;
  name: string;
  erole: string;
}

export interface Authority {
  authority: string;
}

export interface UserAdd {
  id?: number;
  cin: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  roles: string[];
}
