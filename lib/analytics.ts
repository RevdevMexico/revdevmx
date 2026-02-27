// Simple analytics tracking for development
export const analytics = {
  // Track page views
  pageView: (page: string) => {
    try {
      console.log(`Analytics: Page view - ${page}`)
      // In production, this would send to your analytics service
      if (typeof window !== "undefined" && (window as any).gtag) {
        ;(window as any).gtag("event", "page_view", {
          page_title: page,
          page_location: window.location.href,
        })
      }
    } catch (error) {
      console.warn("Analytics error:", error)
    }
  },

  // Track video interactions
  videoInteraction: (action: string) => {
    try {
      console.log(`Analytics: Video interaction - ${action}`)
      if (typeof window !== "undefined" && (window as any).gtag) {
        ;(window as any).gtag("event", "video_interaction", {
          action: action,
        })
      }
    } catch (error) {
      console.warn("Analytics error:", error)
    }
  },

  // Track CTA clicks
  ctaClick: (action: string) => {
    try {
      console.log(`Analytics: CTA click - ${action}`)
      if (typeof window !== "undefined" && (window as any).gtag) {
        ;(window as any).gtag("event", "cta_click", {
          action: action,
        })
      }
    } catch (error) {
      console.warn("Analytics error:", error)
    }
  },

  // Track login attempts
  loginAttempt: (success: boolean) => {
    try {
      console.log(`Analytics: Login attempt - ${success ? "success" : "failed"}`)
      if (typeof window !== "undefined" && (window as any).gtag) {
        ;(window as any).gtag("event", "login_attempt", {
          success: success,
        })
      }
    } catch (error) {
      console.warn("Analytics error:", error)
    }
  },

  // Track signup attempts
  signupAttempt: (success: boolean) => {
    try {
      console.log(`Analytics: Signup attempt - ${success ? "success" : "failed"}`)
      if (typeof window !== "undefined" && (window as any).gtag) {
        ;(window as any).gtag("event", "signup_attempt", {
          success: success,
        })
      }
    } catch (error) {
      console.warn("Analytics error:", error)
    }
  },

  // Track form submissions
  formSubmission: (formType: string, success: boolean) => {
    try {
      console.log(`Analytics: Form submission - ${formType} - ${success ? "success" : "failed"}`)
      if (typeof window !== "undefined" && (window as any).gtag) {
        ;(window as any).gtag("event", "form_submission", {
          form_type: formType,
          success: success,
        })
      }
    } catch (error) {
      console.warn("Analytics error:", error)
    }
  },

  // Track custom events
  customEvent: (eventName: string, properties?: Record<string, any>) => {
    try {
      console.log(`Analytics: Custom event - ${eventName}`, properties)
      if (typeof window !== "undefined" && (window as any).gtag) {
        ;(window as any).gtag("event", eventName, properties)
      }
    } catch (error) {
      console.warn("Analytics error:", error)
    }
  },
}
