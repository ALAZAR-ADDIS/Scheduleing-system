"use client";
import Link from "next/link";
import { CalendarDays, Clock, UserCheck, Bell, Twitter, Linkedin, CheckCircle } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-6 md:px-12 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-500 grid place-items-center">
            <CalendarDays size={14} className="text-white" />
          </div>
          <span className="text-sm font-bold text-gray-800">AppointManager</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          {["About"].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`}
              className="text-sm text-gray-500 hover:text-gray-800 transition-colors">{item}</a>
          ))}
        </nav>
        <Link href="/auth/login"
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors">
          Login
        </Link>
      </header>

      {/* ── Hero ── */}
      <section className="px-6 md:px-12 lg:px-20 py-16 md:py-24 flex flex-col md:flex-row items-center gap-10 max-w-7xl mx-auto w-full">
        <div className="flex-1">
          <span className="inline-block px-3 py-1 bg-orange-50 text-orange-500 text-xs font-semibold rounded-full mb-4 border border-orange-100">
            Client Booking Portal
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            Book Your Next<br />
            <span className="text-orange-500">Appointment Online</span>
          </h1>
          <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-md">
            Easily schedule a meeting with our team. Pick a date, choose a time slot, and we'll take care of the rest.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/auth/register"
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-orange-200 text-sm">
              Book an Appointment
            </Link>
            <Link href="/auth/login"
              className="px-6 py-3 border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold rounded-lg transition-colors text-sm">
              Sign In
            </Link>
          </div>
        </div>

        {/* Right — visual card */}
        <div className="flex-1 w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-gray-800">Upcoming Appointment</p>
              <span className="px-2.5 py-1 bg-green-50 text-green-600 text-xs font-semibold rounded-full">Confirmed</span>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-500 grid place-items-center text-white font-bold text-lg shrink-0">SJ</div>
              <div>
                <p className="text-sm font-bold text-gray-800">Sarah Johnson</p>
                <p className="text-xs text-orange-500 font-medium">Human Resources</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Date</p>
                <p className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                  <CalendarDays size={13} className="text-orange-400" /> Oct 24, 2025
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Time</p>
                <p className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                  <Clock size={13} className="text-orange-400" /> 10:00 AM
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <CheckCircle size={14} className="text-green-500 shrink-0" />
              <p className="text-xs text-gray-400">A calendar invite has been sent to your email.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="bg-gray-50 px-6 md:px-12 lg:px-20 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">How It Works</h2>
            <div className="w-12 h-1 bg-orange-500 rounded-full mx-auto mb-4" />
            <p className="text-gray-500 text-sm max-w-md mx-auto">Booking an appointment with our team takes less than 2 minutes.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: "01", icon: UserCheck, title: "Create Your Account", desc: "Register with your email to access the client portal and manage all your appointments in one place." },
              { step: "02", icon: CalendarDays, title: "Pick a Date & Time", desc: "Browse available slots from our team members and choose the time that works best for you." },
              { step: "03", icon: Bell, title: "Get Confirmed", desc: "Receive an instant confirmation and email reminder so you never miss your scheduled meeting." },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative">
                <span className="absolute top-4 right-4 text-3xl font-extrabold text-gray-100">{step}</span>
                <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-orange-500" />
                </div>
                <h3 className="text-base font-bold text-gray-800 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Us ── */}
      <section id="about" className="px-6 md:px-12 lg:px-20 py-16 md:py-20 max-w-5xl mx-auto w-full">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Why Book Through Our Portal?</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Our client portal gives you full control over your appointments — no phone calls, no waiting on hold. Everything is handled online, instantly.
            </p>
            <ul className="space-y-3">
              {[
                "See real-time availability of our team",
                "Choose your preferred meeting type — in-person or Google Meet",
                "Reschedule or cancel anytime from your dashboard",
                "Get automatic email reminders before your appointment",
              ].map(item => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                  <CheckCircle size={16} className="text-orange-500 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4">
            {[
              { value: "500+", label: "Appointments Booked" },
              { value: "98%", label: "Client Satisfaction" },
              { value: "< 2 min", label: "Average Booking Time" },
              { value: "24/7", label: "Portal Availability" },
            ].map(({ value, label }) => (
              <div key={label} className="bg-orange-50 rounded-2xl p-5 text-center border border-orange-100">
                <p className="text-2xl font-extrabold text-orange-500 mb-1">{value}</p>
                <p className="text-xs text-gray-500 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-orange-500 px-6 md:px-12 py-14 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready to book your appointment?</h2>
        <p className="text-orange-100 text-sm mb-7 max-w-sm mx-auto">Create a free account and schedule your first meeting with our team today.</p>
        <Link href="/auth/register"
          className="inline-block px-8 py-3 bg-white text-orange-500 font-bold rounded-xl hover:bg-orange-50 transition-colors shadow-md text-sm">
          Get Started — It&apos;s Free
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-white border-t border-gray-100 px-6 md:px-12 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-md bg-orange-500 grid place-items-center">
                <CalendarDays size={12} className="text-white" />
              </div>
              <span className="text-sm font-bold text-gray-800">AppointManager</span>
            </div>
            <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
              Your dedicated client booking portal. Schedule, manage and track your appointments with ease.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" className="w-8 h-8 rounded-full bg-gray-100 hover:bg-orange-50 flex items-center justify-center transition-colors">
              <Twitter size={14} className="text-gray-500" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-gray-100 hover:bg-orange-50 flex items-center justify-center transition-colors">
              <Linkedin size={14} className="text-gray-500" />
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-400">© 2025 AppointManager Inc. All rights reserved.</p>
          <p className="text-xs text-gray-400">▲ All Systems Operational</p>
        </div>
      </footer>

    </div>
  );
}
