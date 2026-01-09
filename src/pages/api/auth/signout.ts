export const prerender = false;

import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ cookies, redirect }) => {


    cookies.delete("sb-access-token", { path: "/" });
    cookies.delete("sb-refresh-token", { path: "/" });


    // Redirect the user to the "/signin" page after logout. 
    return redirect ("/signin");
};