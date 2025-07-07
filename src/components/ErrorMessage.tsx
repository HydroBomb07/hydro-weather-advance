
import { AlertTriangle, X } from 'lucide-react';

interface Props {
  message: string;
  onClose: () => void;
}

const ErrorMessage = ({ message, onClose }: Props) => {
  return (
    <div className="bg-red-500/90 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-red-400/50 animate-shake">
      <div className="flex items-center gap-4">
        <AlertTriangle className="w-6 h-6 text-white" />
        <span className="flex-1 text-white font-medium">{message}</span>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white p-1 hover:bg-white/20 rounded-full transition-all duration-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export { ErrorMessage };
