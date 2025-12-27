"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Instagram, Download, Send } from "lucide-react";
import html2canvas from "html2canvas-pro";

interface ShareButtonProps {
  slideRef?: React.RefObject<HTMLDivElement | null>;
  slideTitle?: string;
}

export function ShareButton({
  slideRef,
  slideTitle = "Aza Wrapped",
}: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const captureSlide = async (): Promise<Blob | null> => {
    try {
      const wrappedContainer = document.getElementById("wrapped-container");

      if (!wrappedContainer) {
        console.error("ShareButton: Wrapped container not found");
        return null;
      }

      const canvas = await html2canvas(wrappedContainer, {
        height: wrappedContainer.offsetHeight,
        width: wrappedContainer.offsetWidth,
        scale: 1,
      });

      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Canvas to Blob conversion failed."));
          }
        }, "image/png"); // Specify the MIME type and quality (optional)
      });
    } catch (error) {
      console.error("ShareButton: Error capturing slide:", error);
      return null;
    }
  };

  const downloadImage = (blob: Blob, filename: string) => {
    try {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up after a delay to ensure download starts
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);

      console.log("ShareButton: Image downloaded");
    } catch (error) {
      console.error("ShareButton: Error downloading image:", error);
      alert("Failed to download image. Please try again.");
    }
  };

  const shareToWhatsApp = (blob: Blob) => {
    try {
      // Convert blob to data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        // For WhatsApp Web, we download first then user can share
        downloadImage(blob, "aza-wrapped.png");

        // Open WhatsApp with message
        const message = encodeURIComponent("Check out my Aza Wrapped! 🎉");
        const whatsappUrl = `https://wa.me/?text=${message}`;
        window.open(whatsappUrl, "_blank");
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("ShareButton: Error sharing to WhatsApp:", error);
      downloadImage(blob, "aza-wrapped.png");
      alert("Image downloaded. Please share it manually on WhatsApp.");
    }
  };

  const shareToInstagram = (blob: Blob) => {
    try {
      // Instagram doesn't support direct web uploads
      // Download the image and open Instagram
      downloadImage(blob, "aza-wrapped.png");

      // Open Instagram
      setTimeout(() => {
        window.open("https://www.instagram.com/", "_blank");
        alert(
          "Image downloaded! Open Instagram and create a new post to share it."
        );
      }, 500);
    } catch (error) {
      console.error("ShareButton: Error sharing to Instagram:", error);
      downloadImage(blob, "aza-wrapped.png");
      alert("Image downloaded. Please share it manually on Instagram.");
    }
  };

  const handleShare = async (
    platform: "whatsapp" | "instagram" | "download"
  ) => {
    console.log("[HANDLE_SHARE] Starting handleShare for platform:", platform);

    setIsSharing(true);
    setShowOptions(false);

    try {
      console.log(`[HANDLE_SHARE] Starting share to ${platform}...`);
      console.log("[HANDLE_SHARE] Calling captureSlide()...");
      const blob = await captureSlide();

      console.log("[HANDLE_SHARE] captureSlide returned:", {
        blob: blob,
        isNull: blob === null,
        type: typeof blob,
      });

      if (!blob) {
        const errorMsg =
          "Unable to capture slide. Please ensure the slide is fully loaded and try again.";
        console.error("[HANDLE_SHARE] ❌", errorMsg);
        console.error(
          "[HANDLE_SHARE] Blob is null or undefined. Check console logs above for captureSlide errors."
        );
        alert(errorMsg);
        setIsSharing(false);
        return;
      }

      console.log("[HANDLE_SHARE] Blob check passed, blob exists:", {
        size: blob.size,
        type: blob.type,
        constructor: blob.constructor.name,
      });

      if (blob.size === 0) {
        const errorMsg = "Captured image is empty. Please try again.";
        console.error("[HANDLE_SHARE] ❌", errorMsg);
        console.error("[HANDLE_SHARE] Blob size is 0");
        alert(errorMsg);
        setIsSharing(false);
        return;
      }

      console.log(`[HANDLE_SHARE] ✅ Blob ready for ${platform}`, {
        size: blob.size,
        sizeKB: Math.round(blob.size / 1024),
        type: blob.type,
      });

      if (platform === "download") {
        console.log("[HANDLE_SHARE] Calling downloadImage...");
        downloadImage(blob, "aza-wrapped.png");
      } else if (platform === "whatsapp") {
        console.log("[HANDLE_SHARE] Calling shareToWhatsApp...");
        shareToWhatsApp(blob);
      } else if (platform === "instagram") {
        console.log("[HANDLE_SHARE] Calling shareToInstagram...");
        shareToInstagram(blob);
      }

      console.log("[HANDLE_SHARE] ✅ Share action completed");
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("[HANDLE_SHARE] ❌ Error in handleShare:", error);
      console.error("[HANDLE_SHARE] Error details:", {
        name: error instanceof Error ? error.name : "N/A",
        message: errorMsg,
        stack: error instanceof Error ? error.stack : "N/A",
      });
      alert(
        `Failed to share: ${errorMsg}. Please check the console for more details.`
      );
    } finally {
      // Small delay to ensure actions complete
      setTimeout(() => {
        console.log("[HANDLE_SHARE] Resetting isSharing state");
        setIsSharing(false);
      }, 1000);
    }
  };

  return (
    <div
      className="relative"
      data-share-button-container
      data-html2canvas-ignore="true"
    >
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          setShowOptions(!showOptions);
        }}
        disabled={isSharing}
        className="flex items-center gap-2 px-6 py-2 bg-black border-2 border-white text-white font-black uppercase italic tracking-tighter shadow-[4px_4px_0px_0px_#1DB954] transition-all active:shadow-none active:translate-x-1 active:translate-y-1 disabled:opacity-50"
        whileHover={{ scale: 1.02 }}
      >
        {isSharing ? (
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Share2 size={18} strokeWidth={3} />
        )}
        <span>{isSharing ? "CAPTURING..." : "SHARE"}</span>
      </motion.button>

      <AnimatePresence>
        {showOptions && !isSharing && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowOptions(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-white border-4 border-black p-2 z-50 min-w-[200px] shadow-[8px_8px_0px_0px_#FF00FE]"
            >
              {[
                {
                  id: "whatsapp",
                  label: "WHATSAPP",
                  icon: <Send size={18} />,
                  color: "hover:bg-[#1DB954]",
                },
                {
                  id: "instagram",
                  label: "INSTAGRAM",
                  icon: <Instagram size={18} />,
                  color: "hover:bg-[#FF00FE]",
                },
                {
                  id: "download",
                  label: "SAVE IMAGE",
                  icon: <Download size={18} />,
                  color: "hover:bg-black hover:text-white",
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare(opt.id as any);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 font-black italic uppercase text-sm transition-colors text-black ${opt.color}`}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
