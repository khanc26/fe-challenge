import { TUser } from "@/interfaces/User";

// app/userData.ts
export const generateId = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Function to generate user data asynchronously
export const generateUserData = (): TUser[] => {
  const firstNames = ["John", "Jane", "Alex", "Emily", "Chris", "Sarah"];
  const lastNames = ["Smith", "Doe", "Johnson", "Brown", "Taylor"];

  const generateEmail = (name: string) => {
    const domains = ["gmail.com", "yahoo.com"];
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    return `${name.toLowerCase().replace(" ", ".")}${Math.floor(
      Math.random() * 100
    )}@${randomDomain}`;
  };

  const generateRandomDate = () => {
    const start = new Date();
    start.setFullYear(start.getFullYear() - 2);
    const end = new Date();
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  };

  const users = Array.from({ length: 100 }, () => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${firstName} ${lastName}`;
    return {
      id: generateId(),
      name: fullName,
      balance: Math.floor(Math.random() * 10000) + 100,
      email: generateEmail(fullName),
      registerAt: generateRandomDate(),
      active: Math.random() > 0.2,
    };
  });

  return users;
};
