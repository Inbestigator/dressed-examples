"use client";

import { TabsContent } from "@/components/ui/tabs";
import { UsersTable } from "@/components/users-table";
import { ShopTable } from "@/components/shop-table";
import { Item, User } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function Dashboard({ password }: { password: string }) {
  const queryClient = useQueryClient();
  const { data: users } = useQuery({
    queryKey: ["userData"],
    queryFn: () =>
      fetch("/api/users", {
        headers: {
          Authorization: password,
        },
      }).then((r) => r.json()) as Promise<User[]>,
  });
  const { data: items } = useQuery({
    queryKey: ["itemData"],
    queryFn: () =>
      fetch("/api/items", {
        headers: {
          Authorization: password,
        },
      }).then((r) => r.json()) as Promise<Item[]>,
  });

  return (
    <>
      <TabsContent value="users">
        <UsersTable
          users={users ?? []}
          updateUserBalance={async (id, balance) => {
            await fetch(`/api/users/${id}`, {
              method: "PUT",
              headers: {
                Authorization: password,
              },
              body: JSON.stringify({ balance }),
            });
            queryClient.invalidateQueries({ queryKey: ["userData"] });
          }}
          deleteUser={async (id) => {
            await fetch(`/api/users/${id}`, {
              method: "DELETE",
              headers: {
                Authorization: password,
              },
            });
            queryClient.invalidateQueries({ queryKey: ["userData"] });
          }}
        />
      </TabsContent>
      <TabsContent value="shop">
        <ShopTable
          items={items ?? []}
          addItem={async (item) => {
            await fetch(`/api/items`, {
              method: "POST",
              headers: {
                Authorization: password,
              },
              body: JSON.stringify(item),
            });
            queryClient.invalidateQueries({ queryKey: ["itemData"] });
          }}
          updateItem={async (id, item) => {
            await fetch(`/api/items/${id}`, {
              method: "PUT",
              headers: {
                Authorization: password,
              },
              body: JSON.stringify(item),
            });
            queryClient.invalidateQueries({ queryKey: ["itemData"] });
          }}
          deleteItem={async (id) => {
            await fetch(`/api/items/${id}`, {
              method: "DELETE",
              headers: {
                Authorization: password,
              },
            });
            queryClient.invalidateQueries({ queryKey: ["itemData"] });
          }}
        />
      </TabsContent>
    </>
  );
}
