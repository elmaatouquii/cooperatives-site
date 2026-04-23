// src/pages/Admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import { Link } from "react-router-dom";
import RegionMap from "./RegionMap";

const PALETTE = {
  navy:    "#1a2060",
  gold:    "#c9a84c",
  emerald: "#1a7a4a",
  bg:      "#f5f6fa",
};

// ── Reusable stat card ──────────────────────────────────────
const StatCard = ({ icon, label, value, accentColor, bgColor }) => (
  <div style={{
    background: "#fff",
    borderRadius: 16,
    padding: "22px 24px",
    border: "1px solid rgba(26,32,96,0.08)",
    boxShadow: "0 2px 8px rgba(26,32,96,0.05)",
    display: "flex", alignItems: "center", gap: 16,
    transition: "box-shadow 0.2s, transform 0.2s",
    cursor: "default",
  }}
    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 28px rgba(26,32,96,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(26,32,96,0.05)"; e.currentTarget.style.transform = "none"; }}
  >
    <div style={{
      width: 50, height: 50, borderRadius: 14, flexShrink: 0,
      background: bgColor,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {icon}
    </div>
    <div>
      <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8", marginBottom: 4 }}>
        {label}
      </p>
      <p style={{ fontSize: 28, fontWeight: 800, color: PALETTE.navy, lineHeight: 1 }}>
        {value}
      </p>
    </div>
  </div>
);

// ── Loading spinner ─────────────────────────────────────────
const Spinner = () => (
  <div style={{
    width: 40, height: 40, borderRadius: "50%",
    border: "3px solid rgba(26,32,96,0.10)",
    borderTopColor: PALETTE.emerald,
    animation: "adSpin 0.7s linear infinite",
    margin: "0 auto 12px",
  }} />
);

// ── AdminDashboard ──────────────────────────────────────────
const AdminDashboard = () => {
  const [stats, setStats]                     = useState(null);
  const [recentMessages, setRecentMessages]   = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data.stats);
      } catch (err) {
        console.error(err);
        alert("Impossible de récupérer les données du dashboard admin");
      }
    };

    const fetchRecentMessages = async () => {
      try {
        setLoadingMessages(true);
        const res = await axios.get("http://127.0.0.1:8000/api/admin/contacts/recent", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) setRecentMessages(res.data.data);
      } catch (err) {
        console.error("Erreur messages récents:", err);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchStats();
    fetchRecentMessages();
  }, [token]);

  if (!stats) {
    return (
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <AdminSidebar />
        <div style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          background: PALETTE.bg,
        }}>
          <div style={{ textAlign: "center" }}>
            <style>{`@keyframes adSpin { to { transform: rotate(360deg); } }`}</style>
            <Spinner />
            <p style={{ fontSize: 13, color: "#94a3b8" }}>Chargement…</p>
          </div>
        </div>
      </div>
    );
  }

  const unreadCount = recentMessages.filter((m) => m.status === "non lu").length;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: PALETTE.bg, fontFamily: "'Outfit', 'Cairo', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Cairo:wght@400;700&display=swap');
        @keyframes adSpin    { to { transform: rotate(360deg); } }
        @keyframes adFadeIn  { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        .ad-msg-row { transition: background 0.18s; }
        .ad-msg-row:hover { background: rgba(26,32,96,0.025); }
        .ad-read-btn { padding: 7px; border-radius: 9px; border: 1.5px solid transparent; background: transparent; cursor: pointer; transition: all 0.18s; line-height: 0; }
        .ad-read-btn.unread { color: ${PALETTE.emerald}; border-color: rgba(26,122,74,0.18); }
        .ad-read-btn.unread:hover { background: rgba(26,122,74,0.08); border-color: rgba(26,122,74,0.35); }
        .ad-read-btn.read   { color: #cbd5e1; cursor: default; }
      `}</style>

      <AdminSidebar />

      <div style={{ flex: 1, padding: "32px 32px 48px", maxWidth: 1200, animation: "adFadeIn 0.4s ease-out" }}>

        {/* ── Page header ── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <div style={{ width: 4, height: 28, borderRadius: 4, background: `linear-gradient(180deg, ${PALETTE.navy}, ${PALETTE.emerald})` }} />
            <h1 style={{ fontSize: 26, fontWeight: 800, color: PALETTE.navy, margin: 0 }}>
              Dashboard Admin
            </h1>
          </div>
          <p style={{ fontSize: 13, color: "#94a3b8", marginLeft: 16 }}>
            Bienvenue dans votre espace d'administration
          </p>
        </div>

        {/* ── Stats Grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 28 }}>
          <StatCard
            label="Total Utilisateurs"
            value={stats.total_users}
            bgColor="rgba(26,122,74,0.10)"
            icon={
              <svg width="22" height="22" fill="none" stroke={PALETTE.emerald} strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
          <StatCard
            label="Administrateurs"
            value={stats.admins}
            bgColor="rgba(26,32,96,0.08)"
            icon={
              <svg width="22" height="22" fill="none" stroke={PALETTE.navy} strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
          />
          <StatCard
            label="Gestionnaires"
            value={stats.manager}
            bgColor="rgba(201,168,76,0.12)"
            icon={
              <svg width="22" height="22" fill="none" stroke={PALETTE.gold} strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />
        </div>

        {/* ── Interactive Region Map ── */}
        <RegionMap />

        {/* ── Messages Section ── */}
        <div style={{
          marginTop: 28,
          background: "#fff",
          borderRadius: 18,
          border: "1px solid rgba(26,32,96,0.08)",
          boxShadow: "0 2px 8px rgba(26,32,96,0.05)",
          overflow: "hidden",
        }}>
          {/* Messages header */}
          <div style={{
            padding: "18px 24px",
            borderBottom: "1px solid rgba(26,32,96,0.07)",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: "rgba(26,122,74,0.09)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="20" height="20" fill="none" stroke={PALETTE.emerald} strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: PALETTE.navy, margin: 0 }}>
                  Messages de contact
                </h2>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>Derniers messages reçus</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {unreadCount > 0 && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "6px 12px", borderRadius: 20,
                  background: "rgba(26,122,74,0.09)",
                  border: "1px solid rgba(26,122,74,0.2)",
                  fontSize: 12, fontWeight: 600, color: PALETTE.emerald,
                }}>
                  <span style={{
                    width: 7, height: 7, borderRadius: "50%",
                    background: PALETTE.emerald, display: "inline-block",
                    animation: "adPulse 2s infinite",
                  }} />
                  {unreadCount} non lu{unreadCount > 1 ? "s" : ""}
                  <style>{`@keyframes adPulse { 0%,100%{opacity:1}50%{opacity:0.4} }`}</style>
                </span>
              )}
              <Link to="/admin/contacts" style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                fontSize: 12, fontWeight: 600, color: PALETTE.emerald,
                textDecoration: "none", padding: "6px 14px", borderRadius: 10,
                border: "1.5px solid rgba(26,122,74,0.25)",
                transition: "all 0.18s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(26,122,74,0.06)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                Voir tous
                <span style={{ fontSize: 15 }}>→</span>
              </Link>
            </div>
          </div>

          {/* Messages list */}
          <div>
            {loadingMessages ? (
              <div style={{ padding: "40px 0", textAlign: "center" }}>
                <Spinner />
                <p style={{ fontSize: 12, color: "#94a3b8" }}>Chargement des messages…</p>
              </div>
            ) : recentMessages.length === 0 ? (
              <div style={{ padding: "40px 0", textAlign: "center" }}>
                <div style={{
                  width: 52, height: 52, borderRadius: "50%",
                  background: "rgba(26,32,96,0.05)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 12px",
                }}>
                  <svg width="22" height="22" fill="none" stroke="#cbd5e1" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p style={{ fontSize: 13, color: "#94a3b8" }}>Aucun message pour le moment</p>
              </div>
            ) : (
              recentMessages.slice(0, 5).map((message, idx) => (
                <div
                  key={message.id}
                  className="ad-msg-row"
                  style={{
                    padding: "16px 24px",
                    borderBottom: idx < Math.min(recentMessages.length, 5) - 1 ? "1px solid rgba(26,32,96,0.05)" : "none",
                    display: "flex", alignItems: "flex-start", gap: 16,
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                    background: message.status === "non lu"
                      ? "rgba(26,122,74,0.10)"
                      : "rgba(26,32,96,0.05)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, fontSize: 14,
                    color: message.status === "non lu" ? PALETTE.emerald : "#94a3b8",
                    border: message.status === "non lu" ? "1.5px solid rgba(26,122,74,0.2)" : "1.5px solid rgba(26,32,96,0.07)",
                  }}>
                    {message.name?.charAt(0).toUpperCase() || "?"}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: PALETTE.navy }}>
                        {message.name}
                      </span>
                      {message.status === "non lu" && (
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: "2px 8px",
                          borderRadius: 20, background: "rgba(26,122,74,0.10)",
                          color: PALETTE.emerald, border: "1px solid rgba(26,122,74,0.2)",
                          textTransform: "uppercase", letterSpacing: "0.05em",
                        }}>Non lu</span>
                      )}
                    </div>
                    <p style={{ fontSize: 11, color: "#94a3b8", marginBottom: 5 }}>{message.email}</p>
                    <p style={{
                      fontSize: 13, color: "#475569", lineHeight: 1.55,
                      overflow: "hidden", display: "-webkit-box",
                      WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                    }}>
                      {message.message}
                    </p>
                    <p style={{ fontSize: 11, color: "#cbd5e1", marginTop: 6 }}>
                      {new Date(message.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric", month: "long", hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {/* Read button */}
                  <button
                    onClick={() => {}}
                    className={`ad-read-btn ${message.status === "non lu" ? "unread" : "read"}`}
                    disabled={message.status !== "non lu"}
                    title="Marquer comme lu"
                  >
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;