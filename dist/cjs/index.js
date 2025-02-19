"use strict";
var e = require("@kinde-oss/kinde-typescript-sdk"),
  t = require("@remix-run/node"),
  r = require("universal-cookie");
const n = {
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
  s = async (e) => {
    const t = new r(e.headers.get("Cookie"), { path: "/" }),
      n = {
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
    return { cookies: t, sessionManager: n };
  },
  o = [
    "refresh_token",
    "access_token",
    "id_token",
    "user",
    "ac-state-key",
    "post_login_redirect_url",
  ];
function a(e, t, r = {}) {
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
const i = (e, t) => {
    const n = new r(e.headers.get("Cookie"), { path: "/" }),
      s = Object.keys(n.getAll()),
      i = Object.keys(t.getAll()).filter((e) => o.includes(e)),
      c = s.filter((e) => o.includes(e)).filter((e) => !i.includes(e));
    let u = new Headers();
    return (
      i.forEach((e) => {
        u.append(
          "Set-Cookie",
          a(e, t.get(e), {
            path: "/",
            sameSite: "Lax",
            httpOnly: !0,
            secure: "production" === process.env.NODE_ENV,
          }),
        );
      }),
      c.forEach((e) => {
        u.append(
          "Set-Cookie",
          a(e, 0, {
            path: "/",
            maxAge: -1,
            sameSite: "Lax",
            httpOnly: !0,
            secure: "production" === process.env.NODE_ENV,
          }),
        );
      }),
      u
    );
  },
  c = e.createKindeServerClient(e.GrantType.AUTHORIZATION_CODE, {
    authDomain:
      n.issuerUrl || "Set your issuer URL in your environment variables.",
    clientId: n.clientId || "Set your client ID in your environment variables.",
    clientSecret: n.clientSecret,
    redirectURL: n.siteUrl + "/kinde-auth/callback",
    audience: n.audience,
    logoutRedirectURL:
      n.postLogoutRedirectUrl ||
      "Set your logout redirect URL in your environment variables.",
    frameworkVersion: "1.1.3-headers-2",
    framework: "Remix",
  });
(exports.getKindeSession = async (e) => {
  const { sessionManager: t, cookies: r } = await s(e),
    o = async () => {
      try {
        await c.getToken(t);
        return i(e, r);
      } catch (e) {
        return n.isDebugMode && console.debug(e), new Headers();
      }
    };
  return {
    headers: await o(),
    getClaim: async (e, r) => {
      try {
        return await c.getClaim(t, e, r);
      } catch (e) {
        return n.isDebugMode && console.debug(e), null;
      }
    },
    getClaimValue: async (e, r) => {
      try {
        return await c.getClaimValue(t, e, r);
      } catch (e) {
        return n.isDebugMode && console.debug(e), null;
      }
    },
    getOrganization: async () => {
      try {
        return await c.getOrganization(t);
      } catch (e) {
        return n.isDebugMode && console.debug(e), null;
      }
    },
    getPermission: async (e) => {
      try {
        return await c.getPermission(t, e);
      } catch (e) {
        return n.isDebugMode && console.debug(e), null;
      }
    },
    getPermissions: async () => {
      try {
        return await c.getPermissions(t);
      } catch (e) {
        return n.isDebugMode && console.debug(e), [];
      }
    },
    getFlag: async (e, r, s) => {
      try {
        return await c.getFlag(t, e.toLowerCase(), r, s);
      } catch (e) {
        return n.isDebugMode && console.debug(e), null;
      }
    },
    getStringFlag: async (e, r) => {
      try {
        return await c.getStringFlag(t, e.toLowerCase(), r);
      } catch (e) {
        return n.isDebugMode && console.debug(e), null;
      }
    },
    getBooleanFlag: async (e, r) => {
      try {
        return await c.getBooleanFlag(t, e.toLowerCase(), r);
      } catch (e) {
        return n.isDebugMode && console.debug(e), null;
      }
    },
    getIntegerFlag: async (e, r) => {
      try {
        return await c.getIntegerFlag(t, e.toLowerCase(), r);
      } catch (e) {
        return n.isDebugMode && console.debug(e), null;
      }
    },
    getToken: async () => {
      try {
        return await c.getToken(t);
      } catch (e) {
        return n.isDebugMode && console.debug(e), null;
      }
    },
    getUser: async () => {
      try {
        return await c.getUser(t);
      } catch (e) {
        return (
          "Cannot get user details, no authentication credential found" !==
            e.message &&
            n.isDebugMode &&
            console.debug(e),
          null
        );
      }
    },
    getUserProfile: async () => {
      try {
        return await c.getUserProfile(t);
      } catch (e) {
        return n.isDebugMode && console.debug(e), null;
      }
    },
    getUserOrganizations: async () => {
      try {
        return await c.getUserOrganizations(t);
      } catch (e) {
        return n.isDebugMode && console.debug(e), { orgCodes: [] };
      }
    },
    isAuthenticated: async () => {
      try {
        return await c.isAuthenticated(t);
      } catch (e) {
        return n.isDebugMode && console.debug(e), !1;
      }
    },
    refreshTokens: o,
  };
}),
  (exports.handleAuth = async (r, o, a) => {
    const { sessionManager: u, cookies: l } = await s(r);
    switch (o) {
      case "login":
        return (async () => {
          const { searchParams: e } = new URL(r.url),
            n = await c.login(u, { authUrlParams: Object.fromEntries(e) }),
            s = e.get("returnTo");
          s && l.set("post_login_redirect_url", s);
          const o = i(r, l);
          return t.redirect(n.toString(), { headers: o });
        })();
      case "register":
        return (async () => {
          const { searchParams: e } = new URL(r.url),
            n = await c.register(u, { authUrlParams: Object.fromEntries(e) }),
            s = e.get("returnTo");
          s && l.set("post_login_redirect_url", s);
          const o = i(r, l);
          return t.redirect(n.toString(), { headers: o });
        })();
      case "callback":
        return (async () => {
          await c.handleRedirectToApp(u, new URL(r.url));
          const e = await u.getSessionItem("post_login_redirect_url");
          e && u.removeSessionItem("post_login_redirect_url");
          const s =
              e ||
              n.postLoginRedirectUrl ||
              "Set your post login redirect URL in your environment variables.",
            o = i(r, l),
            g = await c.getUser(u);
          return (
            a?.onRedirectCallback?.({ user: g }),
            t.redirect(s.toString(), { headers: o })
          );
        })();
      case "logout":
        return (async () => {
          const e = await c.logout(u),
            n = i(r, l);
          return t.redirect(e.toString(), { headers: n });
        })();
      case "health":
        return (async () =>
          t.json({
            siteUrl: n.siteUrl,
            issuerURL: n.issuerURL,
            clientID: n.clientId,
            clientSecret: e.validateClientSecret(n.clientSecret || "")
              ? "Set correctly"
              : "Not set correctly",
            postLogoutRedirectUrl: n.postLogoutRedirectUrl,
            postLoginRedirectUrl: n.postLoginRedirectUrl,
            audience: n.audience,
            cookieMaxAge: n.cookieMaxAge,
          }))();
    }
  });
