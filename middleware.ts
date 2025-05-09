import {
  withApiAuthRequired,
} from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";

export default withMiddlewareAuthRequired(async function middleware(req) {
  const res = NextResponse.next();
  const user = await auth0.getSession(req, res);
  return res;
});

export { auth as middleware } from "@/auth";
