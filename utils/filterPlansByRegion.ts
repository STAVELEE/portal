// utils/filterPlansByRegion.ts

interface Plan {
    id: string
    locations: string[]
  }
  
  export default function filterPlansByRegion(plans: any[], regionId: string) {
    return plans.filter(p => p.locations?.includes(regionId))
  }
  
  