// src/app/api/users/[id]/route.ts
// GET    /users/:id  → Admin o dueño del perfil
// PUT    /users/:id  → cualquier usuario autenticado
// DELETE /users/:id  → Admin o User
 
import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/proxy";
 
type Params = { params: Promise<{ id: string }> };
 
export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;
  return proxyToBackend({
    backendPath: `/users/${id}`,
    method: "GET",
    req,
  });
}
 
export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  return proxyToBackend({
    backendPath: `/users/${id}`,
    method: "PUT",
    req,
  });
}
 
export async function DELETE(req: NextRequest, { params }: Params) {
  const { id } = await params;
  return proxyToBackend({
    backendPath: `/users/${id}`,
    method: "DELETE",
    req,
  });
}