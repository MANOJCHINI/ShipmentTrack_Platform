export const ROLE_LABELS = {
  admin: "ADMINISTRATOR",
  operator: "LOGISTICS OPERATOR",
  business: "BUSINESS CLIENT",
  customer: "CUSTOMER",
  // support: "SUPPORT AGENT",

  // Actual values returned by the API
  business_client: "BUSINESS CLIENT",
  logistics_operator: "LOGISTICS OPERATOR",
  customer: "CUSTOMER",
  // support_agent: "SUPPORT AGENT",
};

export const ROLE_DESCRIPTIONS = {
  admin: "Manage platform, users, security, monitoring & audits",
  operator: "Delivery personnel responsible for shipment execution",
  business_client: "Company client that sends goods through the platform",
  customer: "Track your packages & get real-time delivery updates",
  // support_agent: "Assist customers and investigate shipment issues",
};
export const STATUS_META = {
  CREATED: {
    label: "Created",
    bg: "bg-muted text-muted-foreground",
    dot: "bg-slate-400",
  },
  REACHED_HUB: {
    label: "Reached Hub",
    bg: "bg-green-100 text-green-700",
    dot: "bg-green-500",
  },
  PICKED_UP: {
    label: "Picked Up",
    bg: "bg-info/10 text-info",
    dot: "bg-info",
  },
  IN_TRANSIT: {
    label: "In Transit",
    bg: "bg-primary/10 text-primary",
    dot: "bg-primary",
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    bg: "bg-success/10 text-success",
    dot: "bg-success",
  },
  DELIVERED: {
    label: "Delivered",
    bg: "bg-success/10 text-success",
    dot: "bg-success",
  },
  FAILED_DELIVERY: {
    label: "Failed Delivery",
    bg: "bg-destructive/10 text-destructive",
    dot: "bg-destructive",
  },
  CANCELLED: {
    label: "Cancelled",
    bg: "bg-muted text-muted-foreground",
    dot: "bg-slate-400",
  },
};
