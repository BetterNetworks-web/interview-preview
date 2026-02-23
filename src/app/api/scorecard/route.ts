import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Cookie: (await cookies()).toString(),
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { interview, scorecard } = body;

    if (!interview || !scorecard) {
      return NextResponse.json(
        { error: "Missing interview or scorecard data" },
        { status: 400 }
      );
    }

    // Insert interview
    const { data: interviewRow, error: interviewError } = await supabase
      .from("interviews")
      .insert({
        user_id: user.id,
        role: interview.role,
        job_description: interview.job_description || null,
        cv_summary: interview.cv_summary || null,
        weak_area: interview.weak_area || null,
        difficulty: interview.difficulty || "realistic",
        questions: interview.questions || [],
        answers: interview.answers || [],
      })
      .select("id")
      .single();

    if (interviewError) {
      console.error("Failed to insert interview:", interviewError);
      return NextResponse.json(
        { error: "Failed to save interview" },
        { status: 500 }
      );
    }

    // Insert scorecard
    const { error: scorecardError } = await supabase
      .from("scorecards")
      .insert({
        interview_id: interviewRow.id,
        user_id: user.id,
        overall_score: scorecard.overall_score,
        verdict: scorecard.verdict || null,
        dimensions: scorecard.dimensions || null,
        one_thing_to_fix: scorecard.one_thing_to_fix || null,
        question_breakdown: scorecard.question_breakdown || null,
      });

    if (scorecardError) {
      console.error("Failed to insert scorecard:", scorecardError);
      return NextResponse.json(
        { error: "Failed to save scorecard" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, interviewId: interviewRow.id });
  } catch (error) {
    console.error("Scorecard API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
