import { NextRequest, NextResponse } from "next/server";
import getAnthropicClient from "@/lib/anthropic";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "generate_questions") {
      return await generateQuestions(body);
    } else if (action === "evaluate") {
      return await evaluateInterview(body);
    } else if (action === "follow_up") {
      return await generateFollowUp(body);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Interview API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function generateQuestions(body: {
  role: string;
  jobDescription: string;
  cvSummary: string;
  weakArea: string;
  interviewType?: string;
  difficulty: string;
}) {
  const { role, jobDescription, cvSummary, weakArea, interviewType, difficulty } = body;

  const difficultyInstruction = {
    comfortable:
      "Ask clear, straightforward questions. Be supportive in framing. Avoid trick questions or heavy pressure.",
    realistic:
      "Ask questions that reflect a standard professional interview. Include a mix of behavioural and situational questions with moderate depth.",
    hard: "Ask probing, detailed questions. Include questions that require specific examples and numbers. At least 2 questions should be designed to expose weak areas.",
    brutal:
      "Ask the hardest possible questions for this role. Include questions designed to expose gaps, test under pressure, and require extremely specific answers. Every question should be challenging.",
  }[difficulty];

  const interviewTypeInstruction = {
    general: "",
    behavioral:
      "Focus at least 6 of 8 questions on behavioural format ('Tell me about a time...'). Expect STAR-method answers.",
    technical:
      "Focus at least 6 of 8 questions on technical depth, domain knowledge, and problem-solving for this role.",
    situational:
      "Focus at least 6 of 8 questions on hypothetical scenarios ('How would you handle...').",
    case_study:
      "Structure the interview as a progressive case study. Present a business problem and ask the candidate to work through it step by step across the 8 questions.",
  }[interviewType || "general"] || "";

  const message = await getAnthropicClient().messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: `Generate interview questions based on the following details.

Role: ${role}
Job Description: ${jobDescription}
Candidate Experience: ${cvSummary}
Self-identified Weak Area: ${weakArea}
Difficulty: ${difficulty}

${difficultyInstruction}
${interviewTypeInstruction ? `\n${interviewTypeInstruction}\n` : ""}
Generate exactly 8 interview questions as a JSON array. Questions should be a mix of:
- Behavioural ("Tell me about a time...")
- Situational ("How would you handle...")
- Role-specific technical or strategic questions
- At least one question must directly target the weak area: "${weakArea}"

Return ONLY valid JSON in this exact format, no other text:
{"questions": ["question1", "question2", "question3", "question4", "question5", "question6", "question7", "question8"]}`,
      },
    ],
    system:
      "You are a senior interviewer at a highly competitive company. You have conducted thousands of interviews and know exactly which questions separate strong candidates from average ones. Your job is to generate realistic, probing interview questions tailored to the specific role and candidate. Never generate generic questions — every question should feel like it was written for this specific interview.",
  });

  const content = message.content[0];
  if (content.type !== "text") {
    return NextResponse.json(
      { error: "Unexpected response" },
      { status: 500 }
    );
  }

  try {
    const parsed = JSON.parse(content.text);
    return NextResponse.json(parsed);
  } catch {
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return NextResponse.json(JSON.parse(jsonMatch[0]));
    }
    return NextResponse.json(
      { error: "Failed to parse questions" },
      { status: 500 }
    );
  }
}

