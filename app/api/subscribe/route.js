import { supabase } from "../../../lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req) {
  const formData = await req.formData();
  const email = formData.get("email");
  if (email) {
    await supabase.from("subscribers").insert({ email }).select();
  }
  return NextResponse.redirect(new URL("/?subscribed=1", req.url));
}
