export interface User {
  id: number;
  discord_id: string;
  discord_username: string;
  balance: number;
  last_daily_reward: Date | null;
}

export interface Item {
  id: number;
  name: string;
  emoji: string;
  price: number;
}

export interface UserItem {
  id: number;
  user_id: number;
  item_id: number;
  quantity: number;
}
