// utils/filterPlansByRegion.ts
export function filterPlansByRegion(plans: any[], region: string, type: string) {
    return plans.filter(plan =>
      plan.locations.includes(region) && plan.id.startsWith(type)
    );
  }
  