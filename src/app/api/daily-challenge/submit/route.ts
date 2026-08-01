import { NextResponse } from "next/server";
import { supabase } from "../../../../../lib/supabase";

export async function POST(request: Request) {
  try {
    const { nickname, score, streak, date } = await request.json();

    if (!nickname || typeof nickname !== "string" || nickname.trim().length === 0) {
      return NextResponse.json({ error: "Invalid nickname" }, { status: 400 });
    }

    if (typeof score !== "number" || score < 0) {
      return NextResponse.json({ error: "Invalid score" }, { status: 400 });
    }

    if (typeof streak !== "number" || streak < 0) {
      return NextResponse.json({ error: "Invalid streak" }, { status: 400 });
    }

    if (!date || typeof date !== "string") {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }

    // Sanitize nickname: whitespace trimming, 15-character limit, script-tag/HTML stripping
    let sanitizedNickname = nickname.trim();
    if (sanitizedNickname.length > 15) {
      sanitizedNickname = sanitizedNickname.substring(0, 15);
    }
    sanitizedNickname = sanitizedNickname.replace(/<[^>]*>/g, ""); // Strip basic HTML tags

    if (sanitizedNickname.length === 0) {
      sanitizedNickname = "Survivor";
    }

    const { data, error } = await supabase
      .from("daily_leaderboard")
      .insert({
        nickname: sanitizedNickname,
        score,
        streak,
        date
      })
      .select("id")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      submittedId: data?.id || null,
      nickname: sanitizedNickname
    });
  } catch (error) {
    console.error("Error submitting daily challenge score:", error);
    return NextResponse.json({ error: "Failed to submit score" }, { status: 500 });
  }
}
