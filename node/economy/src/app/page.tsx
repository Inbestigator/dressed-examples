import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Dashboard from "@/components/dashboard";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { password, p, pw } = await searchParams;

  const inputPassword = password || p || pw;

  if (inputPassword !== process.env.ADMIN_PASSWORD) {
    return (
      <main className="min-h-dvh items-center justify-center flex flex-col">
        <h2 className="text-3xl font-medium">
          Hey there 👋, you don&apos;t seem to have the password.
        </h2>
        <p className="mt-8 flex gap-4">
          <Button size="lg" asChild>
            <Link
              href={`https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_APP_ID}`}
              target="_blank"
            >
              Invite this bot
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link
              href="https://github.com/inbestigator/dressed-examples/tree/main/node/economy"
              target="_blank"
            >
              Deploy your own
            </Link>
          </Button>
        </p>
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
