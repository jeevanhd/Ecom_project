import { AlertCircle, CheckCircle, Info, X, XCircle } from "lucide-react";

const Alert = ({ type = "info", title, message, onClose, className = "" }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const styles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const iconStyles = {
    success: "text-green-400",
    error: "text-red-400",
    warning: "text-yellow-400",
    info: "text-blue-400",
  };

  const Icon = icons[type];

  return (
    <div className={`p-4 border rounded-lg ${styles[type]} ${className}`}>
      <div className="flex items-start">
        <Icon
          className={`w-5 h-5 ${iconStyles[type]} mr-3 flex-shrink-0 mt-0.5`}
        />
        <div className="flex-1">
          {title && <h3 className="font-medium text-sm mb-1">{title}</h3>}
          <p className="text-sm">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
