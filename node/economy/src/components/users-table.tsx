"use client";

import { Check, Pencil, Trash, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { User } from "@/types";

interface UsersTableProps {
  users: User[];
  updateUserBalance: (id: number, balance: number) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
}

export function UsersTable({ users, updateUserBalance, deleteUser }: UsersTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isActionInProgress, setIsActionInProgress] = useState(false);
  const [editValue, setEditValue] = useState<string>("");

  async function saveEdit() {
    if (editingId !== null) {
      const newBalance = Number.parseInt(editValue, 10);
      setIsActionInProgress(true);
      setEditingId(null);
      if (!Number.isNaN(newBalance) && newBalance >= 0) {
        await updateUserBalance(editingId, newBalance);
      }
      setIsActionInProgress(false);
    }
  }

  async function handleDeleteUser(id: number) {
    setEditingId(null);
    if (confirm("Are you sure you want to delete this user?")) {
      setIsActionInProgress(true);
      await deleteUser(id);
      setIsActionInProgress(false);
    }
  }

  function formatDate(date: Date | null) {
    if (!date) return "Never";
    return new Date(date).toLocaleDateString("en-US", { month: "long", day: "2-digit" }).replace(/\//g, "/");
  }

  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead className="hidden md:table-cell">Last Reward</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className={isActionInProgress ? "pointer-events-none opacity-50" : ""}>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="font-medium">{user.discord_username}</div>
                <div className="text-muted-foreground text-xs">{user.discord_id}</div>
              </TableCell>
              <TableCell>
                {editingId === user.id ? (
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="h-8 w-24"
                    type="number"
                    min="0"
                  />
                ) : (
                  <span className="font-medium">{user.balance}</span>
                )}
              </TableCell>
              <TableCell className="hidden text-muted-foreground text-sm md:table-cell">
                {formatDate(user.last_daily_reward)}
              </TableCell>
              <TableCell>
                {editingId === user.id ? (
                  <div className="flex space-x-1">
                    <Button size="icon" variant="ghost" onClick={saveEdit} className="h-8 w-8">
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setEditingId(null);
                      }}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex space-x-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setEditingId(user.id);
                        setEditValue(user.balance.toString());
                      }}
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDeleteUser(user.id)} className="h-8 w-8">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
