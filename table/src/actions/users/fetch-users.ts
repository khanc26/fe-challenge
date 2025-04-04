"use server";

import { TUser } from "@/interfaces/User";

const convertRawUserToTUser = (rawUser: TUser): TUser => ({
  ...rawUser,
  registerAt: new Date(rawUser.registerAt),
});

type FetchUsersInput = {
  sort?: string;
  order?: string;
  page?: number;
  perPage?: number | "all";
};

export async function fetchUsers({
  sort,
  order,
  page = 1,
  perPage,
}: FetchUsersInput) {
  const res = await fetch(
    `http://localhost:3000/api/users?sort=${sort}&order=${order}&page=${page}&perPage=${perPage}`
  );

  const rawData: { total: number; users: TUser[] } = await res.json();
  const convertedUsers = rawData.users.map(convertRawUserToTUser);

  return {
    total: rawData.total,
    users: convertedUsers,
  };
}
