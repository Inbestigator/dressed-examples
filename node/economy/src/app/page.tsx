import Link from "next/link";
import Dashboard from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function HomePage({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const { password, p, pw } = await searchParams;

  const inputPassword = password || p || pw;

  if (inputPassword !== process.env.ADMIN_PASSWORD) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center">
        <h2 className="font-medium text-3xl">Hey there 👋, you don&apos;t seem to have the password.</h2>
        <p className="mt-8 flex gap-4">
          <Button size="lg" asChild>
            <Link href={`https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_APP_ID}`} target="_blank">
              Invite this bot
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="https://github.com/inbestigator/dressed-examples/tree/main/node/economy" target="_blank">
              Deploy your own
            </Link>
          </Button>
        </p>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-medium text-2xl">Economy Dashboard</h1>
      </div>
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="mb-8 grid w-full grid-cols-2">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="shop">Shop</TabsTrigger>
        </TabsList>
        <Dashboard password={inputPassword} />
      </Tabs>
    </main>
  );
}
