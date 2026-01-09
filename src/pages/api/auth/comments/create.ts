export const prerender = false;

import type { APIRoute } from "astro";
import { supabase } from "../../../../lib/supabase";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const postId = formData.get("post_id")?.toString();
  const content = formData.get("content")?.toString();

  const accessToken = cookies.get("sb-access-token")?.value;
  if (!accessToken || !postId || !content) return redirect("/signin");

  const { data: userData } = await supabase.auth.getUser(accessToken);
  const user = userData.user;
  if (!user) return redirect("/signin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  const { error } = await supabase.from("Comment").insert({
    post_id: Number(postId),
    user_id: user.id,
    author_name: profile?.username ?? "user",
    content,
  });

  if (error) return new Response(error.message, { status: 400 });

  return redirect(`/posts/${postId}`);
};