// Google Analytics utility functions
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: url,
    });
  }
};

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track AI chat interactions
export const trackAIChat = (action: 'chat_opened' | 'message_sent' | 'response_received') => {
  trackEvent(action, 'AI_Chat');
};

// Track policy interactions
export const trackPolicyView = (policyId: string) => {
  trackEvent('policy_viewed', 'Policy_Engagement', policyId);
};

// Track contact form submissions
export const trackContactForm = (action: 'form_submitted' | 'form_error') => {
  trackEvent(action, 'Contact_Form');
};

// Track document downloads
export const trackDocumentDownload = (documentType: string) => {
  trackEvent('document_download', 'Document_Engagement', documentType);
};

// Track district policy views
export const trackDistrictView = (districtName: string) => {
  trackEvent('district_viewed', 'District_Engagement', districtName);
};