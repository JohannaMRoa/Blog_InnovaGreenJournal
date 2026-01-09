export const prerender = false;

import type { APIRoute } from "astro";
import { supabase } from "../../../../lib/supabase";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString();
  const content = formData.get("content")?.toString();

  const accessToken = cookies.get("sb-access-token")?.value;
  if (!accessToken || !id || !title || !content) return redirect("/signin");

  const { data: userData } = await supabase.auth.getUser(accessToken);
  const user = userData.user;
  if (!user) return redirect("/signin");

  const { error } = await supabase
    .from("Post")
    .update({ title, content })
    .eq("id", Number(id))
    .eq("user_id", user.id);

  if (error) return new Response(error.message, { status: 400 });

  return redirect("/myposts");
};
