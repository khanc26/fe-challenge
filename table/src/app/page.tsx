"use client";

import ThemeToggle from "@/components/layout/theme-toggle";
import UserDataTable from "@/components/layout/user/user-data-table";
import { TUser } from "@/interfaces/User";
import userColumns from "@/types/user/user-columns";
import { generateUserData } from "@/types/user/user-seeding";

const users: TUser[] = generateUserData();

export default function Home() {
  return (
    <div className="w-full px-8 md:px-20 my-8">
      <div className="flex flex-row justify-end">
        <ThemeToggle />
      </div>

      <UserDataTable
        data={users}
        columns={userColumns}
        className="w-full text-xs md:text-sm lg:text-base"
      />
    </div>
  );
}
