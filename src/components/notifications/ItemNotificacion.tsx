type Notification = {
  id: string;

  title: string;

  message: string;

  type: string;

  isRead: boolean;

  createdAt: string;
};

type Props = {
  notification: Notification;

  onRead: () => void;
};

export default function ItemNotificacion({
  notification,
  onRead,
}: Props) {
  return (
    <button
      onClick={onRead}
      className={`w-full text-left p-4 rounded-xl border transition ${
        notification.isRead
          ? "border-white/5 bg-black/20"
          : "border-[#C7962D]/30 bg-[#C7962D]/10"
      } cursor-pointer`}
    >
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-white">
          {notification.title}
        </h4>

        {!notification.isRead && (
          <div className="h-2 w-2 rounded-full bg-[#C7962D]" />
        )}
      </div>

      <p className="text-xs text-gray-400 mt-2">
        {notification.message}
      </p>
    </button>
  );
}