export type Notification = {
  id: number;
  type: "appointment" | "client" | "user";
  text: string;
  bold: string;
  time: string;
  read: boolean;
};

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 1, type: "appointment", text: "New appointment has been booked to", bold: "Abebe",  time: "5 mins ago",  read: false },
  { id: 2, type: "client",      text: "New client has registered",          bold: "",       time: "12 mins ago", read: false },
  { id: 3, type: "user",        text: "New user has been added",            bold: "",       time: "1 hour ago",  read: false },
];
