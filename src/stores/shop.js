import { create } from "zustand";
import { cartApi, wishlistApi, addressApi, ordersApi } from "@/services/shop";
import { MinimalProduct } from "@/models/product";
import { authClient } from "@/lib/auth-client";

const isAuthError = (err) =>
  err?.response?.status === 401 || err?.response?.status === 403;

const readLocal = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeLocal = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable — ignore
  }
};

const normalizeCart = (doc) => {
  if (!doc) return [];
  const list = Array.isArray(doc) ? doc : (doc.products ?? []);
  return list.map((p) => ({
    productId: p.productId ?? p.id,
    quantity: p.quantity ?? 1,
    title: p.title,
    thumbnail: p.thumbnail,
    price: p.price,
    originalPrice: p.originalPrice,
    sku: p.sku,
    category: p.category,
    brand: p.brand,
  }));
};

export const useCartStore = create((set, get) => ({
  items: [],
  loading: false,
  error: null,
  serverBacked: true,

  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const cart = await cartApi.get();
      set({ items: normalizeCart(cart), loading: false, serverBacked: true });
    } catch (err) {
      if (isAuthError(err)) {
        set({
          items: readLocal("guest-cart", []),
          loading: false,
          serverBacked: false,
        });
      } else if (err?.response?.status === 404) {
        set({ items: [], loading: false, serverBacked: true });
      } else {
        set({ loading: false, error: err });
      }
    }
  },

  add: async (product, quantity = 1) => {
    const productId = product.productId ?? product.id;
    if (get().serverBacked) {
      try {
        const cart = await cartApi.add(productId, quantity);
        set({ items: normalizeCart(cart), error: null });
        return;
      } catch (err) {
        if (!isAuthError(err)) {
          set({ error: err });
          throw err;
        }
        set({ serverBacked: false });
      }
    }
    const items = [...get().items];
    const existing = items.find((i) => i.productId === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({
        productId,
        quantity,
        title: product.title,
        thumbnail: product.thumbnail ?? product.image,
        price: product.price,
        originalPrice: product.originalPrice,
        sku: product.sku,
        category: product.category,
        brand: product.brand,
      });
    }
    writeLocal("guest-cart", items);
    set({ items });
  },

  setQuantity: async (productId, quantity) => {
    if (get().serverBacked) {
      try {
        const cart = await cartApi.setQuantity(productId, quantity);
        set({ items: normalizeCart(cart), error: null });
        return;
      } catch (err) {
        set({ error: err });
        throw err;
      }
    }
    const items = get().items.map((i) =>
      i.productId === productId ? { ...i, quantity } : i,
    );
    writeLocal("guest-cart", items);
    set({ items });
  },

  remove: async (productId) => {
    if (get().serverBacked) {
      try {
        const cart = await cartApi.remove(productId);
        set({ items: normalizeCart(cart), error: null });
        return;
      } catch (err) {
        set({ error: err });
        throw err;
      }
    }
    const items = get().items.filter((i) => i.productId !== productId);
    writeLocal("guest-cart", items);
    set({ items });
  },

  clear: async () => {
    if (get().serverBacked) {
      try {
        await cartApi.clear();
        set({ items: [], error: null });
        return;
      } catch (err) {
        set({ error: err });
        throw err;
      }
    }
    writeLocal("guest-cart", []);
    set({ items: [] });
  },
}));

const toWishlistSnapshot = (product) =>
  new MinimalProduct({
    ...product,
    productId: product.productId ?? product.id,
  });

