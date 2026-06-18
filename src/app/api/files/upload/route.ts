// src/app/api/files/upload/route.ts
// POST /files/upload → subir archivo (multipart/form-data)
// El helper detecta el Content-Type multipart y reenvía el FormData
// sin sobreescribir el boundary, que es requerido por multer en el backend.
 
import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/proxy";
 
export async function POST(req: NextRequest) {
  return proxyToBackend({
    backendPath: "/files/upload",
    method: "POST",
    req,
  });
}
 