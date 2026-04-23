// src/pages/Admin/RegionMap.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// ============================================================
// 1. CONSTANTES
// ============================================================

const PROVINCES = [
  {
    id: "Midelt",
    label: "ميدلت",
    labelFr: "Midelt",
    d: "M 10.0,80.0 L 21.4,90.0 L 29.5,80.9 L 35.5,89.1 L 45.5,88.2 L 50.9,77.3 L 63.2,70.0 L 68.2,72.7 L 75.0,70.9 L 82.7,80.5 L 98.2,77.7 L 106.8,70.9 L 120.9,75.5 L 125.5,70.9 L 135.9,71.4 L 139.5,57.3 L 133.2,51.8 L 134.5,45.9 L 126.4,41.4 L 125.5,36.4 L 112.3,41.4 L 100.0,21.8 L 85.0,24.5 L 77.3,10.9 L 63.6,10.5 L 60.5,19.5 L 53.2,19.1 L 48.6,24.5 L 48.6,44.1 L 41.8,40.0 L 42.7,50.9 L 34.1,50.0 L 30.5,53.2 L 30.5,58.6 L 36.8,60.9 L 35.9,64.5 L 27.7,63.6 L 24.1,73.2 L 13.2,71.8 Z",
  },
  {
    id: "Zagora",
    label: "زاكورة",
    labelFr: "Zagora",
    d: "M 83.2,10.0 L 67.3,17.9 L 64.5,23.6 L 46.9,29.9 L 31.6,31.6 L 30.4,27.6 L 22.5,27.6 L 10.6,39.5 L 10.6,53.7 L 25.3,53.1 L 25.9,60.0 L 35.5,67.9 L 28.7,70.2 L 32.7,78.7 L 31.0,91.7 L 41.8,90.0 L 35.0,93.4 L 34.4,108.8 L 39.0,111.0 L 36.7,125.8 L 50.9,126.9 L 57.7,136.6 L 81.0,138.3 L 89.5,126.9 L 91.7,132.6 L 99.1,133.8 L 115.6,104.8 L 138.3,88.3 L 137.7,66.8 L 134.3,62.8 L 124.1,61.7 L 129.8,46.9 L 116.7,31.6 L 116.2,21.9 Z",
  },
  {
    id: "Tinghir",
    label: "تنغير",
    labelFr: "Tinghir",
    d: "M 100.8,10.0 L 85.3,16.7 L 77.6,31.2 L 70.4,32.2 L 63.7,22.9 L 59.0,22.9 L 50.2,33.2 L 38.4,33.7 L 34.2,41.0 L 15.2,45.6 L 10.0,65.2 L 20.8,77.1 L 21.3,104.4 L 32.7,102.9 L 47.7,90.0 L 78.6,100.8 L 81.7,112.7 L 94.1,126.6 L 87.9,133.3 L 88.4,139.5 L 104.4,131.7 L 116.8,119.4 L 125.6,93.6 L 134.8,81.7 L 130.2,73.5 L 107.5,72.4 L 92.0,79.1 L 93.1,64.7 L 81.7,61.6 L 72.9,51.8 L 85.8,39.4 L 97.7,36.3 L 107.5,17.7 Z",
  },
  {
    id: "Ouarzazate",
    label: "ورزازات",
    labelFr: "Ouarzazate",
    d: "M 72.0,10.0 L 55.0,14.0 L 42.0,10.5 L 28.0,16.0 L 18.0,14.0 L 10.0,22.0 L 10.5,36.0 L 20.0,42.0 L 18.5,55.0 L 10.0,62.0 L 15.0,74.0 L 28.0,78.0 L 30.0,90.0 L 22.0,100.0 L 28.0,110.0 L 40.0,106.0 L 48.0,114.0 L 58.0,108.0 L 65.0,118.0 L 78.0,116.0 L 84.0,105.0 L 96.0,100.0 L 108.0,88.0 L 120.0,84.0 L 130.0,72.0 L 128.0,60.0 L 118.0,54.0 L 120.0,40.0 L 112.0,28.0 L 100.0,24.0 L 88.0,14.0 Z",
  },
  {
    id: "Errachidia",
    label: "الرشيدية",
    labelFr: "Errachidia",
    d: "M 72.0,10.0 L 58.0,10.5 L 46.0,16.0 L 34.0,14.0 L 22.0,20.0 L 10.0,18.0 L 10.5,32.0 L 18.0,40.0 L 14.0,52.0 L 10.0,64.0 L 18.0,76.0 L 30.0,80.0 L 32.0,94.0 L 22.0,108.0 L 10.0,118.0 L 10.5,132.0 L 26.0,128.0 L 40.0,118.0 L 52.0,124.0 L 62.0,116.0 L 76.0,120.0 L 90.0,112.0 L 100.0,98.0 L 110.0,90.0 L 118.0,78.0 L 116.0,64.0 L 104.0,56.0 L 102.0,42.0 L 110.0,32.0 L 108.0,20.0 L 96.0,14.0 Z",
  },
];

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const PALETTE = {
  navy:     "#1a2060",
  gold:     "#c9a84c",
  emerald:  "#1a7a4a",
  emeraldL: "#2d9e68",
  bg:       "#f8f7f4",
  border:   "rgba(26,32,96,0.09)",
};

