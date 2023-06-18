export const FADE_IN_ANIMATION_SETTINGS = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.2 },
};

export const FADE_DOWN_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: -10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" } },
};

export const FADE_UP_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" } },
};

export const DEPLOY_URL =
  "https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsteven-tey%2Fprecedent&project-name=precedent&repository-name=precedent&demo-title=Precedent&demo-description=An%20opinionated%20collection%20of%20components%2C%20hooks%2C%20and%20utilities%20for%20your%20Next%20project.&demo-url=https%3A%2F%2Fprecedent.dev&demo-image=https%3A%2F%2Fprecedent.dev%2Fapi%2Fog&env=DATABASE_URL,GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET,NEXTAUTH_SECRET&envDescription=How%20to%20get%20these%20env%20variables%3A&envLink=https%3A%2F%2Fgithub.com%2Fsteven-tey%2Fprecedent%2Fblob%2Fmain%2F.env.example";


  // Endpoints for the API
export const VEHICLES_ROUTE = "/api/admin/vehicles";
export const DRIVERS_ROUTE = "/api/admin/drivers";
export const BRANCHES_ROUTE = "/api/admin/branches";
export const SHIPMENTS_ROUTE = "/api/admin/packages";
export const MANAGERS_ROUTE = "/api/admin/managers";

export const DRIVER_SHIPMENTS_ROUTE = "/api/driver/packages";

export const INTERNAL_VEHICLES_ROUTE = "/admin/vehicles";
export const INTERNAL_DRIVERS_ROUTE = "/admin/drivers";
export const INTERNAL_SHIPMENTS_ROUTE = "/admin/packages";
export const INTERNAL_BRANCHES_ROUTE = "/admin/branches";
export const INTERNAL_MANAGERS_ROUTE = "/admin/managers";

export const INTERNAL_DRIVER_SHIPMENTS_ROUTE = "/driver/packages";


