export const prerender = false;

import type { APIRoute } from "astro";
import { supabase } from "../../../../lib/supabase";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const id = formData.get("id")?.toString();

  const accessToken = cookies.get("sb-access-token")?.value;
  if (!accessToken || !id) return redirect("/signin");

  const { data: userData, error: userError } = await supabase.auth.getUser(accessToken);
  const user = userData.user;
  if (userError || !user) return redirect("/signin");

  const { error } = await supabase
    .from("Post")
    .delete()
    .eq("id", Number(id))
    .eq("user_id", user.id);

  if (error) {
    console.log("DELETE ERROR:", error);
    return new Response(error.message, { status: 400 });
  }

  return redirect("/myposts");
};
