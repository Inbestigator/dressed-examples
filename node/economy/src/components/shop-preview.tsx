import type { Item } from "@/types";

interface ShopPreviewProps {
  items: Item[];
}

export function ShopPreview({ items }: ShopPreviewProps) {
  const itemRows: Item[][] = [];
  for (let i = 0; i < items.length; i += 5) {
    itemRows.push(items.slice(i, i + 5));
  }

  return (
    <div className="hidden rounded-md bg-[#2D2F34] p-4 text-white shadow-md md:block">
      <div className="mb-4 flex items-center gap-2">
        <div className="text-2xl">🛍️</div>
        <div className="font-semibold text-xl">Shop</div>
      </div>

      <div className="space-y-2">
        {itemRows.map((row, rowIndex) => (
          <div key={rowIndex.toString()} className="flex gap-2">
            {row.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-center gap-1.5 rounded-md bg-[#5865F2] px-3 py-1.5 text-sm text-white"
              >
                <span>{item.emoji}</span>
                <span>
                  {item.name} - ${item.price}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
