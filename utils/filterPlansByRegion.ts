// utils/filterPlansByRegion.ts

interface Plan {
    id: string
    locations: string[]
  }
  
  export default function filterPlansByRegion(plans: Plan[], regionId: string) {
    return plans.filter(plan => plan.locations.includes(regionId))
  }
  