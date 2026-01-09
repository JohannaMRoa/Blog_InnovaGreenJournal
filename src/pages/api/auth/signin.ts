import type { APIRoute } from "astro";
import { supabase } from"../../../lib/supabase";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
    const formData = await request.formData();
    const email = formData.get ("email")?.toString();
    const password = formData.get ("password")?.toString();

    if (!email || !password) {
        return new Response("Email and password are required", { status: 400 });

    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    // Real error from Supabase

    if (error) {
        console.log('Supabase error:', error );
        return new Response(error.message, { status: 400 });

    }

    // Session is null (e.g., unconfirmed email)
    if (!data.session) {
        console.log('Session is null:', data);
        return new Response("Login successful, but email confirmation is required.", {
            status: 401,
        });
    };
    
    // Session exists: store tokens
    const { access_token, refresh_token } = data.session;
    cookies.set("sb-access-token", access_token, {
    path: "/", httpOnly: true, sameSite: "lax", secure: import.meta.env.PROD,
});

    cookies.set("sb-refresh-token", refresh_token, { path: "/", httpOnly: true, sameSite: "lax",
    secure: import.meta.env.PROD,
});

    return redirect("/dashboard");

};
