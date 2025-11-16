// Diagnostic version - returns everything to understand the structure
export default defineComponent({
  async run({ steps, $ }) {
    // Return everything we can see
    return {
      success: false,
      diagnostic: true,
      stepsKeys: Object.keys(steps || {}),
      stepsTrigger: steps?.trigger,
      stepsTriggerKeys: Object.keys(steps?.trigger || {}),
      stepsTriggerEvent: steps?.trigger?.event,
      stepsTriggerEventKeys: Object.keys(steps?.trigger?.event || {}),
      stepsTriggerEventBody: steps?.trigger?.event?.body,
      stepsTriggerEventBodyType: typeof steps?.trigger?.event?.body,
      dollarSign: $,
      dollarKeys: $ ? Object.keys($) : null,
      fullSteps: JSON.stringify(steps).substring(0, 2000),
      message: 'This is a diagnostic version to see the structure'
    };
  },
})

