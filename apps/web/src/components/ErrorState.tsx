import { RefreshCw, WifiOff } from 'lucide-react';

interface ErrorStateProps {
    message?: string;
    description?: string;
    onRetry?: () => void;
    isNetworkError?: boolean;
}

export function ErrorState({
    message = 'Something went wrong',
    description = 'Unable to load data. Please try again.',
    onRetry,
    isNetworkError = false
}: ErrorStateProps) {
    return (
        <div className="flex min-h-[400px] w-full items-center justify-center p-8">
            <div className="text-center">
                <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-red-100 p-4">
                        {isNetworkError ? (
                            <WifiOff className="h-8 w-8 text-red-600" />
                        ) : (
                            <RefreshCw className="h-8 w-8 text-red-600" />
                        )}
                    </div>
                </div>

                <h3 className="mb-2 text-sm font-semibold text-gray-900">
                    {message}
                </h3>

                <p className="mb-6 text-sm text-gray-600">
                    {description}
                </p>

                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="inline-flex text-sm items-center gap-2 rounded-lg bg-[#1BAA04] px-4 py-2 font-medium text-white transition-colors hover:bg-[#158f03]"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                    </button>
                )}
            </div>
        </div>
    );
}
