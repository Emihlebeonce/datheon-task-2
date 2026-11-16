import { NextResponse } from "next/server";

type Candidate = {
  id: number;
  name: string;
  email: string;
  role: string;
};

let candidates: Candidate[] = [
  { id: 1, name: "Thando Dube", email: "thando@example.com", role: "Developer" },
  { id: 2, name: "Naledi Mokoena", email: "naledi@example.com", role: "Designer" },
];

export async function GET() {
  return NextResponse.json(candidates);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newCandidate: Candidate = {
    id: candidates.length + 1,
    name: body.name,
    email: body.email,
    role: body.role,
  };
  candidates.push(newCandidate);
  return NextResponse.json(newCandidate, { status: 201 });
}