const BAR_COLORS = [
  "#1a7a4a", "#c9a84c", "#1a2060", "#2d9e68", "#e8c76a",
];
const PIE_COLORS = [
  "#1a2060", "#c9a84c", "#1a7a4a", "#e8c76a", "#2d9e68",
  "#2a3080", "#f0d882", "#34b87a",
];

// ============================================================
// 2. SUB-COMPONENTS
// ============================================================

const SectionLabel = ({ children, accent = false }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
    <div style={{
      width: 3, height: 18, borderRadius: 3,
      background: accent
        ? `linear-gradient(180deg, ${PALETTE.gold}, ${PALETTE.navy})`
        : `linear-gradient(180deg, ${PALETTE.navy}, ${PALETTE.emerald})`,
    }} />
    <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: PALETTE.navy, opacity: 0.75 }}>
      {children}
    </span>
  </div>
);

const CountPill = ({ value, active }) => (
  <span style={{
    display: "inline-block",
    fontSize: 10, fontWeight: 800,
    padding: "2px 8px", borderRadius: 20,
    background: active ? PALETTE.gold : "rgba(26,32,96,0.07)",
    color: active ? PALETTE.navy : "#64748b",
    transition: "all 0.25s",
    minWidth: 22, textAlign: "center",
  }}>
    {value ?? "–"}
  </span>
);