export const useWishlistStore = create((set, get) => ({
  items: [],
  loading: false,
  error: null,
  serverBacked: true,

  fetch: async (folder = "/") => {
    set({ loading: true, error: null });
    try {
      const doc = await wishlistApi.get(folder);
      const products = Array.isArray(doc) ? doc : (doc.products ?? []);
      set({ items: products, loading: false, serverBacked: true });
    } catch (err) {
      if (isAuthError(err)) {
        set({
          items: readLocal("guest-wishlist", []),
          loading: false,
          serverBacked: false,
        });
      } else if (err?.response?.status === 404) {
        set({ items: [], loading: false, serverBacked: true });
      } else {
        set({ loading: false, error: err });
      }
    }
  },

  has: (productId) =>
    get().items.some((p) => (p.productId ?? p.id) === productId),

  toggle: async (product, folder = "/") => {
    const productId = product.productId ?? product.id;
    if (get().has(productId)) {
      await get().remove(productId, folder);
    } else {
      await get().add(product, folder);
    }
  },

  add: async (product, folder = "/") => {
    if (get().serverBacked) {
      try {
        const doc = await wishlistApi.add(toWishlistSnapshot(product), folder);
        set({ items: doc.products ?? [], error: null });
        return;
      } catch (err) {
        if (!isAuthError(err)) {
          set({ error: err });
          throw err;
        }
        set({ serverBacked: false });
      }
    }
    const items = [...get().items, toWishlistSnapshot(product)];
    writeLocal("guest-wishlist", items);
    set({ items });
  },

  remove: async (productId, folder = "/") => {
    if (get().serverBacked) {
      try {
        const doc = await wishlistApi.remove(productId, folder);
        set({ items: doc.products ?? [], error: null });
        return;
      } catch (err) {
        set({ error: err });
        throw err;
      }
    }
    const items = get().items.filter(
      (p) => (p.productId ?? p.id) !== productId,
    );
    writeLocal("guest-wishlist", items);
    set({ items });
  },
}));

class Address {
  constructor({
    id,
    name,
    phoneNumber,
    userId,
    street,
    city,
    state,
    postalCode,
    country,
    email,
    type = "home",
  }) {
    this.id = id || crypto.randomUUID();
    this.name = name;
    this.phoneNumber = phoneNumber;
    this.userId = userId;
    this.street = street;
    this.city = city;
    this.state = state;
    this.postalCode = postalCode;
    this.country = country;
    this.email = email;
    this.type = type;
  }
}

export { Address as AddressMold };

export const useAddressStore = create((set) => ({
  addresses: [],
  current: null,
  loading: false,
  error: null,

  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const addresses = await addressApi.list();
      addresses.forEach((address) => {
        if (address.isDefault) {
          set({ current: address });
        }
      });
      set({
        addresses: Array.isArray(addresses) ? addresses : [],
        loading: false,
      });
    } catch (err) {
      set({ loading: false, error: err });
    }
  },

  delete: async (addressId) => {
    await addressApi.remove(addressId);
  },

  update: async (address) => {
    await addressApi.update(address);
  },

  add: async (address) => {
    const { data: session } = await authClient.getSession();
    const user = session?.user;
    if (!user) {
      throw new Error("User not authenticated");
    }
    address.userId = user.id;
    address.email = user.email;
    const addresses = await addressApi.add(new Address(address));
    set({ addresses: Array.isArray(addresses) ? addresses : [] });
  },

  setDefault: async (address) => {
    const current = await addressApi.setCurrent(address);
    set({ current });
    await useAddressStore.getState().fetch();
  },
}));

export const useOrderStore = create((set) => ({
  orders: [],
  detail: null,
  loading: false,
  error: null,

  fetchUserOrders: async () => {
    set({ loading: true, error: null });
    try {
      const orders = await ordersApi.userOrders();
      set({ orders: Array.isArray(orders) ? orders : [], loading: false });
    } catch (err) {
      set({ loading: false, error: err });
    }
  },

  fetchDetail: async (id) => {
    set({ loading: true, error: null });
    try {
      const detail = await ordersApi.get(id);
      set({ detail, loading: false });
    } catch (err) {
      set({ loading: false, error: err });
    }
  },

  create: async (payload) => {
    const order = await ordersApi.create(payload);
    return order;
  },

  cancel: async (id, reason) => {
    await ordersApi.cancel(id, reason);
    await useOrderStore.getState().fetchUserOrders();
  },

  requestReturn: async (id, reason) => {
    await ordersApi.requestReturn(id, reason);
    await useOrderStore.getState().fetchUserOrders();
  },
}));
