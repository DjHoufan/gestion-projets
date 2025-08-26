/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes: string[] = [
  "authentification/",
  "/reset-password",
 
];

/**
 * An array of routes that are used for authentication
 * These routes will redirect Connecté users to /settings
 * @type {string[]}
 */
export const authRoutes: string[] = [
  "/authentification",
  "/auth/error",
  "/login",
  "/auth/accompanateur",
];

export const AdminRoutes: string[] = ["/parametres"];

export const AccompanistRoutes: string[] = ["/accompagnateur"];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix: string = "/api/auth";

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = "/";
