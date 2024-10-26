import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../supabaseClient";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    console.log("Received payload:", payload);

    const id = payload.id;
    const email = payload.email_addresses?.[0]?.email_address || null;
    const fullName = `${payload.first_name || ""} ${
      payload.last_name || ""
    }`.trim();
    const imageUrl = payload.image_url || null;

    // Supabaseにデータを挿入
    const { error } = await supabase
      .from("profiles_v2")
      .upsert({ id, name: fullName, avatar_url: imageUrl, email });

    if (error) {
      console.error("Error inserting data:", error);
      return NextResponse.json(
        { error: "Error inserting data" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "User profile updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