const BarChartSection = ({ allCoopCounts }) => {
  const labels = PROVINCES.map((p) => p.labelFr);
  const values = PROVINCES.map((p) => allCoopCounts[p.id] ?? 0);

  const data = {
    labels,
    datasets: [{
      label: "Coopératives",
      data: values,
      backgroundColor: BAR_COLORS.map((c) => c + "cc"),
      borderColor: BAR_COLORS,
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: PALETTE.navy,
        titleColor: PALETTE.gold,
        bodyColor: "#fff",
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          title: (items) => items[0].label,
          label: (item) => ` ${item.raw} coopérative${item.raw !== 1 ? "s" : ""}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#475569", font: { size: 11, weight: "600" } },
      },
      y: {
        grid: { color: "rgba(26,32,96,0.05)", drawBorder: false },
        ticks: { color: "#94a3b8", font: { size: 11 }, stepSize: 1 },
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <SectionLabel>Coopératives par province</SectionLabel>
      <div style={{ height: 180 }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

const PieChartSection = ({ cooperatives }) => {
  const categoryCounts = cooperatives.reduce((acc, coop) => {
    const cat = coop.categorie || coop.category || coop.type || "Autre";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(categoryCounts);
  const values = Object.values(categoryCounts);

  if (labels.length === 0) return null;

  const data = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: PIE_COLORS.slice(0, labels.length).map((c) => c + "dd"),
      borderColor: PIE_COLORS.slice(0, labels.length),
      borderWidth: 2,
      hoverOffset: 8,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#475569", font: { size: 11 }, padding: 14, usePointStyle: true, pointStyleWidth: 8 },
      },
      tooltip: {
        backgroundColor: PALETTE.navy,
        titleColor: PALETTE.gold,
        bodyColor: "#fff",
        padding: 10,
        cornerRadius: 8,
      },
    },
  };

  return (
    <div style={{ marginTop: 24 }}>
      <SectionLabel accent>Répartition par catégorie</SectionLabel>
      <div style={{ height: 200 }}>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

// ============================================================
// 3. MAIN COMPONENT
// ============================================================

const RegionMap = () => {
  const [selected, setSelected]         = useState(null);
  const [hovered, setHovered]           = useState(null);
  const [cooperatives, setCooperatives] = useState([]);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);
  const [allCoopCounts, setAllCoopCounts] = useState({});

  const token = localStorage.getItem("token");

  // Pre-fetch all province counts for bar chart
  useEffect(() => {
    const fetchAll = async () => {
      const counts = {};
      await Promise.all(
        PROVINCES.map(async (p) => {
          try {
            const res = await axios.get(
              `${API_URL}/api/admin/cooperatives?ville=${p.id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const d = res.data.data ?? res.data ?? [];
            counts[p.id] = Array.isArray(d) ? d.length : 0;
          } catch { counts[p.id] = 0; }
        })
      );
      setAllCoopCounts(counts);
    };
    fetchAll();
  }, [token]);

  const handleProvinceClick = async (provinceId) => {
    if (selected === provinceId) return;
    setSelected(provinceId);
    setCooperatives([]);
    setError(null);
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/api/admin/cooperatives?ville=${provinceId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = res.data.data ?? res.data ?? [];
      setCooperatives(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des coopératives.");
    } finally {
      setLoading(false);
    }
  };

  const getProvinceFill   = (p) => p.id === selected ? "rgba(201,168,76,0.20)" : p.id === hovered ? "rgba(26,122,74,0.10)" : "rgba(26,32,96,0.03)";
  const getProvinceStroke = (p) => p.id === selected ? PALETTE.gold : p.id === hovered ? PALETTE.emerald : PALETTE.navy;

  const totalCoops = Object.values(allCoopCounts).reduce((a, b) => a + b, 0);

  return (
    <div style={{ marginTop: 32, fontFamily: "'Outfit', 'Cairo', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Cairo:wght@400;700;900&display=swap');

        .rm-card {
          background: #fff;
          border-radius: 20px;
          border: 1px solid rgba(26,32,96,0.08);
          box-shadow: 0 2px 8px rgba(26,32,96,0.06), 0 20px 60px rgba(26,32,96,0.08);
          overflow: hidden;
        }
        .rm-province-tile {
          display: flex; flex-direction: column; align-items: center;
          gap: 6px; cursor: pointer; flex: 1; min-width: 0;
          padding: 10px 6px 6px;
          border-radius: 14px;
          transition: all 0.22s ease;
          border: 1.5px solid transparent;
        }
        .rm-province-tile:hover  { background: rgba(26,122,74,0.05); border-color: rgba(26,122,74,0.15); }
        .rm-province-tile.active { background: rgba(201,168,76,0.08); border-color: rgba(201,168,76,0.35); }

        .rm-coop-card {
          background: #fff;
          border: 1px solid rgba(26,32,96,0.08);
          border-radius: 14px; padding: 14px 16px;
          transition: all 0.2s ease;
          animation: rmSlideIn 0.35s ease-out both;
        }
        .rm-coop-card:hover {
          border-color: rgba(26,122,74,0.3);
          box-shadow: 0 4px 20px rgba(26,122,74,0.12);
          transform: translateY(-1px);
        }
        .rm-scrollpane {
          max-height: 420px; overflow-y: auto; padding-right: 6px;
        }
        .rm-scrollpane::-webkit-scrollbar { width: 5px; }
        .rm-scrollpane::-webkit-scrollbar-track { background: transparent; }
        .rm-scrollpane::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .rm-scrollpane::-webkit-scrollbar-thumb:hover { background: ${PALETTE.emeraldL}; }

        @keyframes rmFadeUp  { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        @keyframes rmSlideIn { from { opacity: 0; transform: translateX(-14px); } to { opacity: 1; transform: none; } }
        .rm-fade-up  { animation: rmFadeUp 0.45s ease-out; }

        .rm-btn {
          padding: 6px 14px; border-radius: 10px;
          font-size: 12px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
          border: 1.5px solid rgba(26,32,96,0.12);
          background: #fff; color: #475569;
        }
        .rm-btn:hover  { border-color: ${PALETTE.emerald}; color: ${PALETTE.emerald}; background: rgba(26,122,74,0.04); }
        .rm-btn.active { background: ${PALETTE.navy}; color: #fff; border-color: ${PALETTE.navy}; box-shadow: 0 4px 12px rgba(26,32,96,0.25); }

        .rm-stat {
          display: flex; flex-direction: column; align-items: center;
          padding: 8px 18px; border-radius: 12px;
          background: rgba(255,255,255,0.10); border: 1px solid rgba(255,255,255,0.18);
          min-width: 72px;
        }
        .rm-divider-v {
          width: 1px; margin: 20px 0;
          background: linear-gradient(180deg, transparent, rgba(26,32,96,0.10) 30%, rgba(26,32,96,0.10) 70%, transparent);
        }
        .rm-empty-icon {
          width: 72px; height: 72px; border-radius: 18px;
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, rgba(26,32,96,0.06), rgba(26,122,74,0.08));
          border: 1px solid rgba(26,32,96,0.08);
          margin-bottom: 16px;
        }
      `}</style>

      <div className="rm-card">

        {/* ── Header ── */}
        <div style={{
          background: `linear-gradient(135deg, ${PALETTE.navy} 0%, #0e1540 100%)`,
          padding: "16px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          {/* Stats */}
          <div style={{ display: "flex", gap: 10 }}>
            <div className="rm-stat">
              <span style={{ fontSize: 22, fontWeight: 800, color: "#fff", lineHeight: 1.1 }}>{PROVINCES.length}</span>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", marginTop: 2, fontWeight: 500 }}>Provinces</span>
            </div>
            <div className="rm-stat">
              <span style={{ fontSize: 22, fontWeight: 800, color: PALETTE.gold, lineHeight: 1.1 }}>{totalCoops}</span>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", marginTop: 2, fontWeight: 500 }}>Coopératives</span>
            </div>
          </div>

          {/* Title */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{
              fontFamily: "'Cairo', sans-serif",
              fontSize: 22, fontWeight: 700, color: "#fff", direction: "rtl",
            }}>عين الجهة</span>
            <span style={{ color: PALETTE.gold, fontSize: 26, fontWeight: 900, letterSpacing: "-3px", lineHeight: 1 }}>///</span>
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ display: "flex", flexWrap: "wrap" }}>

          {/* LEFT: Map + Charts */}
          <div style={{ padding: "22px 20px 22px", flexShrink: 0, width: "100%", maxWidth: 540, boxSizing: "border-box" }}>

            {/* Province tiles */}
            <div style={{
              display: "flex", justifyContent: "space-around", alignItems: "flex-end",
              gap: 4, padding: "10px 4px 6px",
              background: "rgba(26,32,96,0.02)", borderRadius: 16,
              border: "1px solid rgba(26,32,96,0.05)",
            }}>
              {PROVINCES.map((province) => (
                <div
                  key={province.id}
                  className={`rm-province-tile${selected === province.id ? " active" : ""}`}
                  onClick={() => handleProvinceClick(province.id)}
                  onMouseEnter={() => setHovered(province.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    transform: (hovered === province.id || selected === province.id) ? "scale(1.07) translateY(-2px)" : "scale(1)",
                  }}
                >
                  <span style={{
                    fontFamily: "'Cairo', sans-serif",
                    fontSize: 12, fontWeight: 700, direction: "rtl",
                    textAlign: "center", whiteSpace: "nowrap",
                    color: selected === province.id ? PALETTE.gold : hovered === province.id ? PALETTE.emerald : PALETTE.navy,
                    transition: "color 0.2s",
                  }}>
                    {province.label}
                  </span>

                  <svg viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg"
                    style={{ width: "100%", maxWidth: 110, display: "block" }}>
                    <defs>
                      <filter id={`sh-${province.id}`}>
                        <feDropShadow dx="0" dy="2" stdDeviation="3"
                          floodColor={selected === province.id ? PALETTE.gold : PALETTE.navy}
                          floodOpacity="0.18" />
                      </filter>
                    </defs>
                    <path
                      d={province.d}
                      fill={getProvinceFill(province)}
                      stroke={getProvinceStroke(province)}
                      strokeWidth={selected === province.id ? 2.8 : 1.6}
                      strokeLinejoin="round" strokeLinecap="round"
                      filter={(selected === province.id || hovered === province.id) ? `url(#sh-${province.id})` : "none"}
                      style={{ transition: "stroke 0.2s, fill 0.2s, stroke-width 0.2s" }}
                    />
                  </svg>

                  <CountPill value={allCoopCounts[province.id]} active={selected === province.id} />
                </div>
              ))}
            </div>

            {/* Province Buttons */}
            <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
              {PROVINCES.map((p) => (
                <button key={p.id} className={`rm-btn${selected === p.id ? " active" : ""}`}
                  onClick={() => handleProvinceClick(p.id)}>
                  {p.labelFr}
                </button>
              ))}
            </div>

            {/* Thin divider */}
            <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(26,32,96,0.08), transparent)", margin: "20px 0" }} />

            {/* Bar Chart */}
            <BarChartSection allCoopCounts={allCoopCounts} />

            {/* Pie Chart — shown when a province is selected and has categories */}
            {selected && !loading && cooperatives.length > 0 && (
              <PieChartSection cooperatives={cooperatives} />
            )}
          </div>

          {/* Vertical divider (desktop) */}
          <div className="rm-divider-v" style={{ display: "none" }} />
          <div style={{
            width: 1, margin: "20px 0", flexShrink: 0,
            background: "linear-gradient(180deg, transparent, rgba(26,32,96,0.09) 30%, rgba(26,32,96,0.09) 70%, transparent)",
          }} />

          {/* RIGHT: Cooperatives panel */}
          <div style={{ flex: 1, minWidth: 280, padding: "22px 24px 22px" }}>

            {/* Empty state */}
            {!selected && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", minHeight: 300, textAlign: "center" }}>
                <div className="rm-empty-icon">
                  <svg width="32" height="32" fill="none" stroke={PALETTE.navy} strokeWidth="1.4" viewBox="0 0 24 24" style={{ opacity: 0.5 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <p style={{ fontSize: 15, fontWeight: 700, color: PALETTE.navy, marginBottom: 8 }}>Explorez la région</p>
                <p style={{ fontSize: 13, color: "#94a3b8", maxWidth: 240, lineHeight: 1.65 }}>
                  Sélectionnez une province sur la carte pour découvrir ses coopératives et leurs services
                </p>
                <div style={{ marginTop: 22, display: "flex", gap: 5, alignItems: "center" }}>
                  {[0.25, 0.55, 0.85].map((op, i) => (
                    <span key={i} style={{ fontSize: 18, color: PALETTE.gold, opacity: op, fontWeight: 800 }}>←</span>
                  ))}
                  <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 6 }}>Cliquez sur une province</span>
                </div>
              </div>
            )}

            {/* Selected province */}
            {selected && (
              <div className="rm-fade-up">
                {/* Panel header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid rgba(26,32,96,0.07)" }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: PALETTE.navy, marginBottom: 5 }}>
                      Province de{" "}
                      <span style={{ color: PALETTE.emerald }}>
                        {PROVINCES.find((p) => p.id === selected)?.labelFr || selected}
                      </span>
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: PALETTE.emeraldL, display: "inline-block", animation: "pulse 2s infinite" }} />
                      <span style={{ fontSize: 12, color: "#64748b" }}>
                        {loading
                          ? "Chargement en cours…"
                          : `${cooperatives.length} coopérative${cooperatives.length !== 1 ? "s" : ""} disponible${cooperatives.length !== 1 ? "s" : ""}`}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => { setSelected(null); setCooperatives([]); }}
                    style={{
                      padding: "7px", borderRadius: 10, border: "1.5px solid rgba(26,32,96,0.10)",
                      background: "#fff", cursor: "pointer", color: "#94a3b8",
                      transition: "all 0.2s", lineHeight: 0,
                    }}
                    title="Désélectionner"
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(26,32,96,0.06)"; e.currentTarget.style.color = PALETTE.navy; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#94a3b8"; }}
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Loading */}
                {loading && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 0" }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%",
                      border: `3px solid rgba(26,32,96,0.10)`,
                      borderTopColor: PALETTE.emerald,
                      animation: "spin 0.75s linear infinite",
                    }} />
                    <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 14 }}>Chargement des coopératives…</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  </div>
                )}

                {/* Error */}
                {!loading && error && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: 12,
                    background: "#fef2f2", border: "1px solid #fecaca",
                    borderRadius: 12, padding: "12px 16px",
                  }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="16" height="16" fill="none" stroke="#dc2626" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p style={{ fontSize: 13, color: "#b91c1c" }}>{error}</p>
                  </div>
                )}

                {/* Empty cooperatives */}
                {!loading && !error && cooperatives.length === 0 && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 0", textAlign: "center" }}>
                    <div style={{
                      width: 64, height: 64, borderRadius: 16,
                      background: "rgba(26,32,96,0.05)", border: "1px solid rgba(26,32,96,0.08)",
                      display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14,
                    }}>
                      <svg width="28" height="28" fill="none" stroke="#94a3b8" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#475569", marginBottom: 6 }}>Aucune coopérative trouvée</p>
                    <p style={{ fontSize: 12, color: "#94a3b8" }}>
                      Aucune coopérative n'est encore enregistrée dans{" "}
                      {PROVINCES.find((p) => p.id === selected)?.labelFr || selected}
                    </p>
                  </div>
                )}

                {/* Cooperatives list */}
                {!loading && !error && cooperatives.length > 0 && (
                  <div className="rm-scrollpane" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {cooperatives.map((coop, index) => (
                      <div
                        key={coop.id}
                        className="rm-coop-card"
                        style={{ animationDelay: `${index * 45}ms` }}
                      >
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                          <div style={{
                            width: 46, height: 46, borderRadius: 12, overflow: "hidden", flexShrink: 0,
                            background: `linear-gradient(135deg, rgba(26,122,74,0.12), rgba(26,32,96,0.08))`,
                            border: "1px solid rgba(26,32,96,0.08)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            {coop.image ? (
                              <img src={`http://127.0.0.1:8000/${coop.image}`} alt={coop.nom}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                onError={(e) => (e.target.style.display = "none")} />
                            ) : (
                              <svg width="20" height="20" fill="none" stroke={PALETTE.emerald} strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
                              </svg>
                            )}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h4 style={{ fontSize: 14, fontWeight: 700, color: PALETTE.navy, marginBottom: 3 }}>
                              {coop.nom}
                            </h4>
                            {coop.description && (
                              <p style={{ fontSize: 12, color: "#64748b", marginBottom: 6, lineHeight: 1.55,
                                overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                                {coop.description}
                              </p>
                            )}
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                              {coop.adresse && (
                                <span style={{
                                  display: "inline-flex", alignItems: "center", gap: 4,
                                  fontSize: 11, color: "#64748b",
                                  background: "rgba(26,32,96,0.04)", borderRadius: 7, padding: "3px 8px",
                                  border: "1px solid rgba(26,32,96,0.07)",
                                }}>
                                  <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  </svg>
                                  {coop.adresse}
                                </span>
                              )}
                              {coop.region && (
                                <span style={{
                                  fontSize: 11, fontWeight: 600,
                                  background: "rgba(26,122,74,0.09)", color: PALETTE.emerald,
                                  borderRadius: 7, padding: "3px 8px",
                                  border: "1px solid rgba(26,122,74,0.18)",
                                }}>
                                  {coop.region}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer bar */}
        <div style={{ height: 5, background: `linear-gradient(90deg, ${PALETTE.navy}, ${PALETTE.emerald}, ${PALETTE.gold})`, borderRadius: "0 0 20px 20px" }} />
      </div>
    </div>
  );
};

export default RegionMap;