import { NextResponse } from "next/server";
import { supabase } from "../../../../../lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date || typeof date !== "string") {
      return NextResponse.json({ error: "Invalid date parameter" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("daily_leaderboard")
      .select("id, nickname, score, streak, date")
      .eq("date", date)
      .order("score", { ascending: false })
      .limit(10);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      leaderboard: data || []
    });
  } catch (error) {
    console.error("Error fetching daily leaderboard:", error);
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}
