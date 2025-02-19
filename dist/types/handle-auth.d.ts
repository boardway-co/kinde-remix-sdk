export const kindeClient: {
  handleRedirectToApp: (
    sessionManager: import("@kinde-oss/kinde-typescript-sdk").SessionManager,
    callbackURL: URL,
  ) => Promise<void>;
  isAuthenticated: (
    sessionManager: import("@kinde-oss/kinde-typescript-sdk").SessionManager,
  ) => Promise<boolean>;
  getUserProfile: (
    sessionManager: import("@kinde-oss/kinde-typescript-sdk").SessionManager,
  ) => Promise<import("@kinde-oss/kinde-typescript-sdk").UserType>;
  createOrg: (
    sessionManager: import("@kinde-oss/kinde-typescript-sdk").SessionManager,
    options?:
      | import("@kinde-oss/kinde-typescript-sdk").RegisterURLOptions
      | undefined,
  ) => Promise<URL>;
  getToken: (
    sessionManager: import("@kinde-oss/kinde-typescript-sdk").SessionManager,
  ) => Promise<string>;
  refreshTokens: (
    sessionManager: import("@kinde-oss/kinde-typescript-sdk").SessionManager,
  ) => Promise<
    import("@kinde-oss/kinde-typescript-sdk").OAuth2CodeExchangeResponse
  >;
  register: (
    sessionManager: import("@kinde-oss/kinde-typescript-sdk").SessionManager,
    options?:
      | import("@kinde-oss/kinde-typescript-sdk").RegisterURLOptions
      | undefined,
  ) => Promise<URL>;
  getUser: (
    sessionManager: import("@kinde-oss/kinde-typescript-sdk").SessionManager,
  ) => Promise<import("@kinde-oss/kinde-typescript-sdk").UserType>;
  logout: (
    sessionManager: import("@kinde-oss/kinde-typescript-sdk").SessionManager,
  ) => Promise<URL>;
  login: (
    sessionManager: import("@kinde-oss/kinde-typescript-sdk").SessionManager,
    options?:
      | import("@kinde-oss/kinde-typescript-sdk").RegisterURLOptions
      | undefined,
  ) => Promise<URL>;
  getUserOrganizations: (
    sessionManager: import("@kinde-oss/kinde-typescript-sdk").SessionManager,
  ) => Promise<{
    orgCodes: string[];
  }>;
  getOrganization: (
    sessionManager: import("@kinde-oss/kinde-typescript-sdk").SessionManager,
  ) => Promise<{
    orgCode: string | null;
  }>;
  getBooleanFlag: (
    sessionManager: import("@kinde-oss/kinde-typescript-sdk").SessionManager,
    code: string,
    defaultValue?: boolean | undefined,
  ) => Promise<boolean>;
  getIntegerFlag: (
    sessionManager: import("@kinde-oss/kinde-typescript-sdk").SessionManager,
    code: string,
    defaultValue?: number | undefined,
  ) => Promise<number>;
  getPermissions: (
    sessionManager: import("@kinde-oss/kinde-typescript-sdk").SessionManager,
  ) => Promise<{
    permissions: string[];
    orgCode: string | null;
  }>;
  getPermission: (
    sessionManager: import("@kinde-oss/kinde-typescript-sdk").SessionManager,
    name: string,
  ) => Promise<{
    orgCode: string | null;
    isGranted: boolean;
  }>;
  getClaimValue: (
    sessionManager: import("@kinde-oss/kinde-typescript-sdk").SessionManager,
    claim: string,
    type?: import("@kinde-oss/kinde-typescript-sdk").ClaimTokenType | undefined,
  ) => Promise<unknown>;
  getStringFlag: (
    sessionManager: import("@kinde-oss/kinde-typescript-sdk").SessionManager,
    code: string,
    defaultValue?: string | undefined,
  ) => Promise<string>;
  getClaim: (
    sessionManager: import("@kinde-oss/kinde-typescript-sdk").SessionManager,
    claim: string,
    type?: import("@kinde-oss/kinde-typescript-sdk").ClaimTokenType | undefined,
  ) => Promise<{
    name: string;
    value: unknown;
  }>;
  getFlag: (
    sessionManager: import("@kinde-oss/kinde-typescript-sdk").SessionManager,
    code: string,
    defaultValue?: string | number | boolean | undefined,
    type?: keyof import("@kinde-oss/kinde-typescript-sdk").FlagType | undefined,
  ) => Promise<import("@kinde-oss/kinde-typescript-sdk").GetFlagType>;
};
export function handleAuth(
  request: Request,
  route: string | undefined,
  options?:
    | {
        onRedirectCallback?:
          | ((props: { user: import("./types").KindeUser }) => void)
          | undefined;
      }
    | undefined,
): Promise<
  | import("@remix-run/node").TypedResponse<{
      siteUrl: string | undefined;
      issuerURL: any;
      clientID: string | undefined;
      clientSecret: string;
      postLogoutRedirectUrl: string | undefined;
      postLoginRedirectUrl: string | undefined;
      audience: string | undefined;
      cookieMaxAge: string | undefined;
    }>
  | undefined
>;
//# sourceMappingURL=handle-auth.d.ts.map
