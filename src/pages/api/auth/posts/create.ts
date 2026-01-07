export const prerender = true;

import type { APIRoute } from "astro";
import { supabase } from "../../../../lib/supabase";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  try {
    const formData = await request.formData();
    const title = formData.get("title")?.toString().trim();
    const content = formData.get("content")?.toString().trim();

    if (!title || !content) {
      return new Response("Missing title or content", { status: 400 });
    }

    const accessToken = cookies.get("sb-access-token")?.value;
    if (!accessToken) {
      return redirect("/signin");
    }


    const { data: userData, error: userError } = await supabase.auth.getUser(accessToken);

    if (userError || !userData?.user) {
      console.log("getUser error:", userError);
      return redirect("/signin");
    }

    const user = userData.user;


    const { error: insertError } = await supabase.from("Post").insert({
      title,
      content,
      user_id: user.id,
      author_name: user.email,
    });

    if (insertError) {
      console.log("Insert error:", insertError);
      return new Response(insertError.message, { status: 500 });
    }

    return redirect("/posts");
  } catch (err) {
    console.log("Create post crash:", err);
    return new Response("Server error creating post", { status: 500 });
  }
};
