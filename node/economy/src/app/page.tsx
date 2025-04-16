import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Dashboard from "@/components/dashboard";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { password, p, pw } = await searchParams;

  const inputPassword = password || p || pw;

  if (inputPassword !== process.env.ADMIN_PASSWORD) {
    return (
      <main className="min-h-dvh items-center justify-center flex">
        You need to provide the correct password to access the dashboard.
      </main>
    );
  }

  return (
    <main className="container mx-auto py-10 px-4 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-medium">Economy Dashboard</h1>
      </div>
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="shop">Shop</TabsTrigger>
        </TabsList>
        <Dashboard password={inputPassword} />
      </Tabs>
    </main>
  );
}
