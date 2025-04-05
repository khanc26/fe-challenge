import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { TUser } from "@/interfaces/User";

export async function GET(req: Request) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const { searchParams } = new URL(req.url);
  const sort = searchParams.get("sort");
  const order = searchParams.get("order") || "asc";
  const filter = searchParams.get("filter") || "";
  const filterVal = searchParams.get("filterVal") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("perPage") || "10", 10);

  const filePath = path.join(process.cwd(), "public", "users.json");

  try {
    const usersData = fs.readFileSync(filePath, "utf-8");
    const rawUsers: TUser[] = JSON.parse(usersData);

    let processedUsers = [...rawUsers];

    // Filter logic
    if (filter && filterVal) {
      processedUsers = processedUsers.filter((col: TUser) => {
        if (filter in col) {
          const columnValue = String(col[filter as keyof TUser]);
          const filterValue = String(filterVal);

          return columnValue.toLowerCase().includes(filterValue.toLowerCase());
        }
        return false;
      });
    }
    
    // Sort logic
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

    // Pagination logic
    const start = (page - 1) * perPage;
    const paginatedUsers = processedUsers.slice(start, start + perPage);

    // throw Error();

    return NextResponse.json({
      total: processedUsers.length,
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
