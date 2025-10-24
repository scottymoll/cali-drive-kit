// Privacy-friendly analytics implementation
interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
}

class Analytics {
  private isEnabled: boolean;
  private baseUrl: string;

  constructor() {
    this.isEnabled = typeof window !== 'undefined' && process.env.NODE_ENV === 'production';
    this.baseUrl = 'https://plausible.io/api/event';
  }

  // Track page views
  trackPageView(page: string) {
    if (!this.isEnabled) return;
    
    this.sendEvent({
      name: 'pageview',
      properties: {
        url: window.location.href,
        page
      }
    });
  }

  // Track conversion events
  trackConversion(eventName: string, properties: Record<string, any> = {}) {
    if (!this.isEnabled) return;

    this.sendEvent({
      name: eventName,
      properties: {
        ...properties,
        timestamp: new Date().toISOString()
      }
    });
  }

  // Track CTA clicks
  trackCTAClick(ctaType: 'basic' | 'premium', location: string) {
    this.trackConversion('click_cta', {
      cta_type: ctaType,
      location,
      utm_source: this.getUTMParam('utm_source') || 'direct',
      utm_medium: this.getUTMParam('utm_medium') || 'organic',
      utm_campaign: this.getUTMParam('utm_campaign') || 'default'
    });
  }

  // Track checkout events
  trackCheckoutStarted(plan: 'basic' | 'premium') {
    this.trackConversion('checkout_started', {
      plan,
      value: plan === 'basic' ? 19.99 : 97.00,
      currency: 'USD'
    });
  }

  // Track purchase completion
  trackPurchaseSuccess(plan: 'basic' | 'premium', transactionId?: string) {
    this.trackConversion('purchase_success', {
      plan,
      value: plan === 'basic' ? 19.99 : 97.00,
      currency: 'USD',
      transaction_id: transactionId
    });
  }

  // Track pricing section views
  trackPricingView() {
    this.trackConversion('view_pricing');
  }

  // Track outbound clicks
  trackOutboundClick(url: string, linkText: string) {
    this.trackConversion('outbound_click', {
      url,
      link_text: linkText
    });
  }

  // Get UTM parameters
  private getUTMParam(param: string): string | null {
    if (typeof window === 'undefined') return null;
    
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  // Send event to analytics service
  private async sendEvent(event: AnalyticsEvent) {
    if (!this.isEnabled) return;

    try {
      await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: event.name,
          url: window.location.href,
          domain: window.location.hostname,
          props: event.properties
        })
      });
    } catch (error) {
      console.warn('Analytics event failed:', error);
    }
  }

  // A/B testing helper
  getVariant(testName: string): 'a' | 'b' {
    if (typeof window === 'undefined') return 'a';
    
    const urlParams = new URLSearchParams(window.location.search);
    const variant = urlParams.get('ab');
    
    if (variant === 'b') return 'b';
    return 'a';
  }

  // Track A/B test exposure
  trackABTest(testName: string, variant: 'a' | 'b') {
    this.trackConversion('ab_test_exposure', {
      test_name: testName,
      variant
    });
  }
}

// Export singleton instance
export const analytics = new Analytics();

// Export individual tracking functions for convenience
export const trackPageView = (page: string) => analytics.trackPageView(page);
export const trackCTAClick = (ctaType: 'basic' | 'premium', location: string) => analytics.trackCTAClick(ctaType, location);
export const trackCheckoutStarted = (plan: 'basic' | 'premium') => analytics.trackCheckoutStarted(plan);
export const trackPurchaseSuccess = (plan: 'basic' | 'premium', transactionId?: string) => analytics.trackPurchaseSuccess(plan, transactionId);
export const trackPricingView = () => analytics.trackPricingView();
export const trackOutboundClick = (url: string, linkText: string) => analytics.trackOutboundClick(url, linkText);
