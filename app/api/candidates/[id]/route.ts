import { NextResponse } from 'next/server';

const candidates = [
  { id: 1, name: 'Thando Dube', email: 'thando@example.com', ownerEmail: 'thando@example.com' },
  { id: 2, name: 'Naledi Moyo', email: 'naledi@example.com', ownerEmail: 'naledi@example.com' },
];

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const userEmail = request.headers.get('x-user-email');

  if (!userEmail) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  const candidateId = Number(id);

  const candidate = candidates.find(
    (c) => c.id === candidateId && c.ownerEmail === userEmail
  );

  if (!candidate) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(candidate, { status: 200 });
}
