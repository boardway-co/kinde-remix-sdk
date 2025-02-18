import {
  createKindeServerClient as e,
  GrantType as t,
  validateClientSecret as r,
} from "@kinde-oss/kinde-typescript-sdk";
import { redirect as n, json as s } from "@remix-run/node";
import o from "universal-cookie";
const a = {
    clientId: process.env.KINDE_CLIENT_ID,
    clientSecret: process.env.KINDE_CLIENT_SECRET,
    issuerUrl: process.env.KINDE_ISSUER_URL,
    siteUrl: process.env.KINDE_SITE_URL,
    postLogoutRedirectUrl: process.env.KINDE_POST_LOGOUT_REDIRECT_URL,
    postLoginRedirectUrl: process.env.KINDE_POST_LOGIN_REDIRECT_URL,
    audience: process.env.KINDE_AUDIENCE,
    cookieMaxAge: process.env.KINDE_COOKIE_MAX_AGE,
    sessionSecret: process.env.SESSION_SECRET,
    isDebugMode: "true" === process.env.IS_DEBUG_MODE,
  },
  i = async (e) => {
    const t = new o(e.headers.get("Cookie"), { path: "/" }),
      r = {
        getSessionItem: async (e) => t.get(e),
        async setSessionItem(e, r) {
          t.set(e, r, { path: "/" });
        },
        async removeSessionItem(e) {
          t.remove(e, { path: "/" });
        },
        destroySession: async () => (
          [
            "id_token_payload",
            "id_token",
            "access_token_payload",
            "access_token",
            "user",
            "refresh_token",
            "post_login_redirect_url",
          ].forEach((e) => t.remove(e, { path: "/" })),
          Promise.resolve()
        ),
      };
    return { cookies: t, sessionManager: r };
  },
  c = [
    "refresh_token",
    "access_token",
    "id_token",
    "user",
    "ac-state-key",
    "post_login_redirect_url",
  ];
