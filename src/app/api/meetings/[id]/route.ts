// src/app/api/meetings/route.ts
// GET  /meetings → lista todas las reuniones
// POST /meetings → crea una reunión
 
import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/proxy";
 
export async function GET(req: NextRequest) {
  return proxyToBackend({
    backendPath: "/meetings",
    method: "GET",
    req,
  });
}
 
export async function POST(req: NextRequest) {
  return proxyToBackend({
    backendPath: "/meetings",
    method: "POST",
    req,
  });
}