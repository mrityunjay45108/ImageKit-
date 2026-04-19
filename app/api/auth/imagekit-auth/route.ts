// app/api/auth/imagekit-auth/route.ts
import { getUploadAuthParams } from "@imagekit/next/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Manually pass the keys if the auto-lookup fails in your dev environment
    const authParams = getUploadAuthParams({
        publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
        privateKey: process.env.PRIVATE_KEY!,
    }); 
    
    return NextResponse.json(authParams);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to generate auth params" }, 
      { status: 500 }
    );
  }
}