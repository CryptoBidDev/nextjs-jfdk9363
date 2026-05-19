export type NotificationType =
  | 'bid_placed'
  | 'outbid'
  | 'payment_confirmed'
  | 'asset_released'
  | 'settlement'
  | 'system';

export type CryptoBidXNotification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  auctionId?: string;
  createdAt: string;
  read: boolean;
};

const STORAGE_KEY = 'cryptobidx_notifications';

function safeGetNotifications(): CryptoBidXNotification[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function safeSaveNotifications(notifications: CryptoBidXNotification[]) {
  if (typeof window === 'undefined') return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  window.dispatchEvent(new Event('cryptobidx_notifications_updated'));
}

export function getNotifications(): CryptoBidXNotification[] {
  return safeGetNotifications().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getUnreadNotificationCount(): number {
  return safeGetNotifications().filter((n) => !n.read).length;
}

export function createNotification(input: {
  type: NotificationType;
  title: string;
  message: string;
  auctionId?: string;
}) {
  const notifications = safeGetNotifications();

  const notification: CryptoBidXNotification = {
    id: crypto.randomUUID(),
    type: input.type,
    title: input.title,
    message: input.message,
    auctionId: input.auctionId,
    createdAt: new Date().toISOString(),
    read: false,
  };

  safeSaveNotifications([notification, ...notifications]);

  return notification;
}

export function markAllNotificationsAsRead() {
  const notifications = safeGetNotifications().map((n) => ({
    ...n,
    read: true,
  }));

  safeSaveNotifications(notifications);
}

export function clearNotifications() {
  safeSaveNotifications([]);
}

export function notifyBidPlaced(input: {
  auctionId: string;
  assetName: string;
  amount: number;
}) {
  return createNotification({
    type: 'bid_placed',
    auctionId: input.auctionId,
    title: 'Bid placed',
    message: `Your bid of $${input.amount.toLocaleString()} was placed on ${
      input.assetName
    }.`,
  });
}

export function notifyOutbid(input: {
  auctionId: string;
  assetName: string;
  amount: number;
}) {
  return createNotification({
    type: 'outbid',
    auctionId: input.auctionId,
    title: 'You have been outbid',
    message: `A new highest bid of $${input.amount.toLocaleString()} has been placed on ${
      input.assetName
    }.`,
  });
}

export function notifyPaymentConfirmed(input: {
  auctionId: string;
  assetName: string;
}) {
  return createNotification({
    type: 'payment_confirmed',
    auctionId: input.auctionId,
    title: 'Payment confirmed',
    message: `Payment has been confirmed for ${input.assetName}. Settlement is now in progress.`,
  });
}

export function notifyAssetReleased(input: {
  auctionId: string;
  assetName: string;
}) {
  return createNotification({
    type: 'asset_released',
    auctionId: input.auctionId,
    title: 'Asset released',
    message: `${input.assetName} has been released to the buyer. Auction settlement is complete.`,
  });
}
