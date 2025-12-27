"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Share2, Download } from "lucide-react";
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
    console.log('[CAPTURE] Starting captureSlide function');
    
    if (!slideRef?.current) {
      console.error('[CAPTURE] ❌ slideRef is not available');
      return null;
    }

    // Find the parent container that includes both ProgressBar and slide content
    const slideElement = slideRef.current;
    const parentContainer = slideElement.closest('.fixed.inset-0') as HTMLElement;
    
    if (!parentContainer) {
      console.error('[CAPTURE] ❌ Parent container not found');
      return null;
    }

    try {
      console.log('[CAPTURE] Step 1: Scrolling to top...');
      window.scrollTo({ top: 0, behavior: 'instant' });
      await new Promise(resolve => setTimeout(resolve, 300));

      console.log('[CAPTURE] Step 2: Hiding UI elements...');
      
      // Hide share button and related UI
      const shareButtonContainers = document.querySelectorAll('[data-share-button-container]');
      const shareMenus = document.querySelectorAll('[class*="absolute bottom-full"]');
      
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
      
      const hiddenElements: HTMLElement[] = [];
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

      try {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        console.log('[CAPTURE] Capture dimensions:', {
          viewportWidth,
          viewportHeight,
        });

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

        console.log('[CAPTURE] Step 3: Capturing with html-to-image...');
        
        const dataUrl = await toPng(tempContainer, {
          width: viewportWidth,
          height: viewportHeight,
          pixelRatio: 2,
          cacheBust: true,
          quality: 1.0,
        });
        
        // Clean up
        document.body.removeChild(tempContainer);
        
        console.log('[CAPTURE] ✅ Image created successfully');
        
        // Convert data URL to blob
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        
                console.log('[CAPTURE] ✅ Blob created successfully', { 
                  size: blob.size, 
                  type: blob.type,
                  sizeKB: Math.round(blob.size / 1024)
                });
        
        return blob;
    } catch (error) {
      console.error('[CAPTURE] ❌ Error capturing slide:', error);
      if (error instanceof Error) {
        console.error('[CAPTURE] Error name:', error.name);
        console.error('[CAPTURE] Error message:', error.message);
        console.error('[CAPTURE] Error stack:', error.stack);
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
    } catch (error) {
      console.error('[CAPTURE] ❌ Outer error capturing slide:', error);
      // Restore hidden elements even on outer error
      const shareButtonContainers = document.querySelectorAll('[data-share-button-container]');
      shareButtonContainers.forEach((container) => {
        (container as HTMLElement).style.display = '';
      });
      
      const shareMenus = document.querySelectorAll('[class*="absolute bottom-full"]');
      shareMenus.forEach((menu) => {
        (menu as HTMLElement).style.display = '';
      });
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

  const handleDownload = async () => {
    setIsSharing(true);

    try {
      console.log('[DOWNLOAD] Starting download...');
      const blob = await captureSlide();
      
      if (!blob) {
        const errorMsg = "Unable to capture slide. Please ensure the slide is fully loaded and try again.";
        console.error('[DOWNLOAD] ❌', errorMsg);
        alert(errorMsg);
        setIsSharing(false);
        return;
      }

      if (blob.size === 0) {
        const errorMsg = "Captured image is empty. Please try again.";
        console.error('[DOWNLOAD] ❌', errorMsg);
        alert(errorMsg);
        setIsSharing(false);
        return;
      }

      console.log('[DOWNLOAD] ✅ Blob ready', {
        size: blob.size,
        sizeKB: Math.round(blob.size / 1024),
        type: blob.type,
      });

      downloadImage(blob, "aza-wrapped.png");
      console.log('[DOWNLOAD] ✅ Download action completed');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error occurred";
      console.error('[DOWNLOAD] ❌ Error in handleDownload:', error);
      alert(`Failed to download: ${errorMsg}. Please check the console for more details.`);
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
