
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

---

Or build and run with Docker

```bash
docker build -t khanc26/table .
docker run -p 3000:3000 khanc26/table
```

This will build and run the Next.js app on http://localhost:3000.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Brief of implementation

### File Structure

Below is the directory structure of the project:

```
table/
├── app/
│   ├── globals.css				 # Global CSS file
│   ├── page.tsx                 # Main page, renders ThemeToggle, DataTable, SpinnerLoadingOverlay. Read searchQuery and fetch data based on that.
│   ├── layout.tsx               # Layout file for the app
│   └── api/
│       └── users/     
│           └── route.ts		 # API endpoint for getUsers
├── components/                  # Reusable UI components
│   ├── layout/                  # Contains some components like InfiniteScrollToggle, SpinnerLoadingOverlay, ThemeToggle
│   ├── ui/                      # UI components like buttons, inputs, tables, etc.
│   │	├── table/               # Contains DataTable and all components of DataTable
│   │	│	├── data-table.tsx 			# DataTable
│   │	│	├── filter-input.tsx 		# Filter input, consist of dropdown menu for select column to filter and input to enter filter value
│   │	│	├── table-body.tsx 			# tbody with some styles
│   │	│	├── table-cell.tsx			# td with styles
│   │	│	├── table-head.tsx			# th with styles
│   │	│	├── table-header.tsx		# thead with styles
│   │	│	├── table-pagination.tsx 	# Contains Dropdown menu for select number of items per page; Previous & Next buttons and current page 
│   │	│	├── table-row.tsx 			# tr with styles
│   │	│	└──	table.tsx				# table with styles
│	│	├── dropdown.tsx		 # Simple dropdown menu
│   │	└── status-badge.tsx	 # Status badge for Status cell
├── core/                        # Contains some typescript code for table types and initial table.
│   └── table/                   # 100 dummy users data under json format
│   	├── helpers.tsx			 # Read ColumnRef of table columns and render header cells in form of custom buttons with sorting trigger
│   	└── type.ts				 # type definition for table, including ColumnRef to define properties and behaviors of column table
├── interface/                   # Contains data interfaces.
│   ├── User.ts              	 # TUser interface
│   └── ...
├── types/                       # TypeScript types and interfaces
│   ├── user/                    # User-related types
│   │	└── user-columns.tsx	 # Column configuration for displaying user data in a table with sorting, filtering, and actions.
├── utils/                       # Utility functions and helpers
│   ├── cn.ts                    # ClassName utility
│   └── date-convert.ts			 # Transform data to designated data format.
├── .gitignore                   # Git ignore file
├── dockerfile                   # Docker configuration for deployment
├── next.config.js               # Next.js configuration
├── package.json                 # NPM package file
├── tsconfig.json                # TypeScript configuration
└── README.md                    # Project documentation
```

### Some Key Features & Ideas
#### 1. State Management Through URL

``` typescript
const  searchParams  =  useSearchParams();

const  sort  =  searchParams.get("sort")  ||  "name";

const  order  =  searchParams.get("order")  ||  "asc";

const  page  =  parseInt(searchParams.get("page")  ||  "1", 10);

const res = await fetch(
        `http://localhost:3000/api/users?sort=${sort}&order=${order}&page=${page}&perPage=${
          infinite ? "10" : perPage
        }&filter=${filter}&filterVal=${filterVal}`,
        { cache: "no-store" }
      );
```
State changed are pushed to URL, whenever searchParams are changed, we will re-fetched user data.

Enabling:

-   Shareable table states

-   Browser navigation support

-   State persistence across refreshes


#### 2. Sorting, Filterting, Pagination logics are handled on server

``` typescript
const { searchParams } = new URL(req.url);
const sort = searchParams.get("sort");
const order = searchParams.get("order") || "asc";
const filter = searchParams.get("filter") || "";
const filterVal = searchParams.get("filterVal") || "";
const page = parseInt(searchParams.get("page") || "1", 10);
const perPage = parseInt(searchParams.get("perPage") || "10", 10);
```
``` typescript
const usersData = fs.readFileSync(filePath, "utf-8");
const rawUsers: TUser[] = JSON.parse(usersData);

let processedUsers = [...rawUsers];
```
``` typescript
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
```
``` typescript
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
```
``` typescript
// Pagination logic
const start = (page - 1) * perPage;
const paginatedUsers = processedUsers.slice(start, start + perPage);
```

#### 3. Dynamic column handling

Utilize Typescript generic for dynamic column handling
``` typescript
type DataTableProps<T extends WithId> = {
  data: T[];
  columns: ColumnRef<T>[];
  className?: string;
  totalItems: number;
};

export default function DataTable<T extends WithId>({
  data,
  totalItems,
  columns: rawColumns,
  className,
}: DataTableProps<T>)
```

### 4. Re-usable DataTable components

Additionally, core functionalities such as table rendering, sorting, filtering, pagination, infinite scroll toggle are defined inside DataTable, enable to re-use the DataTable for any kind of data.

``` typescript
<FilterInput
  columnList={columns.map((column) => {
    return column.key as string;
  })}
  filterColumnKey={filterColumnKey}
  setFilterColumnKey={setFilterColumnKey}
  filterValue={filterValue}
  setFilterValue={setFilterValue}
  resetTable={resetTable}
/>
<InfiniteScrollToggle
  infiniteScroll={infiniteScroll}
  toggle={() => setInfiniteScroll((prevVal) => !prevVal)}
  resetTable={resetTable}
/>
```
``` typescript
{!infiniteScroll && (
  <TablePagination
    setPerPage={setPerPage}
    setPage={setPage}
    totalItems={totalItems}
    perPage={perPage}
    page={page}
    totalPages={totalPages}
    className="text-xs md:text-sm lg:text-base"
  />
)}
```

