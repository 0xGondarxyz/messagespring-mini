interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "success" | "error" | "info";
}

export default function Modal({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
}: ModalProps) {
  if (!isOpen) return null;

  const bgColors = {
    success: "bg-green-400",
    error: "bg-red-400",
    info: "bg-blue-400",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-w-md w-full p-6">
        <h2
          className={`text-2xl font-black uppercase mb-4 p-3 border-4 border-black ${bgColors[type]}`}
        >
          {title}
        </h2>
        <p className="text-lg mb-6 font-medium">{message}</p>
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-yellow-400 font-bold text-black uppercase border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
        >
          Close
        </button>
      </div>
    </div>
  );
}
