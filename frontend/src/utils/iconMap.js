import {
  Sparkles, Gem, Stethoscope, Smile, ShieldCheck, Crown, Syringe, Baby,
  HeartPulse, Award, Clock, Users,
} from "lucide-react";

// The admin stores the icon as a name such as "Gem". This maps it to the real icon.
const icons = { Sparkles, Gem, Stethoscope, Smile, ShieldCheck, Crown, Syringe, Baby, HeartPulse, Award, Clock, Users };

export const getServiceIcon = (name) => icons[name] || Sparkles;
