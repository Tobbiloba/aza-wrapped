'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Instagram, Download, Send } from 'lucide-react';
import { toPng } from 'html-to-image';

interface ShareButtonProps {
  slideRef?: React.RefObject<HTMLDivElement | null>;
  slideTitle?: string;
}

export function ShareButton({ slideRef, slideTitle = 'Aza Wrapped' }: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

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
      let textNode;
      while (textNode = textWalker.nextNode()) {
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
          backgroundColor: null,
          cacheBust: true,
          useCORS: true,
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
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up after a delay to ensure download starts
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
      
      console.log('ShareButton: Image downloaded');
    } catch (error) {
      console.error('ShareButton: Error downloading image:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  const shareToWhatsApp = (blob: Blob) => {
    try {
      // Convert blob to data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        // For WhatsApp Web, we download first then user can share
        downloadImage(blob, 'aza-wrapped.png');
        
        // Open WhatsApp with message
        const message = encodeURIComponent('Check out my Aza Wrapped! 🎉');
        const whatsappUrl = `https://wa.me/?text=${message}`;
        window.open(whatsappUrl, '_blank');
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('ShareButton: Error sharing to WhatsApp:', error);
      downloadImage(blob, 'aza-wrapped.png');
      alert('Image downloaded. Please share it manually on WhatsApp.');
    }
  };

  const shareToInstagram = (blob: Blob) => {
    try {
      // Instagram doesn't support direct web uploads
      // Download the image and open Instagram
      downloadImage(blob, 'aza-wrapped.png');
      
      // Open Instagram
      setTimeout(() => {
        window.open('https://www.instagram.com/', '_blank');
        alert('Image downloaded! Open Instagram and create a new post to share it.');
      }, 500);
    } catch (error) {
      console.error('ShareButton: Error sharing to Instagram:', error);
      downloadImage(blob, 'aza-wrapped.png');
      alert('Image downloaded. Please share it manually on Instagram.');
    }
  };

  const handleShare = async (platform: 'whatsapp' | 'instagram' | 'download') => {
    console.log('[HANDLE_SHARE] Starting handleShare for platform:', platform);
    console.log('[HANDLE_SHARE] slideRef:', slideRef);
    console.log('[HANDLE_SHARE] slideRef.current:', slideRef?.current);
    
    setIsSharing(true);
    setShowOptions(false);

    try {
      console.log(`[HANDLE_SHARE] Starting share to ${platform}...`);
      console.log('[HANDLE_SHARE] Calling captureSlide()...');
      const blob = await captureSlide();
      
      console.log('[HANDLE_SHARE] captureSlide returned:', {
        blob: blob,
        isNull: blob === null,
        type: typeof blob,
      });
      
      if (!blob) {
        const errorMsg = 'Unable to capture slide. Please ensure the slide is fully loaded and try again.';
        console.error('[HANDLE_SHARE] ❌', errorMsg);
        console.error('[HANDLE_SHARE] Blob is null or undefined. Check console logs above for captureSlide errors.');
        alert(errorMsg);
        setIsSharing(false);
        return;
      }

      console.log('[HANDLE_SHARE] Blob check passed, blob exists:', {
        size: blob.size,
        type: blob.type,
        constructor: blob.constructor.name,
      });

      if (blob.size === 0) {
        const errorMsg = 'Captured image is empty. Please try again.';
        console.error('[HANDLE_SHARE] ❌', errorMsg);
        console.error('[HANDLE_SHARE] Blob size is 0');
        alert(errorMsg);
        setIsSharing(false);
        return;
      }

      console.log(`[HANDLE_SHARE] ✅ Blob ready for ${platform}`, { 
        size: blob.size,
        sizeKB: Math.round(blob.size / 1024),
        type: blob.type
      });

      if (platform === 'download') {
        console.log('[HANDLE_SHARE] Calling downloadImage...');
        downloadImage(blob, 'aza-wrapped.png');
      } else if (platform === 'whatsapp') {
        console.log('[HANDLE_SHARE] Calling shareToWhatsApp...');
        shareToWhatsApp(blob);
      } else if (platform === 'instagram') {
        console.log('[HANDLE_SHARE] Calling shareToInstagram...');
        shareToInstagram(blob);
      }
      
      console.log('[HANDLE_SHARE] ✅ Share action completed');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('[HANDLE_SHARE] ❌ Error in handleShare:', error);
      console.error('[HANDLE_SHARE] Error details:', {
        name: error instanceof Error ? error.name : 'N/A',
        message: errorMsg,
        stack: error instanceof Error ? error.stack : 'N/A',
      });
      alert(`Failed to share: ${errorMsg}. Please check the console for more details.`);
    } finally {
      // Small delay to ensure actions complete
      setTimeout(() => {
        console.log('[HANDLE_SHARE] Resetting isSharing state');
        setIsSharing(false);
      }, 1000);
    }
  };

  return (
    <div className="relative" data-share-button-container>
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
        <span>{isSharing ? 'CAPTURING...' : 'SHARE'}</span>
      </motion.button>

      <AnimatePresence>
        {showOptions && !isSharing && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowOptions(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-white border-4 border-black p-2 z-50 min-w-[200px] shadow-[8px_8px_0px_0px_#FF00FE]"
            >
              {[
                { id: 'whatsapp', label: 'WHATSAPP', icon: <Send size={18} />, color: 'hover:bg-[#1DB954]' },
                { id: 'instagram', label: 'INSTAGRAM', icon: <Instagram size={18} />, color: 'hover:bg-[#FF00FE]' },
                { id: 'download', label: 'SAVE IMAGE', icon: <Download size={18} />, color: 'hover:bg-black hover:text-white' },
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