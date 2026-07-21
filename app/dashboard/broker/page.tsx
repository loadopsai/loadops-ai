"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/app/lib/supabase";
import { usePlan } from "@/app/lib/usePlan";
import { canPostBrokerLoad } from "@/app/lib/canPostLoad";
import UpgradePlan from "@/app/component/UpgradePlan";
import {
  getUpgradeLink,
  getRecommendedPlan,
} from "@/app/lib/upgradeLinks";

type LoadStatus = "available" | "booked" | "in_transit" | "delivered" | "cancelled";

type Load = {
  id: string;
  company_name: string;
  contact: string;
  email: string;
  phone: string;
  pickup_location: string;
  delivery_location: string;
  equipment: string;
  weight: string;
  total_rate: string;
  mc_number: string;
  usdot: string;
  pickup_date: string;
  delivery_date: string;
  description: string;
  status: LoadStatus;
  broker_id?: string;
  created_at?: string;
};

type Toast = { id: number; type: "success" | "error" | "info"; message: string };

type BookingRequestStatus = "pending" | "approved" | "declined";

type BookingRequest = {
  id: string;
  load_id: string;
  broker_id: string;
  carrier_id: string;
  carrier_name: string;
  carrier_contact: string;
  carrier_phone: string;
  carrier_email: string;
  carrier_mc: string;
  note: string;
  pickup_location: string;
  delivery_location: string;
  equipment: string;
  total_rate: string;
  pickup_date: string;
  status: BookingRequestStatus;
  created_at?: string;
};

const EMPTY_FORM = {
  company_name: "",
  contact: "",
  email: "",
  phone: "",
  pickup_location: "",
  delivery_location: "",
  equipment: "Box Truck",
  weight: "",
  total_rate: "",
  mc_number: "",
  usdot: "",
  pickup_date: "",
  delivery_date: "",
  description: "",
};

const STATUS_META: Record<LoadStatus, { label: string; bg: string; color: string }> = {
  available: { label: "Available", bg: "#E6F7EE", color: "#12A150" },
  booked: { label: "Booked", bg: "#EBF1FD", color: "#1A56DB" },
  in_transit: { label: "In Transit", bg: "#FEF3C7", color: "#D97706" },
  delivered: { label: "Delivered", bg: "#EDE9FE", color: "#7C3AED" },
  cancelled: { label: "Cancelled", bg: "#FEF2F2", color: "#DC2626" },
};

