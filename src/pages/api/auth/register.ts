export const prerender = true;

import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";


export const POST: APIRoute = async ({ request, redirect }) => {   
    const formData = await request.formData();
    const username = formData.get("username")?.toString();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    
    


    if (!email || !password) {
        return new Response("Email and password are required", { status: 400 });
    }

    const { data, error } = await supabase.auth.signUp({
    email,
    password,
    });

    if (!data.user) {
    return new Response("User was created but data.user is missing.", { status: 500 });
}

    if (error) {
        return new Response(error.message, { status: 500 });
    }


    await supabase.from("profiles").insert({
        id: data.user.id,      
        username: username,   
    });


    return redirect("/signin");
};

