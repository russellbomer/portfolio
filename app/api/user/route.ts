// OUTOFSCOPE: Authenticated user endpoint for MVP (1.2 out-of-scope)
// FUTURE: Enable when authentication milestone begins
import { getUser } from "@/lib/db/queries";

export async function GET() {
  const user = await getUser();
  return Response.json(user);
}
