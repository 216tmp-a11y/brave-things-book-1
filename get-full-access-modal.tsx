/**
 * Get Full Access Modal Component
 * 
 * Beautiful, branded modal dialog that appears when preview users
 * click "Get Full Access" buttons. Features:
 * - Centered positioning
 * - Forest/golden theme branding
 * - Contact information
 * - Smooth animations
 * - Professional styling
 */

import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Mail, BookOpen, Star, Heart } from "lucide-react";

interface GetFullAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GetFullAccessModal({ isOpen, onClose }: GetFullAccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-white border-2 border-forest-200 shadow-2xl">
        <DialogHeader className="text-center pb-2">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
          
          {/* Header with branding */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-forest-600 to-golden-600 rounded-full flex items-center justify-center">
              <Star className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <DialogTitle className="text-2xl font-bold text-forest-800 mb-2">
            Get Full Access
          </DialogTitle>
          
          <Badge className="bg-golden-100 text-golden-700 border-golden-200 mx-auto">
            Premium Content Available
          </Badge>
        </DialogHeader>
        
        <div className="space-y-6 px-2">
          {/* Main message */}
          <div className="text-center space-y-4">
            <div className="p-4 bg-forest-50 rounded-lg border border-forest-200">
              <BookOpen className="w-8 h-8 mx-auto mb-3 text-forest-600" />
              <p className="text-forest-800 font-medium mb-2">
                Unlock all 6 chapters and premium features!
              </p>
              <p className="text-sm text-forest-600 leading-relaxed">
                Get access to the complete story, activities, family guides, and printable resources.
              </p>
            </div>
            
            {/* Contact information */}
            <div className="text-center p-4 bg-golden-50 rounded-lg border border-golden-200">
              <Mail className="w-6 h-6 mx-auto mb-2 text-golden-600" />
              <p className="text-forest-800 font-semibold mb-1">
                To gain full access contact:
              </p>
              <a 
                href="mailto:Hello@bravethingslab.com"
                className="text-forest-600 font-medium hover:text-forest-800 transition-colors underline"
                onClick={async () => {
                  // 🎯 NEW: Enhanced tracking for email contact link
                  try {
                    const { trackPageInteraction, sendEnhancedAnalytics } = await import('@/lib/platform-tracking');
                    
                    // Track the email contact click
                    trackPageInteraction('click', 'modal_email_contact_link', {
                      navigation_source: 'toc'
                    });
                    
                    // Send enhanced analytics immediately
                    await sendEnhancedAnalytics(0, 0, [], undefined);
                    
                    console.log(`📊 Enhanced Access Modal tracking:`, {
                      buttonType: 'modal_email_contact_link',
                      action: 'click_email_contact',
                      email: 'Hello@bravethingslab.com',
                      userType: 'preview_user',
                      navigationSource: 'toc'
                    });
                  } catch (error) {
                    console.warn('Failed to track email contact click:', error);
                  }
                }}
              >
                Hello@bravethingslab.com
              </a>
            </div>
          </div>
          
          {/* Action button */}
          <div className="flex justify-center">
            <Button 
              onClick={async () => {
                // 🎯 NEW: Enhanced tracking for modal "Continue Reading" button
                try {
                  const { trackPageInteraction, sendEnhancedAnalytics } = await import('@/lib/platform-tracking');
                  
                  // Track the modal "Continue Reading" button click
                  trackPageInteraction('click', 'modal_continue_reading_button', {
                    navigation_source: 'toc'
                  });
                  
                  // Send enhanced analytics immediately
                  await sendEnhancedAnalytics(0, 0, [], undefined); // TOC context
                  
                  console.log(`📊 Enhanced Access Modal tracking:`, {
                    buttonType: 'modal_continue_reading_button',
                    action: 'close_modal_continue_reading',
                    userType: 'preview_user',
                    navigationSource: 'toc'
                  });
                } catch (error) {
                  console.warn('Failed to track modal interaction:', error);
                }
                
                onClose();
              }}
              variant="outline"
              className="px-8 border-forest-300 text-forest-700 hover:bg-forest-50"
            >
              Continue Reading
            </Button>
          </div>
          
          {/* Footer note */}
          <div className="text-center pt-2">
            <div className="flex items-center justify-center gap-2 text-sm text-forest-600">
              <Heart className="w-4 h-4 text-coral-500" />
              <span>Thank you for being an early reader!</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
