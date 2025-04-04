"use server";

export default async function generateUsers() {
  const res = await fetch("http://localhost:3000/api/generate-users", {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }

  const data = await res.json();

  return data;
}
