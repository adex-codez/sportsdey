import { Share2, Facebook, Instagram, Link, MessageCircle } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";


interface ShareButtonProps {
    url: string;
    title: string;
    className?: string;
}

export const ShareButton = ({ url, title, className }: ShareButtonProps) => {
    const shareUrl = encodeURIComponent(url);
    const shareTitle = encodeURIComponent(title);

    const handleShare = (platform: string, e: any) => {
        e.preventDefault();
        e.stopPropagation();

        let link = "";
        switch (platform) {
            case "x":
                link = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`;
                window.open(link, "_blank");
                break;
            case "facebook":
                link = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
                window.open(link, "_blank");
                break;
            case "whatsapp":
                link = `https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`;
                window.open(link, "_blank");
                break;
            case "instagram":
                navigator.clipboard.writeText(url);
                toast.success("Link copied! Share it on Instagram.");
                break;
            case "copy":
                navigator.clipboard.writeText(url);
                toast.success("Link copied to clipboard!");
                break;
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    className={cn(
                        "p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center cursor-pointer",
                        className,
                    )}
                >
                    <Share2 className="w-4 h-4 text-gray-500" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-44 bg-white p-2 shadow-xl border border-gray-100 rounded-xl z-[100] animate-in fade-in zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 duration-200 ease-out"
            >

                <DropdownMenuItem
                    className="cursor-pointer hover:bg-gray-50 flex items-center gap-3 py-2.5 px-3 rounded-lg focus:outline-none group"
                    onClick={(e) => handleShare("x", e)}
                >
                    <div className="flex items-center justify-center w-7 h-7 rounded-sm bg-black shadow-sm group-hover:scale-105 transition-transform">
                        <svg
                            viewBox="0 0 24 24"
                            className="w-3.5 h-3.5 fill-white"
                            aria-hidden="true"
                        >
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                    </div>
                    <span className="font-semibold text-gray-700 text-sm">X (Twitter)</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="cursor-pointer hover:bg-gray-50 flex items-center gap-3 py-2.5 px-3 rounded-lg focus:outline-none group"
                    onClick={(e) => handleShare("facebook", e)}
                >
                    <div className="flex items-center justify-center w-7 h-7 rounded-sm bg-[#1877F2] shadow-sm group-hover:scale-105 transition-transform">
                        <Facebook className="w-4 h-4 text-white fill-white" />
                    </div>
                    <span className="font-semibold text-gray-700 text-sm">Facebook</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="cursor-pointer hover:bg-gray-50 flex items-center gap-3 py-2.5 px-3 rounded-lg focus:outline-none group"
                    onClick={(e) => handleShare("instagram", e)}
                >
                    <div className="flex items-center justify-center w-7 h-7 rounded-sm bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] shadow-sm group-hover:scale-105 transition-transform">
                        <Instagram className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-gray-700 text-sm">Instagram</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="cursor-pointer hover:bg-gray-50 flex items-center gap-3 py-2.5 px-3 rounded-lg focus:outline-none group"
                    onClick={(e) => handleShare("whatsapp", e)}
                >
                    <div className="flex items-center justify-center w-7 h-7 rounded-sm bg-[#25D366] shadow-sm group-hover:scale-105 transition-transform">
                        <MessageCircle className="w-4 h-4 text-white fill-white" />
                    </div>
                    <span className="font-semibold text-gray-700 text-sm">WhatsApp</span>
                </DropdownMenuItem>
                <div className="h-px bg-gray-100 my-1 mx-2" />
                <DropdownMenuItem
                    className="cursor-pointer hover:bg-gray-50 flex items-center gap-3 py-2.5 px-3 rounded-lg focus:outline-none group"
                    onClick={(e) => handleShare("copy", e)}
                >
                    <div className="flex items-center justify-center w-7 h-7 rounded-sm bg-gray-100 group-hover:bg-gray-200 shadow-sm group-hover:scale-105 transition-transform">
                        <Link className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="font-semibold text-gray-700 text-sm">Copy Link</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
