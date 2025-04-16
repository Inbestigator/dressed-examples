import { Item } from "@/types";

interface ShopPreviewProps {
  items: Item[];
}

export function ShopPreview({ items }: ShopPreviewProps) {
  const itemRows: Item[][] = [];
  for (let i = 0; i < items.length; i += 5) {
    itemRows.push(items.slice(i, i + 5));
  }

  return (
    <div className="hidden md:block bg-[#2D2F34] text-white p-4 rounded-md shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <div className="text-2xl">🛍️</div>
        <div className="text-xl font-semibold">Shop</div>
      </div>

      <div className="space-y-2">
        {itemRows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-2">
            {row.map((item) => (
              <div
                key={item.id}
                className="bg-[#5865F2] text-white px-3 py-1.5 rounded-md flex items-center justify-center gap-1.5 text-sm"
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
