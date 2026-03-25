export type AppointmentStatus = "Scheduled" | "Completed" | "Cancelled";

export type Appointment = {
  id: string;
  date: string;
  time: string;
  meetingType: string;
  employee: string;
  employeeEmail: string;
  employeeColor: string;
  client: string;
  clientEmail: string;
  clientColor: string;
  department: string;
  status: AppointmentStatus;
  notes: string;
  meetingLink: string;
};

export const DEPARTMENTS = [
  "All Departments",
  "Design",
  "Marketing",
  "Sales",
  "Engineering",
  "HR",
  "Finance",
  "IT",
];

export const STATUS_FILTERS = ["All", "Scheduled", "Completed", "Cancelled"];

export const STATUS_STYLE: Record<AppointmentStatus, string> = {
  Scheduled: "bg-blue-100 text-blue-600",
  Completed: "bg-green-100 text-green-600",
  Cancelled: "bg-red-100 text-red-500",
};

export const STATUS_DOT: Record<AppointmentStatus, string> = {
  Scheduled: "bg-blue-500",
  Completed: "bg-green-500",
  Cancelled: "bg-red-500",
};

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: "APT-2023-0001", date: "Oct 24, 2023", time: "09:30 AM", meetingType: "Initial Consult",  employee: "Jane Doe",    employeeEmail: "j.doe@company.com",    employeeColor: "bg-orange-400", client: "Robert Wilson",   clientEmail: "r.wilson@example.com",   clientColor: "bg-orange-300", department: "Design",      status: "Scheduled", notes: "Discussing the preliminary layout for the upcoming dashboard redesign project. Focus on mobile responsiveness and accessibility standards.", meetingLink: "https://meet.company.com/j-doe-consult-2410" },
  { id: "APT-2023-0002", date: "Oct 24, 2023", time: "10:45 AM", meetingType: "Follow-up",        employee: "Abebe R.",    employeeEmail: "a.r@company.com",      employeeColor: "bg-yellow-500", client: "Mulugeta K.",    clientEmail: "m.k@example.com",        clientColor: "bg-yellow-300", department: "Marketing",   status: "Scheduled", notes: "Follow-up on the Q4 marketing campaign performance and next steps.", meetingLink: "https://meet.company.com/abebe-followup-2410" },
  { id: "APT-2023-0003", date: "Oct 24, 2023", time: "11:00 AM", meetingType: "Review",           employee: "Mike Smith",  employeeEmail: "m.smith@company.com",  employeeColor: "bg-blue-500",   client: "Sarah Jenkins",  clientEmail: "s.jenkins@example.com",  clientColor: "bg-blue-300",   department: "Sales",       status: "Completed", notes: "Quarterly sales review and pipeline discussion.", meetingLink: "https://meet.company.com/mike-review-2410" },
  { id: "APT-2023-0004", date: "Oct 24, 2023", time: "02:15 PM", meetingType: "Technical",        employee: "Amy Lee",     employeeEmail: "a.lee@company.com",    employeeColor: "bg-purple-500", client: "TechCorp Inc.",  clientEmail: "contact@techcorp.com",   clientColor: "bg-purple-300", department: "Engineering", status: "Cancelled", notes: "Technical architecture review for the new microservices migration.", meetingLink: "https://meet.company.com/amy-tech-2410" },
  { id: "APT-2023-0005", date: "Oct 24, 2023", time: "03:30 PM", meetingType: "Initial Consult",  employee: "Jane Doe",    employeeEmail: "j.doe@company.com",    employeeColor: "bg-orange-400", client: "Kevin Baker",    clientEmail: "k.baker@example.com",    clientColor: "bg-green-300",  department: "Design",      status: "Scheduled", notes: "Initial consultation for brand identity redesign project.", meetingLink: "https://meet.company.com/j-doe-kevin-2410" },
  { id: "APT-2023-0006", date: "Oct 25, 2023", time: "08:00 AM", meetingType: "Onboarding",       employee: "Tom Harris",  employeeEmail: "t.harris@company.com", employeeColor: "bg-green-500",  client: "Linda Moore",    clientEmail: "l.moore@example.com",    clientColor: "bg-teal-300",   department: "HR",          status: "Completed", notes: "New employee onboarding session covering company policies and tools.", meetingLink: "https://meet.company.com/tom-onboard-2510" },
  { id: "APT-2023-0007", date: "Oct 25, 2023", time: "09:15 AM", meetingType: "Budget Review",    employee: "Sara Ali",    employeeEmail: "s.ali@company.com",    employeeColor: "bg-pink-500",   client: "James Carter",   clientEmail: "j.carter@example.com",   clientColor: "bg-pink-300",   department: "Finance",     status: "Cancelled", notes: "Annual budget review and cost optimization discussion.", meetingLink: "https://meet.company.com/sara-budget-2510" },
  { id: "APT-2023-0008", date: "Oct 25, 2023", time: "10:30 AM", meetingType: "Support",          employee: "Chris Evans", employeeEmail: "c.evans@company.com",  employeeColor: "bg-indigo-500", client: "Olivia Brown",   clientEmail: "o.brown@example.com",    clientColor: "bg-indigo-300", department: "IT",          status: "Scheduled", notes: "IT support session for system migration and data backup procedures.", meetingLink: "https://meet.company.com/chris-support-2510" },
  { id: "APT-2023-0009", date: "Oct 25, 2023", time: "11:45 AM", meetingType: "Interview",        employee: "Mia Wong",    employeeEmail: "m.wong@company.com",   employeeColor: "bg-teal-500",   client: "Ethan Davis",    clientEmail: "e.davis@example.com",    clientColor: "bg-cyan-300",   department: "HR",          status: "Scheduled", notes: "Second round interview for the Senior HR Manager position.", meetingLink: "https://meet.company.com/mia-interview-2510" },
  { id: "APT-2023-0010", date: "Oct 25, 2023", time: "01:00 PM", meetingType: "Audit",            employee: "Jake Paul",   employeeEmail: "j.paul@company.com",   employeeColor: "bg-red-400",    client: "Sophia White",   clientEmail: "s.white@example.com",    clientColor: "bg-red-300",    department: "Finance",     status: "Completed", notes: "Internal financial audit review for Q3 reporting.", meetingLink: "https://meet.company.com/jake-audit-2510" },
  { id: "APT-2023-0011", date: "Oct 25, 2023", time: "02:30 PM", meetingType: "Support",          employee: "Nina Patel",  employeeEmail: "n.patel@company.com",  employeeColor: "bg-cyan-500",   client: "Liam Johnson",   clientEmail: "l.johnson@example.com",  clientColor: "bg-lime-300",   department: "IT",          status: "Cancelled", notes: "Network infrastructure upgrade planning and timeline review.", meetingLink: "https://meet.company.com/nina-support-2510" },
  { id: "APT-2023-0012", date: "Oct 26, 2023", time: "08:30 AM", meetingType: "Demo",             employee: "Mike Smith",  employeeEmail: "m.smith@company.com",  employeeColor: "bg-blue-500",   client: "Emma Wilson",    clientEmail: "e.wilson@example.com",   clientColor: "bg-blue-200",   department: "Sales",       status: "Scheduled", notes: "Product demo for the new CRM platform to potential enterprise client.", meetingLink: "https://meet.company.com/mike-demo-2610" },
  { id: "APT-2023-0013", date: "Oct 26, 2023", time: "09:45 AM", meetingType: "Technical",        employee: "Amy Lee",     employeeEmail: "a.lee@company.com",    employeeColor: "bg-purple-500", client: "Noah Martinez",  clientEmail: "n.martinez@example.com", clientColor: "bg-purple-200", department: "Engineering", status: "Completed", notes: "Code review and architecture discussion for the payment gateway integration.", meetingLink: "https://meet.company.com/amy-tech-2610" },
  { id: "APT-2023-0014", date: "Oct 26, 2023", time: "11:00 AM", meetingType: "Training",         employee: "Tom Harris",  employeeEmail: "t.harris@company.com", employeeColor: "bg-green-500",  client: "Ava Thompson",   clientEmail: "a.thompson@example.com", clientColor: "bg-green-200",  department: "HR",          status: "Scheduled", notes: "Leadership training workshop for mid-level managers.", meetingLink: "https://meet.company.com/tom-training-2610" },
  { id: "APT-2023-0015", date: "Oct 26, 2023", time: "12:15 PM", meetingType: "Strategy",         employee: "Sara Ali",    employeeEmail: "s.ali@company.com",    employeeColor: "bg-pink-500",   client: "Mason Garcia",   clientEmail: "m.garcia@example.com",   clientColor: "bg-pink-200",   department: "Marketing",   status: "Cancelled", notes: "Q4 marketing strategy planning and budget allocation review.", meetingLink: "https://meet.company.com/sara-strategy-2610" },
  { id: "APT-2023-0016", date: "Oct 26, 2023", time: "01:30 PM", meetingType: "Support",          employee: "Chris Evans", employeeEmail: "c.evans@company.com",  employeeColor: "bg-indigo-500", client: "Isabella Lee",   clientEmail: "i.lee@example.com",      clientColor: "bg-indigo-200", department: "IT",          status: "Completed", notes: "Cloud infrastructure migration support and monitoring setup.", meetingLink: "https://meet.company.com/chris-support-2610" },
  { id: "APT-2023-0017", date: "Oct 26, 2023", time: "03:00 PM", meetingType: "Review",           employee: "Jane Doe",    employeeEmail: "j.doe@company.com",    employeeColor: "bg-orange-400", client: "Lucas Anderson", clientEmail: "l.anderson@example.com", clientColor: "bg-orange-200", department: "Design",      status: "Scheduled", notes: "Design review for the new mobile app UI components and style guide.", meetingLink: "https://meet.company.com/jane-review-2610" },
  { id: "APT-2023-0018", date: "Oct 27, 2023", time: "08:00 AM", meetingType: "Audit",            employee: "Mia Wong",    employeeEmail: "m.wong@company.com",   employeeColor: "bg-teal-500",   client: "Charlotte Hall", clientEmail: "c.hall@example.com",     clientColor: "bg-teal-200",   department: "Finance",     status: "Scheduled", notes: "Compliance audit preparation and documentation review.", meetingLink: "https://meet.company.com/mia-audit-2710" },
  { id: "APT-2023-0019", date: "Oct 27, 2023", time: "09:30 AM", meetingType: "Demo",             employee: "Jake Paul",   employeeEmail: "j.paul@company.com",   employeeColor: "bg-red-400",    client: "Elijah Young",   clientEmail: "e.young@example.com",    clientColor: "bg-red-200",    department: "Sales",       status: "Cancelled", notes: "Product demo cancelled due to client scheduling conflict.", meetingLink: "https://meet.company.com/jake-demo-2710" },
  { id: "APT-2023-0020", date: "Oct 27, 2023", time: "10:45 AM", meetingType: "Support",          employee: "Nina Patel",  employeeEmail: "n.patel@company.com",  employeeColor: "bg-cyan-500",   client: "Amelia King",    clientEmail: "a.king@example.com",     clientColor: "bg-cyan-200",   department: "IT",          status: "Completed", notes: "Security patch deployment and vulnerability assessment.", meetingLink: "https://meet.company.com/nina-support-2710" },
  { id: "APT-2023-0021", date: "Oct 27, 2023", time: "12:00 PM", meetingType: "Strategy",         employee: "Abebe R.",    employeeEmail: "a.r@company.com",      employeeColor: "bg-yellow-500", client: "Harper Scott",   clientEmail: "h.scott@example.com",    clientColor: "bg-yellow-200", department: "Marketing",   status: "Scheduled", notes: "Social media strategy and content calendar planning for November.", meetingLink: "https://meet.company.com/abebe-strategy-2710" },
  { id: "APT-2023-0022", date: "Oct 27, 2023", time: "01:15 PM", meetingType: "Training",         employee: "Tom Harris",  employeeEmail: "t.harris@company.com", employeeColor: "bg-green-500",  client: "Evelyn Adams",   clientEmail: "e.adams@example.com",    clientColor: "bg-green-300",  department: "HR",          status: "Completed", notes: "Diversity and inclusion training workshop for all department heads.", meetingLink: "https://meet.company.com/tom-training-2710" },
  { id: "APT-2023-0023", date: "Oct 28, 2023", time: "09:00 AM", meetingType: "Technical",        employee: "Amy Lee",     employeeEmail: "a.lee@company.com",    employeeColor: "bg-purple-500", client: "Benjamin Nelson",clientEmail: "b.nelson@example.com",   clientColor: "bg-purple-300", department: "Engineering", status: "Scheduled", notes: "API integration planning for the third-party analytics platform.", meetingLink: "https://meet.company.com/amy-tech-2810" },
  { id: "APT-2023-0024", date: "Oct 28, 2023", time: "10:15 AM", meetingType: "Support",          employee: "Chris Evans", employeeEmail: "c.evans@company.com",  employeeColor: "bg-indigo-500", client: "Scarlett Baker", clientEmail: "s.baker@example.com",    clientColor: "bg-indigo-300", department: "IT",          status: "Cancelled", notes: "Server maintenance window cancelled due to critical production issue.", meetingLink: "https://meet.company.com/chris-support-2810" },
  { id: "APT-2023-0025", date: "Oct 28, 2023", time: "11:30 AM", meetingType: "Budget Review",    employee: "Sara Ali",    employeeEmail: "s.ali@company.com",    employeeColor: "bg-pink-500",   client: "Henry Rivera",   clientEmail: "h.rivera@example.com",   clientColor: "bg-pink-300",   department: "Finance",     status: "Scheduled", notes: "Year-end budget review and 2024 financial planning session.", meetingLink: "https://meet.company.com/sara-budget-2810" },
];
