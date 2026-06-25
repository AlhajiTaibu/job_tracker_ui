"use client";

type Props = {
  message: {
    id: number;
    title: string;
    body: string;
  } | null;
  onClose: () => void;
};

export function NotificationBanner({ message, onClose }: Props) {
  if (!message) return null;

  return (
    <div className="mb-3 flex items-start justify-between rounded-xl bg-slate-900 px-4 py-3 text-white shadow">
      <div>
        <p className="font-semibold">{message.title}</p>
        <p className="text-sm text-slate-300">{message.body}</p>
      </div>
      <button
        onClick={onClose}
        className="ml-4 text-slate-300 hover:text-white"
      >
        ×
      </button>
    </div>
  );
}
