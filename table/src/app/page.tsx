// app/page.tsx
import { fetchUsers } from "@/actions/users/fetch-users";
import ThemeToggle from "@/components/layout/theme-toggle"; // client component
import DataTable from "@/components/ui/table/data-table"; // client component
import { TUser } from "@/interfaces/User";
import userColumns from "@/types/user/user-columns";
import { redirect } from "next/navigation";

type GetAllUsersResponse = {
  total: number;
  users: TUser[];
};

type SearchParams = {
  sort?: string;
  order?: string;
  page?: string;
  perPage?: string;
};

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolvedSearchParams = await searchParams;

  const sort = resolvedSearchParams.sort || "name";
  const order = resolvedSearchParams.order || "asc";
  const page = parseInt(resolvedSearchParams.page || "1", 10);
  const perPage =
    resolvedSearchParams.perPage !== "all"
      ? parseInt(resolvedSearchParams.perPage || "10", 10)
      : "all";

  const result: GetAllUsersResponse = await fetchUsers({
    sort,
    order,
    page,
    perPage,
  });

  if (!result) {
    redirect("/error"); // hoặc render fallback error UI
  }

  return (
    <div className="w-full px-8 md:px-20 my-8">
      <div className="flex flex-row justify-end">
        <ThemeToggle />
      </div>

      <DataTable
        totalItems={result.total}
        data={result.users}
        columns={userColumns}
        className="w-full text-xs md:text-sm lg:text-base"
      />
    </div>
  );
}