### 5. Infinite Scroll Implementation

This code snippet sets up an `IntersectionObserver` inside a `useEffect` hook to detect when an element (e.g., the last row) enters the viewport. If the element is visible and `infiniteScroll` is enabled, it increments the `page` state by 1, triggering the loading of more data.

```typescript
useEffect(() => {
  const observerCallback = (entries: IntersectionObserverEntry[]) => {
    const entry = entries[0];
    if (entry.isIntersecting && infiniteScroll) {
      setPage((prevPage) => prevPage + 1); // Increment page to load more
    }
  };

  // Initialize IntersectionObserver
  observerRef.current = new IntersectionObserver(observerCallback, {
    rootMargin: "200px", // Trigger before it's completely in view
  });

  const lastRow = document.querySelector("#lastRow"); // Get the last row element
  if (lastRow && observerRef.current) {
    observerRef.current.observe(lastRow); // Start observing
  }

  return () => {
    if (observerRef.current && lastRow) {
      observerRef.current.unobserve(lastRow); // Clean up the observer
    }
  };
}, [dataList, infiniteScroll]);
```

### Checklist
- [x] (Completed) Details of the users are shown in a multi-page table, with defaults 10 rows per page (user can change this).
      Implementation code: `components/ui/table/table-pagination.tsx`; `types/user/user-columns.tsx`; `interface/User.ts`; API: `app/api/users/route.ts`.
- When displaying in the table:
  - [x] (Completed) Balance should have a thousand separator and be preceded by a ”$” sign.
``` typescript
// utils/data-convert.ts

export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
``` 
``` typescript
// types/user/user-columns.tsx

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
```
  - [x] (Completed) Email should be a clickable link.
``` typescript
// types/user/user-columns.tsx

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
```
  - [x] (Completed) Registration should be in “yyyy-MM-dd” format. When hovering with the mouse, it
  should show the detailed date and time, including hours & seconds.
``` typescript
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
```
- [x] (Completed) The data schema of each row should be:
``` typescript
// interfaces/User.ts

interface TUser {
  id: string
  name: string
  balance: number
  email: string
  registerAt: Date
  active: boolean
}
```
- [x] (Completed) You are free to provide any sample data to render the table (at least 100 rows should be
sufficient).
``` json
[
  {
    "id": "5c1a74e2-ca73-4982-82de-9842ebb87096",
    "name": "Chris Taylor",
    "balance": 4189,
    "email": "chris.taylor91@yahoo.com",
    "registerAt": "2023-10-10T22:27:51.753Z",
    "active": true
  },
  {
    "id": "f836ed3e-74d1-4387-a752-e58b4f895690",
    "name": "Sarah Smith",
    "balance": 1071,
    "email": "sarah.smith77@gmail.com",
    "registerAt": "2025-01-26T09:40:34.795Z",
    "active": true
  },
  ...
]
```
- [x] (Completed) You can use any frontend framework (Vue, React, Angular, Svelte, Solid, etc...) or none at all.
- [x] (Completed) TypeScript is mandatory.
- [x] (Completed) There is no specification for color or size of elements, but the design should be responsive.

    [TailwindCSS Responsive Design (Mobile First)](https://tailwindcss.com/docs/responsive-design)
    ``` typescript
    className="text-xs md:text-sm lg:text-base"
    ```
#### Bonus Points ✨
- [x] (Completed) Implement sorting and filtering functionality
      Implementation code: `components/ui/table/data-table.tsx`; `components/ui/table/filter-input.tsx`; `core/table/helper.tsx`; `app/page.tsx`; API: `app/api/users/route.ts`.
- [x] (Completed) Implement a dark mode toggle
      Implementation code: `components/layout/theme-toggle.tsx`
      [TailwindCSS Darkmode Using a data attribute](https://tailwindcss.com/docs/dark-mode#using-a-data-attribute)
- [x] (Completed) Implement a virtualization mode (infinite scroll)
      Implementation code: `components/ui/table/data-table.tsx`; `components/layout/infinite-scroll-toggle.tsx`.
- [x] (Completed) Fetch data from a public API
      [Building APIs with Next.js](https://nextjs.org/blog/building-apis-with-nextjs)
      Implementation code: `app/api/users/route.ts`
- [x] (Completed) Implement a loading spinner
      Implementation code: `components/layout/loading.tsx`
``` jsx
<div
  className={cn(
    "absolute top-0 left-0 w-screen h-screen justify-between items-center bg-slate-500 opacity-50 box-border",
    loading ? "flex" : "hidden"
  )}
>
  <ClipLoader
    loading={true}
    cssOverride={{ margin: "0 auto" }}
    aria-label="Loading Spinner"
    data-testid="loader"
    size={100}
  />
</div>
```
- [x] (Completed) Properly handle errors and display error messages to the user (when failed to fetch
``` typescript
if (!res.ok) {
  setErrorMessage(responseData.message || "Unknown error occurred");
  return;
}

<div className="w-full px-2 md:px-8 my-4 text-red-800">
  {errorMessage ? errorMessage : ""}
</div>
```
