import { defineStore } from "pinia";

export type UiOrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "delivered"
  | "cancelled";

export interface OrderItemView {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  dishId: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItemView[];
  totalPrice: number;
  status: UiOrderStatus;
  createdAt: string;
  restaurantId?: string;
}

const apiToUiStatus: Record<string, UiOrderStatus> = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PREPARING: "preparing",
  READY: "ready",
  DELIVERED: "delivered",
  CANCELLED: "cancelled"
};

interface OrderState {
  orders: Order[];
}

type ApiOrderItem = {
  id: string;
  dishId: string;
  quantity: number;
  unitPrice: number;
};

type ApiOrder = {
  id: string;
  status: string;
  totalPrice: number;
  customerId: string;
  restaurantId: string;
  items: ApiOrderItem[];
  createdAt: string;
  updatedAt: string;
};

type Paginated<T> = {
  data: T[];
  pagination: { total: number; limit: number; offset: number };
};

function mapApiOrder(
  o: ApiOrder,
  dishNames: Map<string, { name: string; image?: string }>
): Order {
  return {
    id: o.id,
    userId: o.customerId,
    restaurantId: o.restaurantId,
    totalPrice: o.totalPrice,
    status: apiToUiStatus[o.status] ?? "pending",
    createdAt: o.createdAt,
    items: o.items.map((it) => {
      const meta = dishNames.get(it.dishId);
      return {
        id: it.id,
        dishId: it.dishId,
        name: meta?.name ?? `Plat ${it.dishId.slice(0, 8)}…`,
        price: it.unitPrice,
        quantity: it.quantity,
        imageUrl: meta?.image
      };
    })
  };
}

export const useOrderStore = defineStore("order", {
  state: (): OrderState => ({
    orders: []
  }),
  getters: {
    userOrders:
      (state) =>
      (_userEmail: string): Order[] =>
        state.orders,
    getOrderById:
      (state) =>
      (orderId: string | number) =>
        state.orders.find((order) => order.id === String(orderId))
  },
  actions: {
    async fetchClientOrders() {
      const { request, getBase } = useApi();
      const envelope = await request<Paginated<ApiOrder>>("/users/me/orders?limit=100");
      const raw = envelope.data;
      const dishIds = [...new Set(raw.flatMap((o) => o.items.map((i) => i.dishId)))];
      const dishNames = new Map<string, { name: string; image?: string }>();
      const base = getBase();
      await Promise.all(
        dishIds.map(async (id) => {
          try {
            const d = await request<{
              id: string;
              name: string;
              image?: string;
            }>(`/dishes/${id}`);
            let imageUrl = d.image;
            if (imageUrl && !imageUrl.startsWith("http")) {
              imageUrl = `${base.replace(/\/$/, "")}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
            }
            dishNames.set(id, { name: d.name, image: imageUrl });
          } catch {
            dishNames.set(id, { name: `Plat` });
          }
        })
      );
      this.orders = raw.map((o) => mapApiOrder(o, dishNames));
    },
    async createOrderApi(restaurantId: string, items: { dishId: string; quantity: number }[]) {
      const { request } = useApi();
      const created = await request<{ id: string }>("/orders", {
        method: "POST",
        body: JSON.stringify({ restaurantId, items })
      });
      await this.fetchClientOrders();
      return created.id;
    },
    async fetchRestaurantOrders() {
      const { request, getBase } = useApi();
      const envelope = await request<Paginated<ApiOrder>>("/restaurants/me/orders?limit=100");
      const raw = envelope.data;
      const dishIds = [...new Set(raw.flatMap((o) => o.items.map((i) => i.dishId)))];
      const dishNames = new Map<string, { name: string; image?: string }>();
      const base = getBase();
      await Promise.all(
        dishIds.map(async (id) => {
          try {
            const d = await request<{
              id: string;
              name: string;
              image?: string;
            }>(`/dishes/${id}`);
            let imageUrl = d.image;
            if (imageUrl && !imageUrl.startsWith("http")) {
              imageUrl = `${base.replace(/\/$/, "")}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
            }
            dishNames.set(id, { name: d.name, image: imageUrl });
          } catch {
            dishNames.set(id, { name: "Plat" });
          }
        })
      );
      this.orders = raw.map((o) => mapApiOrder(o, dishNames));
    },
    async updateOrderStatusApi(orderId: string, status: "CONFIRMED" | "PREPARING" | "READY" | "DELIVERED") {
      const { request } = useApi();
      await request(`/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      });
      await this.fetchRestaurantOrders();
    },
    updateOrderStatus(orderId: number, status: UiOrderStatus) {
      const order = this.orders.find((o) => o.id === String(orderId));
      if (order) order.status = status;
    },
    deleteOrder(orderId: number) {
      const index = this.orders.findIndex((o) => o.id === String(orderId));
      if (index !== -1) {
        this.orders.splice(index, 1);
        return true;
      }
      return false;
    }
  },
  persist: false
});