export default function BrokerDashboard() {
  const [upgradeMessage, setUpgradeMessage] = useState("");
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const { plan } = usePlan();

  const capitalizeWords = (text: string) => {
    if (!text) return "";
    return text.toLowerCase().split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  };

  const [userId, setUserId] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});

  const [loads, setLoads] = useState<Load[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loadingLoads, setLoadingLoads] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [decidingId, setDecidingId] = useState<string | null>(null);
  const [requestsTab, setRequestsTab] = useState<"pending" | "all">("pending");

  const [toasts, setToasts] = useState<Toast[]>([]);

  // search / filter / sort
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | LoadStatus>("all");
  const [equipmentFilter, setEquipmentFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "rate_high" | "rate_low" | "pickup_soon">("newest");

  // ---------- toast helpers ----------
  const pushToast = (type: Toast["type"], message: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800);
  };

  // ---------- auth ----------
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id ?? null);
      setAuthChecked(true);
    };
    init();
  }, []);

  // ---------- fetch loads (scoped to this broker) ----------
  const fetchLoads = async (brokerId: string) => {
    setLoadingLoads(true);
    const { data, error } = await supabase
      .from("loads")
      .select("*")
      .eq("broker_id", brokerId)
      .order("created_at", { ascending: false });
    if (error) {
      pushToast("error", "Could not load your postings: " + error.message);
    } else {
      setLoads(data || []);
    }
    setLoadingLoads(false);
  };

  // ---------- fetch booking requests (scoped to this broker) ----------
  const fetchBookingRequests = async (brokerId: string) => {
    setLoadingRequests(true);
    const { data, error } = await supabase
      .from("booking_requests")
      .select("*")
      .eq("broker_id", brokerId)
      .order("created_at", { ascending: false });
    if (error) {
      pushToast("error", "Could not load booking requests: " + error.message);
    } else {
      setBookingRequests(data || []);
    }
    setLoadingRequests(false);
  };

  useEffect(() => {
    if (authChecked && userId) {
      fetchLoads(userId);
      fetchBookingRequests(userId);
    }
    if (authChecked && !userId) {
      setLoadingLoads(false);
      setLoadingRequests(false);
    }
  }, [authChecked, userId]);

  // notify the broker in-app once, the first time pending requests are loaded
  useEffect(() => {
    if (!loadingRequests) {
      const pendingCount = bookingRequests.filter((r) => r.status === "pending").length;
      if (pendingCount > 0) {
        pushToast("info", `You have ${pendingCount} pending booking request${pendingCount !== 1 ? "s" : ""} awaiting review.`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingRequests]);

  // ---------- approve / decline booking requests ----------
  const notifyCarrierOfDecision = async (req: BookingRequest, approved: boolean) => {
    if (!req.carrier_email) return;
    try {
      const res = await fetch("/api/notify-booking-decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carrierEmail: req.carrier_email,
          carrierName: req.carrier_name,
          approved,
          pickupLocation: req.pickup_location,
          deliveryLocation: req.delivery_location,
          totalRate: req.total_rate,
          equipment: req.equipment,
          pickupDate: req.pickup_date,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error("Carrier decision notification failed:", body?.error || res.statusText);
      }
    } catch (err) {
      console.error("Carrier decision notification request failed:", err);
    }
  };

  const approveRequest = async (req: BookingRequest) => {
    if (!confirm(`Approve ${req.carrier_name || "this carrier"}'s request for ${req.pickup_location} → ${req.delivery_location}?`)) return;
    setDecidingId(req.id);

    const { error: reqError } = await supabase
      .from("booking_requests")
      .update({ status: "approved", decided_at: new Date().toISOString() })
      .eq("id", req.id);

    if (reqError) {
      setDecidingId(null);
      pushToast("error", reqError.message);
      return;
    }

    const { error: loadError } = await supabase
      .from("loads")
      .update({ status: "booked" })
      .eq("id", req.load_id);

    setDecidingId(null);

    if (loadError) {
      pushToast("error", "Request approved, but couldn't update the load status: " + loadError.message);
    } else {
      pushToast("success", "Booking approved — the load is now marked Booked.");
    }

    notifyCarrierOfDecision(req, true);
    if (userId) { fetchBookingRequests(userId); fetchLoads(userId); }
  };

  const declineRequest = async (req: BookingRequest) => {
    if (!confirm(`Decline ${req.carrier_name || "this carrier"}'s request?`)) return;
    setDecidingId(req.id);

    const { error } = await supabase
      .from("booking_requests")
      .update({ status: "declined", decided_at: new Date().toISOString() })
      .eq("id", req.id);

    setDecidingId(null);

    if (error) { pushToast("error", error.message); return; }
    pushToast("info", "Booking request declined.");
    notifyCarrierOfDecision(req, false);
    if (userId) fetchBookingRequests(userId);
  };

  // ---------- form handlers ----------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "usdot" ? value.toUpperCase() : value });
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: false }));
  };

  const validateForm = () => {
    const required = [
      "company_name", "contact", "email", "pickup_location",
      "delivery_location", "weight", "total_rate", "pickup_date", "delivery_date",
    ];
    const errors: Record<string, boolean> = {};
    required.forEach((field) => {
      if (!String((form as any)[field] || "").trim()) errors[field] = true;
    });

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    if (form.email && !emailOk) errors.email = true;

    if (form.pickup_date && form.delivery_date) {
      if (new Date(form.delivery_date).getTime() < new Date(form.pickup_date).getTime()) {
        errors.delivery_date = true;
      }
    }

    if (form.total_rate && (isNaN(Number(form.total_rate)) || Number(form.total_rate) <= 0)) {
      errors.total_rate = true;
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      if (errors.delivery_date && form.pickup_date && form.delivery_date) {
        pushToast("error", "Delivery date can't be before the pickup date.");
      } else if (errors.email) {
        pushToast("error", "Please enter a valid email address.");
      } else if (errors.total_rate) {
        pushToast("error", "Total rate must be a positive number.");
      } else {
        pushToast("error", "Please fill in all required fields (marked in red).");
      }
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      pushToast("error", "Please log in first.");
      return;
    }

    const permission = await canPostBrokerLoad(user.id, plan);
    if (!editingId && !permission.allowed) {
      setUpgradeMessage(permission.message || "");
      setUpgradeOpen(true);
      return;
    }

    if (!validateForm()) return;

    setSubmitting(true);
    const payload = {
      ...form,
      pickup_date: form.pickup_date || null,
      delivery_date: form.delivery_date || null,
    };

    let res;
    if (editingId) {
      res = await supabase.from("loads").update(payload).eq("id", editingId);
    } else {
      res = await supabase.from("loads").insert([
        { ...payload, status: "available", broker_id: user.id },
      ]);
    }
    setSubmitting(false);

    if (res.error) { pushToast("error", res.error.message); return; }
    pushToast("success", editingId ? "Load updated." : "Load posted.");
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setFormErrors({});
    fetchLoads(user.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this load? This can't be undone.")) return;
    const { error } = await supabase.from("loads").delete().eq("id", id);
    if (error) { pushToast("error", error.message); }
    else { pushToast("success", "Load deleted."); if (userId) fetchLoads(userId); }
  };

  const handleEdit = (load: Load) => {
    setEditingId(load.id);
    setFormErrors({});
    setForm({
      company_name: load.company_name || "", contact: load.contact || "", email: load.email || "",
      phone: load.phone || "",
      pickup_location: load.pickup_location || "", delivery_location: load.delivery_location || "",
      equipment: load.equipment || "Box Truck", weight: load.weight || "", total_rate: load.total_rate || "",
      mc_number: load.mc_number || "", usdot: load.usdot || "", pickup_date: load.pickup_date || "",
      delivery_date: load.delivery_date || "", description: load.description || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDuplicate = async (load: Load) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const permission = await canPostBrokerLoad(user.id, plan);
      if (!permission.allowed) {
        setUpgradeMessage(permission.message || "");
        setUpgradeOpen(true);
        return;
      }
    }
    setEditingId(null);
    setFormErrors({});
    setForm({
      company_name: load.company_name || "", contact: load.contact || "", email: load.email || "",
      phone: load.phone || "",
      pickup_location: load.pickup_location || "", delivery_location: load.delivery_location || "",
      equipment: load.equipment || "Box Truck", weight: load.weight || "", total_rate: load.total_rate || "",
      mc_number: load.mc_number || "", usdot: load.usdot || "", pickup_date: "",
      delivery_date: "", description: load.description || "",
    });
    pushToast("info", "Load duplicated — set new dates and post when ready.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormErrors({});
    setForm({ ...EMPTY_FORM });
  };

  const handleStatusChange = async (id: string, status: LoadStatus) => {
    const { error } = await supabase.from("loads").update({ status }).eq("id", id);
    if (error) { pushToast("error", error.message); return; }
    setLoads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    pushToast("success", `Status updated to "${STATUS_META[status].label}".`);
  };

  const formatDate = (date: string) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString(undefined, {
      month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
    });
  };

  const exportCSV = () => {
    if (loads.length === 0) { pushToast("info", "No loads to export yet."); return; }
    const headers = [
      "Company", "Contact", "Email", "Phone", "Pickup", "Delivery", "Equipment", "Weight",
      "Total Rate", "MC Number", "USDOT", "Pickup Date", "Delivery Date", "Status", "Notes",
    ];
    const rows = loads.map((l) => [
      l.company_name, l.contact, l.email, l.phone, l.pickup_location, l.delivery_location, l.equipment,
      l.weight, l.total_rate, l.mc_number, l.usdot, l.pickup_date, l.delivery_date, l.status, l.description,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `loads-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const equipmentColors: Record<string, { bg: string; color: string }> = {
    "Dry Van":           { bg: "#EBF1FD", color: "#1A56DB" },
    "Reefer":            { bg: "#E6F7EE", color: "#12A150" },
    "Flatbed":           { bg: "#FEF3C7", color: "#D97706" },
    "FlatBed":           { bg: "#FEF3C7", color: "#D97706" },
    "Box Truck":         { bg: "#EDE9FE", color: "#7C3AED" },
    "Sprinter/Cargo Van":{ bg: "#FFF7ED", color: "#C2410C" },
    "Tanker":            { bg: "#FFF1F2", color: "#E11D48" },
    "HotShot":           { bg: "#F0FDF4", color: "#166534" },
    "Step Deck":         { bg: "#F0F9FF", color: "#0369A1" },
    "Power Only":        { bg: "#FDF4FF", color: "#A21CAF" },
    "Other":             { bg: "#EFF1F5", color: "#4A5568" },
  };

  // ---------- derived: filtered + sorted loads ----------
  const equipmentOptions = useMemo(
    () => Array.from(new Set(loads.map((l) => l.equipment).filter(Boolean))),
    [loads]
  );

  const visibleLoads = useMemo(() => {
    let list = [...loads];

    if (statusFilter !== "all") list = list.filter((l) => (l.status || "available") === statusFilter);
    if (equipmentFilter !== "all") list = list.filter((l) => l.equipment === equipmentFilter);

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((l) =>
        [l.company_name, l.contact, l.pickup_location, l.delivery_location, l.mc_number, l.usdot]
          .some((field) => (field || "").toLowerCase().includes(q))
      );
    }

    switch (sortBy) {
      case "oldest":
        list.sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime());
        break;
      case "rate_high":
        list.sort((a, b) => (parseFloat(b.total_rate) || 0) - (parseFloat(a.total_rate) || 0));
        break;
      case "rate_low":
        list.sort((a, b) => (parseFloat(a.total_rate) || 0) - (parseFloat(b.total_rate) || 0));
        break;
      case "pickup_soon":
        list.sort((a, b) => new Date(a.pickup_date || 0).getTime() - new Date(b.pickup_date || 0).getTime());
        break;
      default: // newest
        list.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    }

    return list;
  }, [loads, statusFilter, equipmentFilter, searchQuery, sortBy]);

  // ---------- stats ----------
  const availableCount = loads.filter((l) => (l.status || "available") === "available").length;
  const bookedCount = loads.filter((l) => l.status === "booked" || l.status === "in_transit").length;
  const totalBookedRevenue = loads
    .filter((l) => l.status === "booked" || l.status === "in_transit" || l.status === "delivered")
    .reduce((s, l) => s + (parseFloat(l.total_rate) || 0), 0);
  const avgRate = loads.length > 0
    ? Math.round(loads.reduce((s, l) => s + (parseFloat(l.total_rate) || 0), 0) / loads.length)
    : 0;
  const pendingRequests = bookingRequests.filter((r) => r.status === "pending");
  const visibleRequests = requestsTab === "pending" ? pendingRequests : bookingRequests;

  return (
    <main style={{ minHeight: "100vh", background: "#F7F8FA", fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0F1520" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap');

        :root {
          --white:    #FFFFFF;
          --bg:       #F7F8FA;
          --bg2:      #EFF1F5;
          --border:   #E4E7ED;
          --border2:  #D0D5E0;
          --txt:      #0F1520;
          --txt2:     #3D4A5C;
          --txt3:     #4A5568;
          --txt4:     #6B7A8D;
          --blue:     #1A56DB;
          --blue-h:   #1446C0;
          --blue-l:   #EBF1FD;
          --blue-m:   #C7D9FA;
          --green:    #12A150;
          --green-l:  #E6F7EE;
          --amber:    #D97706;
          --amber-l:  #FEF3C7;
          --purple:   #7C3AED;
          --purple-l: #EDE9FE;
          --red:      #DC2626;
          --red-l:    #FEF2F2;
          --yellow:   #D97706;
          --yellow-l: #FFFBEB;
        }

        * { box-sizing: border-box; }

        /* PAGE WRAPPER */
        .bd-page { padding: 40px 5%; max-width: 1200px; margin: 0 auto; }

        /* PAGE HEADER */
        .bd-page-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 24px; }
        .bd-page-eyebrow { display: flex; align-items: center; gap: 8px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--green); margin-bottom: 8px; }
        .bd-page-eyebrow::before { content: ''; width: 20px; height: 2px; background: var(--green); border-radius: 1px; }
        .bd-page-title { font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 800; letter-spacing: -0.04em; color: var(--txt); line-height: 1.1; margin-bottom: 6px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .bd-page-title em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: var(--green); }
        .bd-page-sub { font-size: 0.86rem; color: var(--txt3); line-height: 1.65; }
        .bd-export-btn { padding: 10px 18px; border-radius: 10px; font-size: 0.8rem; font-weight: 700; border: 1.5px solid var(--border2); background: var(--white); color: var(--txt2); cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; white-space: nowrap; }
        .bd-export-btn:hover { border-color: var(--green); color: var(--green); }

        /* STATS BAR */
        .bd-stats { display: grid; grid-template-columns: repeat(6, 1fr); gap: 14px; margin-bottom: 32px; }
        .bd-stat { background: var(--white); border: 1px solid var(--border); border-radius: 14px; padding: 18px 20px; }
        .bd-stat-n { font-size: 1.6rem; font-weight: 800; color: var(--txt); letter-spacing: -0.04em; line-height: 1; margin-bottom: 4px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .bd-stat-n span { color: var(--green); }
        .bd-stat-l { font-size: 0.68rem; font-weight: 600; color: var(--txt3); text-transform: uppercase; letter-spacing: 0.07em; }

        /* FORM CARD */
        .bd-form-card { background: var(--white); border: 1px solid var(--border); border-radius: 18px; padding: 32px; margin-bottom: 36px; }
        .bd-form-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
        .bd-form-title { font-size: 1rem; font-weight: 800; color: var(--txt); letter-spacing: -0.02em; display: flex; align-items: center; gap: 8px; }
        .bd-form-title-icon { width: 32px; height: 32px; border-radius: 8px; background: var(--green-l); display: flex; align-items: center; justify-content: center; font-size: 1rem; }

        /* SECTION LABEL */
        .bd-section-label { font-size: 0.68rem; font-weight: 700; color: var(--txt3); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px; margin-top: 20px; }
        .bd-section-label:first-of-type { margin-top: 0; }

        /* FORM GRID */
        .bd-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .bd-form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }

        /* INPUT */
        .bd-input {
          width: 100%;
          padding: 10px 14px;
          background: var(--bg);
          border: 1.5px solid var(--border2);
          border-radius: 10px;
          color: var(--txt);
          font-size: 0.83rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          appearance: none;
        }
        .bd-input:focus { border-color: var(--green); box-shadow: 0 0 0 3px rgba(18,161,80,0.1); background: var(--white); }
        .bd-input::placeholder { color: var(--txt4); }
        .bd-input-full { grid-column: 1 / -1; }
        .bd-input-error { border-color: var(--red) !important; background: var(--red-l) !important; }
        .bd-field-hint { font-size: 0.68rem; color: var(--txt4); margin-top: 4px; }

        /* DIVIDER */
        .bd-divider { height: 1px; background: var(--border); margin: 20px 0; }

        /* FORM ACTIONS */
        .bd-form-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 24px; }
        .bd-btn { padding: 10px 24px; border-radius: 10px; font-size: 0.83rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; display: inline-flex; align-items: center; gap: 6px; }
        .bd-btn-primary { background: var(--green); color: #fff; }
        .bd-btn-primary:hover { background: #0e8f45; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(18,161,80,0.25); }
        .bd-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none; }
        .bd-btn-ghost { background: transparent; color: var(--txt3); border: 1.5px solid var(--border2); }
        .bd-btn-ghost:hover { color: var(--txt); border-color: var(--border2); }

        /* LOADS SECTION HEADER */
        .bd-loads-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; flex-wrap: wrap; gap: 10px; }
        .bd-loads-title { font-size: 1rem; font-weight: 800; color: var(--txt); letter-spacing: -0.02em; }
        .bd-loads-count { font-size: 0.72rem; font-weight: 700; padding: 3px 10px; border-radius: 20px; background: var(--green-l); color: var(--green); }

        /* FILTER BAR */
        .bd-filter-bar { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 18px; background: var(--white); border: 1px solid var(--border); border-radius: 14px; padding: 14px 16px; }
        .bd-filter-search { flex: 1; min-width: 180px; }
        .bd-filter-select { min-width: 140px; }

        /* LOAD CARD */
        .bd-load-card { background: var(--white); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; transition: box-shadow 0.2s, transform 0.2s; margin-bottom: 14px; }
        .bd-load-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.08); transform: translateY(-2px); }

        .bd-load-top { padding: 20px 24px 16px; border-bottom: 1px solid var(--border); display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
        .bd-load-company-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 4px; }
        .bd-load-company { font-size: 1.05rem; font-weight: 800; color: var(--txt); letter-spacing: -0.02em; }
        .bd-load-route { font-size: 0.85rem; color: var(--txt2); font-weight: 500; display: flex; align-items: center; gap: 6px; }
        .bd-load-route-arrow { color: var(--txt4); font-size: 0.75rem; }
        .bd-load-rate { font-size: 1.2rem; font-weight: 800; color: var(--green); letter-spacing: -0.03em; white-space: nowrap; }
        .bd-load-rate small { display: block; font-size: 0.65rem; font-weight: 500; color: var(--txt4); text-align: right; margin-top: 1px; }

        .bd-status-select { font-size: 0.65rem; font-weight: 700; padding: 3px 10px 3px 8px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.04em; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; appearance: none; }

        .bd-load-meta { padding: 14px 24px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; border-bottom: 1px solid var(--border); background: var(--bg); }
        .bd-meta-item {}
        .bd-meta-label { font-size: 0.62rem; font-weight: 700; color: var(--txt4); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 3px; }
        .bd-meta-value { font-size: 0.8rem; font-weight: 600; color: var(--txt2); }

        .bd-eq-tag { display: inline-block; font-size: 0.65rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.04em; }

        .bd-load-bottom { padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
        .bd-load-desc { font-size: 0.78rem; color: var(--txt3); line-height: 1.5; flex: 1; }

        .bd-load-actions { display: flex; gap: 8px; flex-shrink: 0; }
        .bd-action-btn { padding: 7px 16px; border-radius: 8px; font-size: 0.75rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; }
        .bd-btn-edit { background: var(--yellow-l); color: var(--yellow); border: 1.5px solid var(--amber-l); }
        .bd-btn-edit:hover { background: var(--amber-l); }
        .bd-btn-duplicate { background: var(--blue-l); color: var(--blue); border: 1.5px solid var(--blue-m); }
        .bd-btn-duplicate:hover { background: var(--blue-m); }
        .bd-btn-delete { background: var(--red-l); color: var(--red); border: 1.5px solid #FEE2E2; }
        .bd-btn-delete:hover { background: #FEE2E2; }

        /* EMPTY STATE */
        .bd-empty { text-align: center; padding: 60px 20px; background: var(--white); border: 1px solid var(--border); border-radius: 16px; }
        .bd-empty-icon { font-size: 2.5rem; margin-bottom: 12px; }
        .bd-empty-title { font-size: 0.95rem; font-weight: 700; color: var(--txt); margin-bottom: 6px; }
        .bd-empty-sub { font-size: 0.8rem; color: var(--txt3); }

        /* SKELETON */
        .bd-skel { background: var(--white); border: 1px solid var(--border); border-radius: 16px; padding: 24px; margin-bottom: 14px; }
        .bd-skel-line { height: 14px; border-radius: 6px; background: linear-gradient(90deg, var(--bg2) 25%, var(--border) 37%, var(--bg2) 63%); background-size: 400% 100%; animation: bd-shimmer 1.4s ease infinite; margin-bottom: 10px; }
        @keyframes bd-shimmer { 0% { background-position: 100% 50%; } 100% { background-position: 0 50%; } }

        /* EDIT MODE INDICATOR */
        .bd-edit-banner { background: var(--amber-l); border: 1.5px solid #FDE68A; border-radius: 10px; padding: 10px 16px; display: flex; align-items: center; gap: 10px; font-size: 0.8rem; font-weight: 600; color: var(--amber); margin-bottom: 20px; }

        /* TOASTS */
        .bd-toast-stack { position: fixed; top: 20px; right: 20px; z-index: 999; display: flex; flex-direction: column; gap: 10px; max-width: 320px; }
        .bd-toast { padding: 12px 16px; border-radius: 10px; font-size: 0.8rem; font-weight: 600; box-shadow: 0 8px 24px rgba(0,0,0,0.12); animation: bd-toast-in 0.2s ease; display: flex; align-items: flex-start; gap: 8px; }
        .bd-toast-success { background: var(--green-l); color: #0e8f45; border: 1.5px solid #B7EBC9; }
        .bd-toast-error { background: var(--red-l); color: var(--red); border: 1.5px solid #FEE2E2; }
        .bd-toast-info { background: var(--blue-l); color: var(--blue); border: 1.5px solid var(--blue-m); }
        @keyframes bd-toast-in { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }

        /* BOOKING REQUESTS */
        .bd-requests-section { margin-bottom: 36px; }
        .bd-requests-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; flex-wrap: wrap; gap: 10px; }
        .bd-requests-title { font-size: 1rem; font-weight: 800; color: var(--txt); letter-spacing: -0.02em; display: flex; align-items: center; gap: 8px; }
        .bd-requests-badge { font-size: 0.68rem; font-weight: 800; padding: 2px 9px; border-radius: 20px; background: var(--amber-l); color: var(--amber); }
        .bd-requests-tabs { display: flex; gap: 4px; background: var(--white); border: 1px solid var(--border); border-radius: 10px; padding: 3px; }
        .bd-requests-tab { padding: 6px 14px; border-radius: 7px; font-size: 0.74rem; font-weight: 700; cursor: pointer; border: none; background: transparent; color: var(--txt3); font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; }
        .bd-requests-tab.active { background: var(--green); color: #fff; }
        .bd-request-card { background: var(--white); border: 1.5px solid var(--border); border-radius: 14px; padding: 18px 20px; margin-bottom: 12px; display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
        .bd-request-card.pending { border-color: #FDE68A; background: linear-gradient(90deg, #FFFBEB 0%, var(--white) 30%); }
        .bd-request-info { flex: 1; min-width: 240px; }
        .bd-request-route { font-size: 0.92rem; font-weight: 800; color: var(--txt); margin-bottom: 4px; }
        .bd-request-meta { font-size: 0.76rem; color: var(--txt3); display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 6px; }
        .bd-request-carrier { font-size: 0.8rem; color: var(--txt2); font-weight: 600; }
        .bd-request-note { font-size: 0.76rem; color: var(--txt3); margin-top: 6px; font-style: italic; }
        .bd-request-status-pill { font-size: 0.65rem; font-weight: 800; padding: 3px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.05em; }
        .bd-request-actions { display: flex; gap: 8px; flex-shrink: 0; }
        .bd-btn-approve { background: var(--green-l); color: var(--green); border: 1.5px solid #B7EBC9; }
        .bd-btn-approve:hover { background: var(--green); color: #fff; }
        .bd-btn-decline { background: var(--red-l); color: var(--red); border: 1.5px solid #FEE2E2; }
        .bd-btn-decline:hover { background: var(--red); color: #fff; }
        .bd-action-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .bd-form-grid, .bd-form-grid-3 { grid-template-columns: 1fr 1fr; }
          .bd-load-meta { grid-template-columns: repeat(2, 1fr); }
          .bd-stats { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 600px) {
          .bd-form-grid, .bd-form-grid-3 { grid-template-columns: 1fr; }
          .bd-load-meta { grid-template-columns: repeat(2, 1fr); }
          .bd-stats { grid-template-columns: repeat(2, 1fr); }
          .bd-page { padding: 24px 4%; }
          .bd-toast-stack { left: 16px; right: 16px; max-width: none; }
          .bd-request-card { flex-direction: column; }
        }
      `}</style>

      {/* ── TOASTS ── */}
      <div className="bd-toast-stack">
        {toasts.map((t) => (
          <div key={t.id} className={`bd-toast bd-toast-${t.type}`}>
            {t.type === "success" ? "✅" : t.type === "error" ? "⚠️" : "ℹ️"} {t.message}
          </div>
        ))}
      </div>

      <div className="bd-page">

        {/* ── PAGE HEADER ── */}
        <div className="bd-page-header">
          <div>
            <div className="bd-page-eyebrow">Broker Dashboard</div>
            <div className="bd-page-title">Manage Your <em>Loads</em></div>
            <div className="bd-page-sub">Post freight, track bookings, and connect with verified carriers — all in one place.</div>
          </div>
          <button onClick={exportCSV} className="bd-export-btn">⬇ Export CSV</button>
        </div>

        {/* ── STATS ── */}
        <div className="bd-stats">
          <div className="bd-stat">
            <div className="bd-stat-n">{loads.length}</div>
            <div className="bd-stat-l">Total Loads Posted</div>
          </div>
          <div className="bd-stat">
            <div className="bd-stat-n" style={{ color: "#12A150" }}>{availableCount}</div>
            <div className="bd-stat-l">Available</div>
          </div>
          <div className="bd-stat">
            <div className="bd-stat-n" style={{ color: "#1A56DB" }}>{bookedCount}</div>
            <div className="bd-stat-l">Booked / In Transit</div>
          </div>
          <div className="bd-stat">
            <div className="bd-stat-n" style={{ color: "#7C3AED" }}>
              ${totalBookedRevenue.toLocaleString()}
            </div>
            <div className="bd-stat-l">Booked Revenue</div>
          </div>
          <div className="bd-stat">
            <div className="bd-stat-n" style={{ color: "#D97706" }}>
              {loads.length > 0 ? `$${avgRate.toLocaleString()}` : "$0"}
            </div>
            <div className="bd-stat-l">Avg Rate</div>
          </div>
          <div className="bd-stat" style={pendingRequests.length > 0 ? { borderColor: "#FDE68A", background: "#FFFBEB" } : undefined}>
            <div className="bd-stat-n" style={{ color: pendingRequests.length > 0 ? "#D97706" : "#0F1520" }}>
              {pendingRequests.length}
            </div>
            <div className="bd-stat-l">Pending Requests</div>
          </div>
        </div>

        {/* ── FORM CARD ── */}
        <div className="bd-form-card">

          <div className="bd-form-header">
            <div className="bd-form-title">
              <div className="bd-form-title-icon">📦</div>
              {editingId ? "Edit Load" : "Post a New Load"}
            </div>
            {editingId && (
              <div style={{ fontSize: "0.75rem", color: "#D97706", fontWeight: 600, background: "#FFFBEB", border: "1.5px solid #FDE68A", padding: "5px 12px", borderRadius: "8px" }}>
                ✏️ Editing existing load
              </div>
            )}
          </div>

          {/* BROKER INFO */}
          <div className="bd-section-label">Broker Information</div>
          <div className="bd-form-grid">
            <div>
              <input name="company_name" placeholder="Company Name *" value={form.company_name} onChange={handleChange}
                className={`bd-input ${formErrors.company_name ? "bd-input-error" : ""}`} />
            </div>
            <div>
              <input name="contact" placeholder="Contact Person *" value={form.contact} onChange={handleChange}
                className={`bd-input ${formErrors.contact ? "bd-input-error" : ""}`} />
            </div>
            <div>
              <input name="email" placeholder="Email Address *" value={form.email} onChange={handleChange}
                className={`bd-input ${formErrors.email ? "bd-input-error" : ""}`} />
            </div>
            <div>
              <input name="phone" type="tel" placeholder="Phone Number *" value={form.phone} onChange={handleChange}
                className="bd-input" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, gridColumn: "1 / -1" }}>
              <input name="mc_number" placeholder="MC Number" value={form.mc_number} onChange={handleChange} className="bd-input" />
              <input name="usdot" placeholder="USDOT" value={form.usdot} onChange={handleChange} className="bd-input" />
            </div>
          </div>

          <div className="bd-divider" />

          {/* LOAD DETAILS */}
          <div className="bd-section-label">Load Details</div>
          <div className="bd-form-grid">
            <input name="pickup_location" placeholder="Pickup Location *" value={form.pickup_location} onChange={handleChange}
              className={`bd-input ${formErrors.pickup_location ? "bd-input-error" : ""}`} />
            <input name="delivery_location" placeholder="Delivery Location *" value={form.delivery_location} onChange={handleChange}
              className={`bd-input ${formErrors.delivery_location ? "bd-input-error" : ""}`} />
            <select name="equipment" value={form.equipment} onChange={handleChange} className="bd-input">
              <option>Box Truck</option>
              <option>Dry Van</option>
              <option>Sprinter/Cargo Van</option>
              <option>HotShot</option>
              <option>Reefer</option>
              <option>FlatBed</option>
              <option>Tanker</option>
              <option>Step Deck</option>
              <option>Power Only</option>
              <option>Other</option>
            </select>
            <input name="weight" placeholder="Weight (lbs) *" value={form.weight} onChange={handleChange}
              className={`bd-input ${formErrors.weight ? "bd-input-error" : ""}`} />
            <input name="total_rate" placeholder="Total Rate ($) *" value={form.total_rate} onChange={handleChange}
              className={`bd-input ${formErrors.total_rate ? "bd-input-error" : ""}`} />
          </div>

          <div className="bd-divider" />

          {/* DATES */}
          <div className="bd-section-label">Schedule</div>
          <div className="bd-form-grid">
            <div>
              <div style={{ fontSize: "0.72rem", color: "#4A5568", marginBottom: 4, fontWeight: 600 }}>Pickup Date & Time *</div>
              <input type="datetime-local" name="pickup_date" value={form.pickup_date} onChange={handleChange}
                className={`bd-input ${formErrors.pickup_date ? "bd-input-error" : ""}`} />
            </div>
            <div>
              <div style={{ fontSize: "0.72rem", color: "#4A5568", marginBottom: 4, fontWeight: 600 }}>Delivery Date & Time *</div>
              <input type="datetime-local" name="delivery_date" value={form.delivery_date} onChange={handleChange}
                className={`bd-input ${formErrors.delivery_date ? "bd-input-error" : ""}`} />
              {formErrors.delivery_date && form.pickup_date && form.delivery_date && (
                <div className="bd-field-hint" style={{ color: "var(--red)" }}>Must be on or after the pickup date.</div>
              )}
            </div>
          </div>

          <div className="bd-divider" />

          {/* DESCRIPTION */}
          <div className="bd-section-label">Additional Notes</div>
          <textarea
            name="description"
            placeholder="Add any special instructions, hazmat info, load requirements..."
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="bd-input"
            style={{ resize: "vertical", lineHeight: 1.6 }}
          />

          {/* ACTIONS */}
          <div className="bd-form-actions">
            {editingId && (
              <button onClick={cancelEdit} className="bd-btn bd-btn-ghost">✕ Cancel</button>
            )}
            <button onClick={handleSubmit} className="bd-btn bd-btn-primary" disabled={submitting}>
              {submitting ? "Saving..." : editingId ? "✓ Update Load" : "📦 Post Load"}
            </button>
          </div>

        </div>

        {/* ── BOOKING REQUESTS ── */}
        <div className="bd-requests-section">
          <div className="bd-requests-header">
            <div className="bd-requests-title">
              📥 Booking Requests
              {pendingRequests.length > 0 && <span className="bd-requests-badge">{pendingRequests.length} pending</span>}
            </div>
            <div className="bd-requests-tabs">
              <button
                className={`bd-requests-tab${requestsTab === "pending" ? " active" : ""}`}
                onClick={() => setRequestsTab("pending")}
              >
                Pending
              </button>
              <button
                className={`bd-requests-tab${requestsTab === "all" ? " active" : ""}`}
                onClick={() => setRequestsTab("all")}
              >
                All
              </button>
            </div>
          </div>

          {loadingRequests ? (
            <div className="bd-skel">
              <div className="bd-skel-line" style={{ width: "50%" }} />
              <div className="bd-skel-line" style={{ width: "30%", marginBottom: 0 }} />
            </div>
          ) : visibleRequests.length === 0 ? (
            <div className="bd-empty">
              <div className="bd-empty-icon">📥</div>
              <div className="bd-empty-title">
                {requestsTab === "pending" ? "No pending booking requests" : "No booking requests yet"}
              </div>
              <div className="bd-empty-sub">
                {requestsTab === "pending"
                  ? "When a carrier books one of your loads, their request will show up here for approval."
                  : "Approved and declined requests will appear here too."}
              </div>
            </div>
          ) : (
            visibleRequests.map((req) => {
              const isPending = req.status === "pending";
              const statusColors =
                req.status === "approved" ? { bg: "#E6F7EE", color: "#12A150" } :
                req.status === "declined" ? { bg: "#FEF2F2", color: "#DC2626" } :
                { bg: "#FEF3C7", color: "#D97706" };
              return (
                <div key={req.id} className={`bd-request-card${isPending ? " pending" : ""}`}>
                  <div className="bd-request-info">
                    <div className="bd-request-route">
                      {capitalizeWords(req.pickup_location)} <span style={{ color: "var(--txt4)" }}>→</span> {capitalizeWords(req.delivery_location)}
                    </div>
                    <div className="bd-request-meta">
                      <span>💰 ${req.total_rate}</span>
                      <span>🚛 {req.equipment}</span>
                      <span>📅 {req.pickup_date ? new Date(req.pickup_date).toLocaleDateString() : "TBD"}</span>
                    </div>
                    <div className="bd-request-carrier">
                      {req.carrier_name || "A carrier"}
                      {req.carrier_phone && <span style={{ color: "var(--txt4)", fontWeight: 400 }}> · {req.carrier_phone}</span>}
                      {req.carrier_email && <span style={{ color: "var(--txt4)", fontWeight: 400 }}> · {req.carrier_email}</span>}
                      {req.carrier_mc && <span style={{ color: "var(--txt4)", fontWeight: 400 }}> · MC {req.carrier_mc}</span>}
                    </div>
                    {req.note && <div className="bd-request-note">"{req.note}"</div>}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
                    <span className="bd-request-status-pill" style={{ background: statusColors.bg, color: statusColors.color }}>
                      {req.status}
                    </span>
                    {isPending && (
                      <div className="bd-request-actions">
                        <button
                          className="bd-action-btn bd-btn-decline"
                          disabled={decidingId === req.id}
                          onClick={() => declineRequest(req)}
                        >
                          ✕ Decline
                        </button>
                        <button
                          className="bd-action-btn bd-btn-approve"
                          disabled={decidingId === req.id}
                          onClick={() => approveRequest(req)}
                        >
                          {decidingId === req.id ? "Saving..." : "✓ Approve"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ── LOADS LIST ── */}
        <div className="bd-loads-header">
          <div className="bd-loads-title">Your Posted Loads</div>
          <div className="bd-loads-count">{visibleLoads.length} of {loads.length} load{loads.length !== 1 ? "s" : ""}</div>
        </div>

        {/* ── FILTER BAR ── */}
        {loads.length > 0 && (
          <div className="bd-filter-bar">
            <input
              className="bd-input bd-filter-search"
              placeholder="Search by company, contact, route, MC#, USDOT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select className="bd-input bd-filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
              <option value="all">All Statuses</option>
              {Object.entries(STATUS_META).map(([key, meta]) => (
                <option key={key} value={key}>{meta.label}</option>
              ))}
            </select>
            <select className="bd-input bd-filter-select" value={equipmentFilter} onChange={(e) => setEquipmentFilter(e.target.value)}>
              <option value="all">All Equipment</option>
              {equipmentOptions.map((eq) => <option key={eq} value={eq}>{eq}</option>)}
            </select>
            <select className="bd-input bd-filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="rate_high">Rate: High to Low</option>
              <option value="rate_low">Rate: Low to High</option>
              <option value="pickup_soon">Pickup: Soonest</option>
            </select>
          </div>
        )}

        {loadingLoads ? (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bd-skel">
                <div className="bd-skel-line" style={{ width: "40%" }} />
                <div className="bd-skel-line" style={{ width: "70%" }} />
                <div className="bd-skel-line" style={{ width: "55%", marginBottom: 0 }} />
              </div>
            ))}
          </>
        ) : !userId ? (
          <div className="bd-empty">
            <div className="bd-empty-icon">🔒</div>
            <div className="bd-empty-title">Please log in</div>
            <div className="bd-empty-sub">Log in to view and manage your posted loads.</div>
          </div>
        ) : loads.length === 0 ? (
          <div className="bd-empty">
            <div className="bd-empty-icon">📭</div>
            <div className="bd-empty-title">No loads posted yet</div>
            <div className="bd-empty-sub">Use the form above to post your first load and reach verified carriers.</div>
          </div>
        ) : visibleLoads.length === 0 ? (
          <div className="bd-empty">
            <div className="bd-empty-icon">🔍</div>
            <div className="bd-empty-title">No loads match your filters</div>
            <div className="bd-empty-sub">Try adjusting your search or filter settings.</div>
          </div>
        ) : (
          visibleLoads.map((l) => {
            const eq = equipmentColors[l.equipment] || { bg: "#EFF1F5", color: "#4A5568" };
            const status = l.status || "available";
            const statusMeta = STATUS_META[status] || STATUS_META.available;
            return (
              <div key={l.id} className="bd-load-card">

                {/* TOP ROW */}
                <div className="bd-load-top">
                  <div>
                    <div className="bd-load-company-row">
                      <div className="bd-load-company">{capitalizeWords(l.company_name)}</div>
                      <select
                        className="bd-status-select"
                        style={{ background: statusMeta.bg, color: statusMeta.color }}
                        value={status}
                        onChange={(e) => handleStatusChange(l.id, e.target.value as LoadStatus)}
                      >
                        {Object.entries(STATUS_META).map(([key, meta]) => (
                          <option key={key} value={key}>{meta.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="bd-load-route">
                      <span>{capitalizeWords(l.pickup_location)}</span>
                      <span className="bd-load-route-arrow">→</span>
                      <span>{capitalizeWords(l.delivery_location)}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="bd-load-rate">
                      ${l.total_rate}
                      <small>Total Rate</small>
                    </div>
                  </div>
                </div>

                {/* META GRID */}
                <div className="bd-load-meta">
                  <div className="bd-meta-item">
                    <div className="bd-meta-label">Equipment</div>
                    <div className="bd-meta-value">
                      <span className="bd-eq-tag" style={{ background: eq.bg, color: eq.color }}>
                        {l.equipment}
                      </span>
                    </div>
                  </div>
                  <div className="bd-meta-item">
                    <div className="bd-meta-label">Weight</div>
                    <div className="bd-meta-value">{l.weight || "N/A"}</div>
                  </div>
                  <div className="bd-meta-item">
                    <div className="bd-meta-label">MC Number</div>
                    <div className="bd-meta-value">{l.mc_number || "N/A"}</div>
                  </div>
                  <div className="bd-meta-item">
                    <div className="bd-meta-label">USDOT</div>
                    <div className="bd-meta-value">{l.usdot || "N/A"}</div>
                  </div>
                  <div className="bd-meta-item">
                    <div className="bd-meta-label">Contact</div>
                    <div className="bd-meta-value">{capitalizeWords(l.contact)}</div>
                  </div>
                  <div className="bd-meta-item">
                    <div className="bd-meta-label">Email</div>
                    <div className="bd-meta-value" style={{ fontSize: "0.75rem" }}>{l.email}</div>
                  </div>
                  <div className="bd-meta-item">
                    <div className="bd-meta-label">Phone</div>
                    <div className="bd-meta-value" style={{ fontSize: "0.75rem" }}>{l.phone || "N/A"}</div>
                  </div>
                  <div className="bd-meta-item">
                    <div className="bd-meta-label">Pickup Date</div>
                    <div className="bd-meta-value" style={{ fontSize: "0.75rem" }}>{formatDate(l.pickup_date)}</div>
                  </div>
                  <div className="bd-meta-item">
                    <div className="bd-meta-label">Delivery Date</div>
                    <div className="bd-meta-value" style={{ fontSize: "0.75rem" }}>{formatDate(l.delivery_date)}</div>
                  </div>
                </div>

                {/* BOTTOM ROW */}
                <div className="bd-load-bottom">
                  {l.description ? (
                    <div className="bd-load-desc">
                      <span style={{ fontWeight: 600, color: "#3D4A5C" }}>Notes: </span>
                      {capitalizeWords(l.description)}
                    </div>
                  ) : (
                    <div className="bd-load-desc" style={{ color: "#6B7A8D" }}>No additional notes</div>
                  )}
                  <div className="bd-load-actions">
                    <button onClick={() => handleEdit(l)} className="bd-action-btn bd-btn-edit">✏️ Edit</button>
                    <button onClick={() => handleDuplicate(l)} className="bd-action-btn bd-btn-duplicate">⧉ Duplicate</button>
                    <button onClick={() => handleDelete(l.id)} className="bd-action-btn bd-btn-delete">🗑 Delete</button>
                  </div>
                </div>

              </div>
            );
          })
        )}

      </div>

      <UpgradePlan
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        currentPlan={plan}
        recommendedPlan={getRecommendedPlan(plan)}
        title="Load Posting Limit Reached"
        description={upgradeMessage}
        upgradeUrl={getUpgradeLink(plan)}
      />
    </main>
  );
}
