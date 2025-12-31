"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { toPng } from "html-to-image";

interface ShareButtonProps {
  slideRef?: React.RefObject<HTMLDivElement | null>;
  slideTitle?: string;
}

export function ShareButton({
  slideRef,
  slideTitle = "Aza Wrapped",
}: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);

  const captureSlide = async (): Promise<Blob | null> => {
    if (!slideRef?.current) {
      return null;
    }

    // Find the parent container that includes both ProgressBar and slide content
    const slideElement = slideRef.current;
    const parentContainer = slideElement.closest('.fixed.inset-0') as HTMLElement;
    
    if (!parentContainer) {
      return null;
    }

    // Elements to hide during capture
    const shareButtonContainers = document.querySelectorAll('[data-share-button-container]');
    const shareMenus = document.querySelectorAll('[class*="absolute bottom-full"]');
    const hiddenElements: HTMLElement[] = [];

    try {
      // Scroll to top to ensure full content is visible
      window.scrollTo({ top: 0, behavior: 'instant' });
      await new Promise(resolve => setTimeout(resolve, 300));

      // Hide share button and related UI
      shareButtonContainers.forEach((container) => {
        (container as HTMLElement).style.display = 'none';
      });
      
      shareMenus.forEach((menu) => {
        (menu as HTMLElement).style.display = 'none';
      });
      
      // Hide capturing loader text
      const textWalker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      let textNode: Node | null;
      while ((textNode = textWalker.nextNode())) {
        if (textNode.textContent?.includes('CAPTURING')) {
          const parent = textNode.parentElement;
          if (parent && parent.style.display !== 'none') {
            parent.style.display = 'none';
            hiddenElements.push(parent);
          }
        }
      }

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Create a temporary container to ensure proper capture
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'fixed';
      tempContainer.style.top = '0';
      tempContainer.style.left = '0';
      tempContainer.style.width = `${viewportWidth}px`;
      tempContainer.style.height = `${viewportHeight}px`;
      tempContainer.style.zIndex = '9999';
      tempContainer.style.pointerEvents = 'none';
      tempContainer.style.visibility = 'hidden';
      
      // Clone the parent container
      const cloned = parentContainer.cloneNode(true) as HTMLElement;
      cloned.style.position = 'relative';
      cloned.style.width = '100%';
      cloned.style.height = '100%';
      cloned.style.margin = '0';
      cloned.style.padding = '0';
      
      // Remove share buttons from clone
      const clonedShareButtons = cloned.querySelectorAll('[data-share-button-container]');
      clonedShareButtons.forEach((btn) => {
        (btn as HTMLElement).remove();
      });
      
      tempContainer.appendChild(cloned);
      document.body.appendChild(tempContainer);
      
      // Wait for rendering
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const dataUrl = await toPng(tempContainer, {
        width: viewportWidth,
        height: viewportHeight,
        pixelRatio: 2,
        cacheBust: true,
        quality: 1.0,
      });
      
      // Clean up temporary container
      document.body.removeChild(tempContainer);
      
      // Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      return blob;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[CAPTURE] Error capturing slide:', error);
      }
      return null;
    } finally {
      // Restore hidden elements
      shareButtonContainers.forEach((container) => {
        (container as HTMLElement).style.display = '';
      });
      
      shareMenus.forEach((menu) => {
        (menu as HTMLElement).style.display = '';
      });
      
      hiddenElements.forEach((el) => {
        el.style.display = '';
      });
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
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("ShareButton: Error downloading image:", error);
      }
      alert("Failed to download image. Please try again.");
    }
  };

  const handleDownload = async () => {
    setIsSharing(true);

    try {
      const blob = await captureSlide();
      
      if (!blob) {
        alert("Unable to capture slide. Please ensure the slide is fully loaded and try again.");
        setIsSharing(false);
        return;
      }

      if (blob.size === 0) {
        alert("Captured image is empty. Please try again.");
        setIsSharing(false);
        return;
      }

      downloadImage(blob, "aza-wrapped.png");
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error occurred";
      if (process.env.NODE_ENV === 'development') {
        console.error('[DOWNLOAD] Error in handleDownload:', error);
      }
      alert(`Failed to download: ${errorMsg}. Please try again.`);
    } finally {
      setTimeout(() => {
        setIsSharing(false);
      }, 1000);
    }
  };

  return (
    <div
      className="relative"
      data-share-button-container
    >
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          handleDownload();
        }}
        disabled={isSharing}
        className="flex items-center gap-2 px-6 py-2 bg-black border-2 border-white text-white font-black uppercase italic tracking-tighter shadow-[4px_4px_0px_0px_#1DB954] transition-all active:shadow-none active:translate-x-1 active:translate-y-1 disabled:opacity-50"
        whileHover={{ scale: 1.02 }}
      >
        {isSharing ? (
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Download size={18} strokeWidth={3} />
        )}
        <span>{isSharing ? "CAPTURING..." : "DOWNLOAD"}</span>
      </motion.button>
    </div>
  );
}
