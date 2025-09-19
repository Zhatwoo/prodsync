// src/app/api/users/route.js
import { NextResponse } from "next/server";
import { dbAdmin } from "../../lib/firebaseAdmin";

export async function GET() {
  try {
    const snapshot = await dbAdmin.collection("users").get();
    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
