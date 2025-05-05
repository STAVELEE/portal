export function filterPlansByRegion(plans: any[], regionId: string) {
    if (!regionId) return []
    return plans.filter(plan => Array.isArray(plan.locations) && plan.locations.includes(regionId))
  }
  