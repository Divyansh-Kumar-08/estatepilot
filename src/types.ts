export type Page =
  | "Dashboard"
  | "Leads"
  | "Follow-ups"
  | "Properties"
  | "Deals"
  | "AI Assistant"
  | "Settings";

export type LeadStatus = "New" | "Warm" | "Hot" | "Cold";

export type Lead = {
  id: number;
  name: string;
  phone: string;
  email: string;
  property: string;
  location: string;
  budget: string;
  status: LeadStatus;
  source: string;
  lastContact: string;
  nextFollowUp: string;
  notes: string;
  value?: string;
  time?: string;
};

export type FollowUp = {
  id: number;
  leadName: string;
  task: string;
  date: string;
  time: string;
  priority: "High" | "Medium" | "Low";
  completed: boolean;
  name?: string;
};

export type Property = {
  id: number;
  title: string;
  type: string;
  location: string;
  price: string;
  bedrooms: number;
  area: string;
  status: "Available" | "Reserved" | "Sold";
  name?: string;
};

export type Deal = {
  id: number;
  leadName: string;
  property: string;
  value: string;
  stage:
    | "New Lead"
    | "Qualified"
    | "Negotiation"
    | "Closing"
    | "Won";
  probability: number;
};