async function evaluateInterview(body: {
  role: string;
  jobDescription: string;
  cvSummary: string;
  weakArea: string;
  difficulty: string;
  questions: string[];
  answers: string[];
}) {
  const { role, jobDescription, cvSummary, weakArea, difficulty, questions, answers } =
    body;

  const transcript = questions
    .map(
      (q: string, i: number) =>
        `Question ${i + 1}: ${q}\nAnswer ${i + 1}: ${answers[i] || "[No answer provided]"}`
    )
    .join("\n\n");

  const message = await getAnthropicClient().messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    messages: [
      {
        role: "user",
        content: `Evaluate this interview transcript.

Role: ${role}
Job Description: ${jobDescription}
Candidate Experience: ${cvSummary}
Self-identified Weak Area: ${weakArea}
Difficulty: ${difficulty}

TRANSCRIPT:
${transcript}

Evaluate the candidate honestly. An average answer should score 55-65, not 80. Reserve 80+ for genuinely strong answers with specific examples, numbers, and clear strategic thinking.

For each question, also include a "tip" field: a 2-3 sentence coaching insight that teaches the candidate HOW to answer this type of question better. Reference a specific framework or technique (like STAR, the Pyramid Principle, or structured problem-solving). Make it educational, not just critical.

Return ONLY valid JSON in this exact format:
{
  "overall_score": <0-100>,
  "verdict": "<one line summary of candidate performance>",
  "dimensions": {
    "evidence_specificity": {"score": <0-100>, "feedback": "<2-3 sentences referencing specific things they said>"},
    "handling_pressure": {"score": <0-100>, "feedback": "<2-3 sentences referencing specific things they said>"},
    "self_awareness": {"score": <0-100>, "feedback": "<2-3 sentences referencing specific things they said>"},
    "strategic_thinking": {"score": <0-100>, "feedback": "<2-3 sentences referencing specific things they said>"}
  },
  "one_thing_to_fix": "<single specific actionable sentence — the most important improvement>",
  "fix_explanation": "<3-4 sentence explanation of WHY this matters and HOW to practice it>",
  "question_breakdown": [
    {"question": "<question text>", "answer_summary": "<1-2 sentence summary of their answer>", "score": <0-100>, "note": "<one sentence of specific feedback>", "tip": "<2-3 sentence coaching tip for this question type>"}
  ]
}`,
      },
    ],
    system:
      "You are a brutally honest interview evaluator. You have no interest in flattering candidates — your job is to give them accurate, specific feedback that will genuinely help them improve. Reference specific things they said in their answers. Never give generic advice. Score honestly: most answers are 55-65, weak answers are 30-50, and only genuinely impressive answers with concrete examples and strategic depth earn 75+. The feedback should feel like it was written by someone who carefully read every word of their responses.",
  });

  const content = message.content[0];
  if (content.type !== "text") {
    return NextResponse.json(
      { error: "Unexpected response" },
      { status: 500 }
    );
  }

  try {
    const parsed = JSON.parse(content.text);
    return NextResponse.json(parsed);
  } catch {
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return NextResponse.json(JSON.parse(jsonMatch[0]));
    }
    return NextResponse.json(
      { error: "Failed to parse evaluation" },
      { status: 500 }
    );
  }
}

async function generateFollowUp(body: {
  question: string;
  answer: string;
  difficulty: string;
}) {
  const { question, answer, difficulty } = body;

  const pressureLevel =
    difficulty === "brutal"
      ? "Be very aggressive. Challenge vague statements, ask for specific numbers, dates, and outcomes. Do not accept generalities."
      : "Be moderately challenging. If the answer is vague or lacks specifics, probe further. If the answer is solid, you may skip the follow-up.";

  const message = await getAnthropicClient().messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: `Original question: ${question}
Candidate's answer: ${answer}

${pressureLevel}

Decide whether a follow-up question is warranted. If the answer is vague, incomplete, or deflective, generate a pointed follow-up. If the answer is specific and complete, return null.

Return ONLY valid JSON:
{"follow_up": "<follow-up question or null>"}`,
      },
    ],
    system:
      "You are a senior interviewer deciding whether to probe deeper on a candidate's answer. You are looking for specificity, real examples, and clarity. Vague or rehearsed-sounding answers should always get a follow-up.",
  });

  const content = message.content[0];
  if (content.type !== "text") {
    return NextResponse.json({ follow_up: null });
  }

  try {
    const parsed = JSON.parse(content.text);
    return NextResponse.json(parsed);
  } catch {
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return NextResponse.json(JSON.parse(jsonMatch[0]));
    }
    return NextResponse.json({ follow_up: null });
  }
}
