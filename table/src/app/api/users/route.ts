import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { TUser } from "@/interfaces/User";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sort = searchParams.get("sort");
  const order = searchParams.get("order") || "asc";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPageRaw = searchParams.get("perPage");
  const perPage = perPageRaw
    ? perPageRaw === "all"
      ? "all"
      : parseInt(perPageRaw, 10)
    : "all";

  const filePath = path.join(process.cwd(), "public", "users.json");

  try {
    const usersData = fs.readFileSync(filePath, "utf-8");
    const rawUsers: TUser[] = JSON.parse(usersData);

    const processedUsers = [...rawUsers];

    if (sort) {
      processedUsers.sort((a, b) => {
        const aVal = a[sort as keyof TUser];
        const bVal = b[sort as keyof TUser];

        if (typeof aVal === "string" && typeof bVal === "string") {
          return order === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        if (typeof aVal === "number" && typeof bVal === "number") {
          return order === "asc" ? aVal - bVal : bVal - aVal;
        }

        return 0;
      });
    }

    let paginatedUsers: TUser[];

    if (perPage === "all") {
      paginatedUsers = processedUsers;
    } else {
      const start = (page - 1) * perPage;
      paginatedUsers = processedUsers.slice(start, start + perPage);
    }

    return NextResponse.json({
      total: rawUsers.length,
      users: paginatedUsers,
    });
  } catch (error) {
    console.error("Error reading users data:", error);
    return NextResponse.json(
      { message: "Error reading users data" },
      { status: 500 }
    );
  }
}
