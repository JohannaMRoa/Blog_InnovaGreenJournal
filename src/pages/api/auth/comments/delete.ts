export const prerender = false;

import type { APIRoute } from "astro";
import { supabase } from "../../../../lib/supabase";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const id = formData.get("id")?.toString();
  const postId = formData.get("post_id")?.toString();

  const accessToken = cookies.get("sb-access-token")?.value;
  if (!accessToken || !id || !postId) return redirect("/signin");

  const { data: userData } = await supabase.auth.getUser(accessToken);
  const user = userData.user;
  if (!user) return redirect("/signin");

  const { error } = await supabase
    .from("Comment")
    .delete()
    .eq("id", Number(id))
    .eq("user_id", user.id);

  if (error) return new Response(error.message, { status: 400 });

  return redirect(`/posts/${postId}`);
};
