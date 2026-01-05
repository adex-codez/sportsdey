import { SearchX, Calendar } from 'lucide-react';

interface EmptyStateProps {
    title: string;
    description?: string;
    iconType?: 'search' | 'calendar';
}

export function EmptyState({
    title,
    description,
    iconType = 'search'
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-in fade-in zoom-in duration-500">
            <div className="mb-6 relative">
                <div className="absolute inset-0 bg-accent/5 rounded-full blur-2xl animate-pulse" />
                <div className="relative flex items-center justify-center size-20 rounded-full bg-white shadow-xl shadow-accent/5 ring-1 ring-accent/10">
                    {iconType === 'search' ? (
                        <SearchX className="size-10 text-accent/60" />
                    ) : (
                        <Calendar className="size-10 text-accent/60" />
                    )}
                </div>
            </div>

            <h3 className="text-lg font-bold text-primary mb-2">
                {title}
            </h3>

            {description && (
                <p className="text-sm text-gray-400 max-w-[280px] leading-relaxed italic">
                    {description}
                </p>
            )}
        </div>
    );
}
