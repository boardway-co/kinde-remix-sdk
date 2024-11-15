export function getKindeSession(request: Request): Promise<{
  headers: Headers;
  getClaim: (
    claim: string,
    type: import("@kinde-oss/kinde-typescript-sdk").ClaimTokenType,
  ) => Promise<{
    name: string;
    value: unknown;
  } | null>;
  getClaimValue: (
    claim: string,
    type: import("@kinde-oss/kinde-typescript-sdk").ClaimTokenType,
  ) => Promise<unknown>;
  getOrganization: () => Promise<{
    orgCode: string | null;
  } | null>;
  getPermission: (permission: string) => Promise<{
    orgCode: string | null;
    isGranted: boolean;
  } | null>;
  getPermissions: () => Promise<
    | {
        permissions: string[];
        orgCode: string | null;
      }
    | []
  >;
  getFlag: (
    code: string,
    defaultValue: boolean | string | number,
    type: any,
  ) => Promise<import("@kinde-oss/kinde-typescript-sdk").GetFlagType | null>;
  getStringFlag: (code: string, defaultValue: string) => Promise<string | null>;
  getBooleanFlag: (
    code: string,
    defaultValue: boolean,
  ) => Promise<boolean | null>;
  getIntegerFlag: (
    code: string,
    defaultValue: number,
  ) => Promise<number | null>;
  getToken: () => Promise<string | null>;
  getUser: () => Promise<
    import("@kinde-oss/kinde-typescript-sdk").UserType | null
  >;
  getUserProfile: () => Promise<
    import("@kinde-oss/kinde-typescript-sdk").UserType | null
  >;
  getUserOrganizations: () => Promise<
    | {
        orgCodes: string[];
      }
    | []
  >;
  isAuthenticated: () => Promise<boolean>;
  refreshTokens: () => Promise<Headers>;
}>;
//# sourceMappingURL=get-kinde-session.d.ts.map
