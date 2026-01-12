export const prerender = false;

import type { APIRoute } from "astro";
import { supabase } from "../../../../lib/supabase";


export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const username = formData.get("username")?.toString().trim();

  const accessToken = cookies.get("sb-access-token")?.value;
  const refreshToken = cookies.get("sb-refresh-token")?.value;

  if (!accessToken || !refreshToken) return redirect("/signin");
  if (!username) return new Response("Username is required", { status: 400 });

  const { data: userData, error: userErr } = await supabase.auth.getUser(accessToken);
  const user = userData.user;
  if (userErr || !user) return redirect("/signin");

  const { error } = await supabase
    .from("profiles")
    .upsert({ id: user.id, username }, { onConflict: "id" });

  if (error) return new Response(error.message, { status: 400 });

  return redirect("/dashboard");
};
