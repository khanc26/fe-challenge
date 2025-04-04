import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { generateUserData } from "@/types/user/user-seeding";

export async function POST() {
  try {
    const users = generateUserData();

    const filePath = path.join(process.cwd(), "public", "users.json");

    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), "utf-8");

    return NextResponse.json(
      { message: "User data saved successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: `Error saving user data: ${error.message}` },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error saving user data" },
        { status: 500 }
      );
    }
  }
}
