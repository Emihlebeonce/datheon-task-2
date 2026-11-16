# Vulnerability Report - BOLA in Candidates API

**Project:** datheon-task-2
**Severity:** HIGH
**Type:** BOLA (Broken Object Level Authorization)
**Status:** FIXED

## 1. Summary
The Candidates API did not verify ownership before returning a candidate. Any authenticated user could access another user's candidate by changing the `id` in the URL.

## 2. Affected Endpoint
GET /api/candidates/[id]

## 3. Steps to Reproduce
1. Login as User A
2. GET /api/candidates/123 -> 200 OK (Own data)
3. GET /api/candidates/124 -> 200 OK (User B's data - VULNERABLE)
4. Expected: GET /api/candidates/124 -> 403 Forbidden

## 4. Root Cause
The API only checked authentication, not authorization for that specific object.

Vulnerable Code:
const candidate = await prisma.candidate.findUnique({ where: { id: params.id } });
return NextResponse.json(candidate);

## 5. Impact
Exposure of sensitive candidate data, privacy violation, unauthorized access to other users records.

## 6. Fix Applied - Full Code
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const candidate = await prisma.candidate.findUnique({ where: { id: params.id } });
  if (!candidate) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  // BOLA FIX: Verify ownership
  if (candidate.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json(candidate);
}

## 7. Verification After Fix
GET /api/candidates/123 as Owner -> 200 OK
GET /api/candidates/124 as Non-Owner -> 403 Forbidden
GET /api/candidates/999 -> 404 Not Found
No session -> 401 Unauthorized

## 8. Conclusion
BOLA fixed by enforcing Object Level Authorization on every candidate request.
