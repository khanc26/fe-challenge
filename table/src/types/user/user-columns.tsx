"use client";

import StatusBadge from "@/components/ui/status-badge";
import { ColumnRef } from "@/core/table/type";
import { TUser } from "@/interfaces/User";
import { formatCurrency, formatDateToYYYYMMDD } from "@/utils/date-convert";
import { Pencil, Trash } from "lucide-react";

const userColumns: ColumnRef<TUser & { action?: React.ReactNode }>[] = [
  {
    key: "name",
    header: "Name",
    assessor: (row: TUser) => {
      return row.name;
    },
    description: "Name of user",
    enableSorting: true,
    enableFiltering: false,
  },
  {
    key: "balance",
    header: "Balance ($)",
    assessor: (row: TUser) => {
      return formatCurrency(row.balance);
    },
    description: "Account balance of user",
    enableSorting: true,
    enableFiltering: false,
  },
  {
    key: "email",
    header: "Email",
    assessor: (row: TUser) => {
      return <a href={"mailto:" + row.email}>{row.email}</a>;
    },
    description: "Email of user",
    enableSorting: true,
    enableFiltering: false,
  },
  {
    key: "registerAt",
    header: "Registration",
    assessor: (row: TUser) => {
      return (
        <div title={row.registerAt.toISOString()}>
          {formatDateToYYYYMMDD(row.registerAt)}
        </div>
      );
    },
    description: "Date that user is registed",
    enableSorting: false,
    enableFiltering: false,
  },
  {
    key: "active",
    header: "Status",
    assessor: (row: TUser) => {
      return <StatusBadge active={row.active} />;
    },
    description: "Active status of user: active, dis-active",
    enableSorting: false,
    enableFiltering: false,
  },

  {
    key: "action",
    header: "Action",
    assessor: (row: TUser) => {
      return (
        <div className="flex flex-row gap-1">
          <button
            className="hover:cursor-pointer"
            onClick={() => alert("Edit " + row.name)}
          >
            <Pencil size="1.5em" />
          </button>
          <button
            className="hover:cursor-pointer"
            onClick={() => alert("Delete " + row.name)}
          >
            <Trash size="1.5em" />
          </button>
        </div>
      );
    },
    description: "Action for row",
    enableSorting: false,
    enableFiltering: false,
  },
];

export default userColumns;
