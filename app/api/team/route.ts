// OUTOFSCOPE: Team data for MVP portfolio (1.2 out-of-scope)
// FUTURE: Revisit when enabling auth/multi-user scenarios
import { getTeamForUser } from "@/lib/db/queries";

export async function GET() {
  const team = await getTeamForUser();
  return Response.json(team);
}