function u(e, t, r = {}) {
  const n = [
    `${encodeURIComponent(e)}=${encodeURIComponent("object" == typeof t ? JSON.stringify(t) : t)}`,
  ];
  return (
    r.maxAge && n.push(`Max-Age=${r.maxAge}`),
    r.domain && n.push(`Domain=${r.domain}`),
    r.path && n.push(`Path=${r.path}`),
    r.expires && n.push(`Expires=${r.expires.toUTCString()}`),
    r.httpOnly && n.push("HttpOnly"),
    r.secure && n.push("Secure"),
    r.sameSite && n.push(`SameSite=${r.sameSite}`),
    n.join("; ")
  );
}
const l = (e, t) => {
    const r = new o(e.headers.get("Cookie"), { path: "/" }),
      n = Object.keys(r.getAll()),
      s = Object.keys(t.getAll()).filter((e) => c.includes(e)),
      a = n.filter((e) => c.includes(e)).filter((e) => !s.includes(e));
    let i = new Headers();
    return (
      s.forEach((e) => {
        i.append(
          "Set-Cookie",
          u(e, t.get(e), {
            path: "/",
            sameSite: "Lax",
            httpOnly: !0,
            secure: "production" === process.env.NODE_ENV,
          }),
        );
      }),
      a.forEach((e) => {
        i.append(
          "Set-Cookie",
          u(e, 0, {
            path: "/",
            maxAge: -1,
            sameSite: "Lax",
            httpOnly: !0,
            secure: "production" === process.env.NODE_ENV,
          }),
        );
      }),
      i
    );
  },
  g = e(t.AUTHORIZATION_CODE, {
    authDomain:
      a.issuerUrl || "Set your issuer URL in your environment variables.",
    clientId: a.clientId || "Set your client ID in your environment variables.",
    clientSecret: a.clientSecret,
    redirectURL: a.siteUrl + "/kinde-auth/callback",
    audience: a.audience,
    logoutRedirectURL:
      a.postLogoutRedirectUrl ||
      "Set your logout redirect URL in your environment variables.",
    frameworkVersion: "1.1.3-headers",
    framework: "Remix",
  }),
  d = async (e, t, o) => {
    const { sessionManager: c, cookies: u } = await i(e);
    switch (t) {
      case "login":
        return (async () => {
          const { searchParams: t } = new URL(e.url),
            r = await g.login(c, { authUrlParams: Object.fromEntries(t) }),
            s = t.get("returnTo");
          s && u.set("post_login_redirect_url", s);
          const o = l(e, u);
          return n(r.toString(), { headers: o });
        })();
      case "register":
        return (async () => {
          const { searchParams: t } = new URL(e.url),
            r = await g.register(c, { authUrlParams: Object.fromEntries(t) }),
            s = t.get("returnTo");
          s && u.set("post_login_redirect_url", s);
          const o = l(e, u);
          return n(r.toString(), { headers: o });
        })();
      case "callback":
        return (async () => {
          await g.handleRedirectToApp(c, new URL(e.url));
          const t = await c.getSessionItem("post_login_redirect_url");
          t && c.removeSessionItem("post_login_redirect_url");
          const r =
              t ||
              a.postLoginRedirectUrl ||
              "Set your post login redirect URL in your environment variables.",
            s = l(e, u),
            i = await g.getUser(c);
          return (
            o?.onRedirectCallback?.({ user: i }),
            n(r.toString(), { headers: s })
          );
        })();
      case "logout":
        return (async () => {
          const t = await g.logout(c),
            r = l(e, u);
          return n(t.toString(), { headers: r });
        })();
      case "health":
        return (async () =>
          s({
            siteUrl: a.siteUrl,
            issuerURL: a.issuerURL,
            clientID: a.clientId,
            clientSecret: r(a.clientSecret || "")
              ? "Set correctly"
              : "Not set correctly",
            postLogoutRedirectUrl: a.postLogoutRedirectUrl,
            postLoginRedirectUrl: a.postLoginRedirectUrl,
            audience: a.audience,
            cookieMaxAge: a.cookieMaxAge,
          }))();
    }
  },
  p = async (e) => {
    const { sessionManager: t, cookies: r } = await i(e),
      n = async () => {
        try {
          return await g.getToken(t);
        } catch (e) {
          return a.isDebugMode && console.debug(e), null;
        }
      },
      s = async () => {
        try {
          await n();
          return l(e, r);
        } catch (e) {
          return a.isDebugMode && console.debug(e), new Headers();
        }
      };
    return {
      headers: await s(),
      getClaim: async (e, r) => {
        try {
          return await g.getClaim(t, e, r);
        } catch (e) {
          return a.isDebugMode && console.debug(e), null;
        }
      },
      getClaimValue: async (e, r) => {
        try {
          return await g.getClaimValue(t, e, r);
        } catch (e) {
          return a.isDebugMode && console.debug(e), null;
        }
      },
      getOrganization: async () => {
        try {
          return await g.getOrganization(t);
        } catch (e) {
          return a.isDebugMode && console.debug(e), null;
        }
      },
      getPermission: async (e) => {
        try {
          return await g.getPermission(t, e);
        } catch (e) {
          return a.isDebugMode && console.debug(e), null;
        }
      },
      getPermissions: async () => {
        try {
          return await g.getPermissions(t);
        } catch (e) {
          return a.isDebugMode && console.debug(e), [];
        }
      },
      getFlag: async (e, r, n) => {
        try {
          return await g.getFlag(t, e.toLowerCase(), r, n);
        } catch (e) {
          return a.isDebugMode && console.debug(e), null;
        }
      },
      getStringFlag: async (e, r) => {
        try {
          return await g.getStringFlag(t, e.toLowerCase(), r);
        } catch (e) {
          return a.isDebugMode && console.debug(e), null;
        }
      },
      getBooleanFlag: async (e, r) => {
        try {
          return await g.getBooleanFlag(t, e.toLowerCase(), r);
        } catch (e) {
          return a.isDebugMode && console.debug(e), null;
        }
      },
      getIntegerFlag: async (e, r) => {
        try {
          return await g.getIntegerFlag(t, e.toLowerCase(), r);
        } catch (e) {
          return a.isDebugMode && console.debug(e), null;
        }
      },
      getToken: n,
      getUser: async () => {
        try {
          return await g.getUser(t);
        } catch (e) {
          return (
            "Cannot get user details, no authentication credential found" !==
              e.message &&
              a.isDebugMode &&
              console.debug(e),
            null
          );
        }
      },
      getUserProfile: async () => {
        try {
          return await g.getUserProfile(t);
        } catch (e) {
          return a.isDebugMode && console.debug(e), null;
        }
      },
      getUserOrganizations: async () => {
        try {
          return await g.getUserOrganizations(t);
        } catch (e) {
          return a.isDebugMode && console.debug(e), { orgCodes: [] };
        }
      },
      isAuthenticated: async () => {
        try {
          return await g.isAuthenticated(t);
        } catch (e) {
          return a.isDebugMode && console.debug(e), !1;
        }
      },
      refreshTokens: s,
    };
  };
export { p as getKindeSession, d as handleAuth };
