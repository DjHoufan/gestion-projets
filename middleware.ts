
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "./routes";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { nextUrl, headers, cookies: reqCookies } = request;

  const response = NextResponse.next({ request: { headers } });

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () =>
          reqCookies.getAll().map(({ name, value }) => ({ name, value })),
        setAll: (cookies) =>
          cookies.forEach((cookie) => response.cookies.set(cookie)),
      },
    }
  );

  // Vérifie la présence du token custom
  const token = (await cookies()).get(process.env.AUTH_COOKIE_ACCESS!);
  if (!token) await supabase.auth.signOut();

 
  

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Route API auth ne nécessite aucune vérification supplémentaire
  if (isApiAuthRoute) return response;

  // if (isAdminRoute && user?.user_metadata?.role === "user") {
  //   return NextResponse.redirect(new URL("/dashboard", nextUrl));
  // }

  if (isAuthRoute) {
    if (user) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return response;
  }

  if (user) {
    const { pathname } = nextUrl;
    const [, firstPath = ""] = pathname.split("/");
    const { type, access = [] } = user.user_metadata ?? {};

 

    const isApiPath = firstPath === "api";

    // Redirection pour les accompagnateurs (type === "accompanist")
    if (type === "accompanist") {
      const isAccompanistPath = firstPath === "accompagnateur";
      if (!isAccompanistPath && !isApiPath) {
        return NextResponse.redirect(new URL("/accompagnateur", nextUrl));
      }
      return response;
    }
    if (type === "trainer") {
      const isAccompanistPath =
        firstPath === "formateur" || firstPath === "mon_profile";
      if (!isAccompanistPath && !isApiPath) {
        return NextResponse.redirect(new URL("/formateur", nextUrl));
      }
      return response;
    }
    // Redirection pour les utilisateurs "employe" sans accès (hors /dashboard ou /api)
    const isProtectedPath = firstPath !== "" && !isApiPath;
    const hasNoAccess =
      type === "employe" &&
      isProtectedPath &&
      !access.some((item: string) => item.split("|")[0].trim() === firstPath);

    if (hasNoAccess) {
      return NextResponse.redirect(new URL("/", nextUrl));
    }

    return response;
  }

  if (!user && !isPublicRoute) {
    return Response.redirect(new URL(`/authentification`, nextUrl));
  }

  return response;
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};


/*
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "./routes";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { nextUrl, headers, cookies: reqCookies, method } = request;

  // 🎯 Gestion CORS (préflight OPTIONS + API calls)
  if (nextUrl.pathname.startsWith("/api")) {
    const origin = request.headers.get("origin") || "";
    const allowedOrigins = [
      "http://localhost:3000",
      "http://192.168.3.84:3000",
    ];

    if (method === "OPTIONS") {
      return new NextResponse(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": allowedOrigins.includes(origin)
            ? origin
            : allowedOrigins[0],
          "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    // Réponse normale mais avec headers CORS
    const res = NextResponse.next();
    res.headers.set(
      "Access-Control-Allow-Origin",
      allowedOrigins.includes(origin) ? origin : allowedOrigins[0]
    );
    res.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    return res;
  }

  // ---------------------
  // 🔽 Ton code d’auth actuel
  // ---------------------
  const response = NextResponse.next({ request: { headers } });

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () =>
          reqCookies.getAll().map(({ name, value }) => ({ name, value })),
        setAll: (cookies) =>
          cookies.forEach((cookie) => response.cookies.set(cookie)),
      },
    }
  );

  // Vérifie la présence du token custom
  const token = (await cookies()).get(process.env.AUTH_COOKIE_ACCESS!);
  if (!token) await supabase.auth.signOut();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isApiAuthRoute) return response;

  if (isAuthRoute) {
    if (user) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return response;
  }

  if (user) {
    const { pathname } = nextUrl;
    const [, firstPath = ""] = pathname.split("/");
    const { type, access = [] } = user.user_metadata ?? {};

    const isApiPath = firstPath === "api";

    if (type === "accompanist") {
      const isAccompanistPath = firstPath === "accompagnateur";
      if (!isAccompanistPath && !isApiPath) {
        return NextResponse.redirect(new URL("/accompagnateur", nextUrl));
      }
      return response;
    }
    if (type === "trainer") {
      const isAccompanistPath =
        firstPath === "formateur" || firstPath === "mon_profile";
      if (!isAccompanistPath && !isApiPath) {
        return NextResponse.redirect(new URL("/formateur", nextUrl));
      }
      return response;
    }

    const isProtectedPath = firstPath !== "" && !isApiPath;
    const hasNoAccess =
      type === "employe" &&
      isProtectedPath &&
      !access.some((item: string) => item.split("|")[0].trim() === firstPath);

    if (hasNoAccess) {
      return NextResponse.redirect(new URL("/", nextUrl));
    }

    return response;
  }

  if (!user && !isPublicRoute) {
    return Response.redirect(new URL(`/authentification`, nextUrl));
  }

  return response;
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};



*/