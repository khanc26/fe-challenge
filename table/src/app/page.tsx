"use client";

import SpinnerLoadingOverlay from "@/components/layout/loading";
// app/page.tsx
import ThemeToggle from "@/components/layout/theme-toggle"; // client component
import DataTable from "@/components/ui/table/data-table"; // client component
import { TUser } from "@/interfaces/User";
import userColumns from "@/types/user/user-columns";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type GetAllUsersResponse = {
  total: number;
  users: TUser[];
};

const convertRawUserToTUser = (rawUser: TUser): TUser => ({
  ...rawUser,
  registerAt: new Date(rawUser.registerAt),
});

export default function Home() {
  const searchParams = useSearchParams();

  const sort = searchParams.get("sort") || "name";
  const order = searchParams.get("order") || "asc";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("perPage") || "10", 10);
  const filter = searchParams.get("filter") || "";
  const filterVal = searchParams.get("filterVal") || "";
  const infinite = searchParams.get("infinite") || false;

  const [data, setData] = useState<GetAllUsersResponse>({
    total: 0,
    users: [],
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();

  const fetchAndSetData = async () => {
    setErrorMessage(null);
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3000/api/users?sort=${sort}&order=${order}&page=${page}&perPage=${
          infinite ? "10" : perPage
        }&filter=${filter}&filterVal=${filterVal}`,
        { cache: "no-store" }
      );

      const responseData = await res.json();

      if (!res.ok) {
        setErrorMessage(responseData.message || "Unknown error occurred");
        return;
      }

      const rawData: { total: number; users: TUser[] } = responseData;
      const convertedUsers = rawData.users.map(convertRawUserToTUser);

      setData({
        total: rawData.total,
        users: convertedUsers,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      router.push("/error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetData();
  }, [searchParams]);

  return (
    <div className="relative w-full px-8 md:px-20 py-8">
      <div className="flex flex-row justify-end pr-2">
        <ThemeToggle />
      </div>

      <DataTable
        totalItems={data.total}
        data={data.users}
        columns={userColumns}
        className="w-full text-xs md:text-sm lg:text-base"
      />

      <div className="w-full px-2 md:px-8 my-4 text-red-800">
        {errorMessage ? errorMessage : ""}
      </div>

      <SpinnerLoadingOverlay loading={loading} />
    </div>
  );
}
