"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Pencil, Trash, Plus } from "lucide-react";
import { ShopPreview } from "./shop-preview";
import { Item } from "@/types";

interface ShopTableProps {
  items: Item[];
  addItem: (item: Omit<Item, "id">) => Promise<void>;
  updateItem: (id: number, item: Partial<Item>) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
}

export function ShopTable({ items, addItem, updateItem, deleteItem }: ShopTableProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isActionInProgress, setIsActionInProgress] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [newItem, setNewItem] = useState<Omit<Item, "id">>({
    name: "",
    emoji: "",
    price: 0,
  });

  async function handleAddItem() {
    setIsActionInProgress(true);
    setNewItem({
      name: "",
      emoji: "",
      price: 0,
    });
    setIsAddDialogOpen(false);
    await addItem(newItem);
    setIsActionInProgress(false);
  }

  async function handleUpdateItem() {
    if (editingItem) {
      setIsActionInProgress(true);
      setEditingItem(null);
      await updateItem(editingItem.id, editingItem);
      setIsActionInProgress(false);
    }
  }

  async function handleDeleteItem(id: number) {
    if (confirm("Are you sure you want to delete this item?")) {
      setIsActionInProgress(true);
      await deleteItem(id);
      setIsActionInProgress(false);
    }
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
              <DialogDescription>Create a new item for your shop.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="emoji" className="text-right">
                  Emoji
                </Label>
                <Input
                  id="emoji"
                  value={newItem.emoji}
                  onChange={(e) => setNewItem({ ...newItem, emoji: e.target.value })}
                  className="col-span-3"
                  maxLength={2}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price
                </Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  value={newItem.price}
                  onChange={(e) =>
                    setNewItem({ ...newItem, price: Number.parseInt(e.target.value) || 0 })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddItem}>Add Item</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg border shadow-sm mb-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Emoji</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className={isActionInProgress ? "opacity-50 pointer-events-none" : ""}>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="text-xl">{item.emoji}</TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Dialog
                      open={editingItem?.id === item.id}
                      onOpenChange={(open) => {
                        if (!open) setEditingItem(null);
                        else setEditingItem(item);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Edit Item</DialogTitle>
                          <DialogDescription>Make changes to your shop item.</DialogDescription>
                        </DialogHeader>
                        {editingItem && (
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-name" className="text-right">
                                Name
                              </Label>
                              <Input
                                id="edit-name"
                                value={editingItem.name}
                                onChange={(e) =>
                                  setEditingItem({ ...editingItem, name: e.target.value })
                                }
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-emoji" className="text-right">
                                Emoji
                              </Label>
                              <Input
                                id="edit-emoji"
                                value={editingItem.emoji}
                                onChange={(e) =>
                                  setEditingItem({ ...editingItem, emoji: e.target.value })
                                }
                                className="col-span-3"
                                maxLength={2}
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-price" className="text-right">
                                Price
                              </Label>
                              <Input
                                id="edit-price"
                                type="number"
                                min="0"
                                value={editingItem.price}
                                onChange={(e) =>
                                  setEditingItem({
                                    ...editingItem,
                                    price: Number.parseInt(e.target.value) || 0,
                                  })
                                }
                                className="col-span-3"
                              />
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button onClick={handleUpdateItem}>Save changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteItem(item.id)}
                      className="h-8 w-8"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <ShopPreview items={items} />
    </div>
  );
}
