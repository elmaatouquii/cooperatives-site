// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentMessages, setRecentMessages] = useState([]);
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
        if (res.data.success) {
          setRecentMessages(res.data.data);
        }
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
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center min-h-screen bg-stone-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-stone-300 border-t-emerald-800 mx-auto mb-4"></div>
            <p className="text-stone-600 text-sm">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  // Nombre de messages non lus
  const unreadCount = recentMessages.filter(msg => msg.status === 'non lu').length;

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />
      
      <div className="flex-1 p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-light text-stone-800 mb-2">
            Dashboard Admin
          </h1>
          <p className="text-stone-500 text-sm">
            Bienvenue dans votre espace d'administration
          </p>
        </div>
        
        {/* Stats Cards - VERT/BRUN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {/* Total Users */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 hover:border-emerald-700/30 transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-800">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-stone-500 uppercase tracking-wider mb-1">Total Utilisateurs</p>
            <p className="text-2xl font-semibold text-stone-800">{stats.total_users}</p>
          </div>

          {/* Admins */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 hover:border-emerald-700/30 transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-stone-200 rounded-lg flex items-center justify-center text-stone-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-stone-500 uppercase tracking-wider mb-1">Administrateurs</p>
            <p className="text-2xl font-semibold text-stone-800">{stats.admins}</p>
          </div>

          {/* Managers */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 hover:border-emerald-700/30 transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-800">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-stone-500 uppercase tracking-wider mb-1">Gestionnaires</p>
            <p className="text-2xl font-semibold text-stone-800">{stats.manager}</p>
          </div>
        </div>

        {/* SECTION CONTACT MESSAGES - NOUVELLE */}
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          {/* Header avec badge */}
          <div className="px-6 py-5 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-medium text-stone-800">Messages de contact</h2>
                <p className="text-xs text-stone-500">Derniers messages reçus</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Badge non lus */}
              {unreadCount > 0 && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full mr-1.5 animate-pulse"></span>
                  {unreadCount} nouveau{unreadCount > 1 ? 'x' : ''} non lu(s)
                </span>
              )}
              
              {/* Lien vers tous les messages */}
              <Link 
                to="/admin/contacts" 
                className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors"
              >
                Voir tous
                <span className="text-lg leading-none">→</span>
              </Link>
            </div>
          </div>

          {/* Liste des messages */}
          <div className="divide-y divide-stone-100">
            {loadingMessages ? (
              <div className="px-6 py-8 text-center">
                <div className="animate-spin h-6 w-6 border-2 border-stone-300 border-t-emerald-800 rounded-full mx-auto mb-2"></div>
                <p className="text-xs text-stone-500">Chargement des messages...</p>
              </div>
            ) : recentMessages.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-sm text-stone-500">Aucun message pour le moment</p>
              </div>
            ) : (
              recentMessages.slice(0, 5).map((message) => (
                <div key={message.id} className="px-6 py-4 hover:bg-stone-50/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-stone-800 truncate">
                          {message.name}
                        </span>
                        {message.status === 'non lu' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            Non lu
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500 mb-1">{message.email}</p>
                      <p className="text-sm text-stone-600 line-clamp-2">
                        {message.message}
                      </p>
                      <p className="text-xs text-stone-400 mt-2">
                        {new Date(message.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <button 
                      onClick={() => {/* Fonction pour marquer comme lu */}}
                      className={`p-2 rounded-lg transition-colors ${
                        message.status === 'non lu' 
                          ? 'text-emerald-700 hover:bg-emerald-50' 
                          : 'text-stone-300 cursor-not-allowed'
                      }`}
                      disabled={message.status !== 'non lu'}
                      title="Marquer comme lu"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5" />
                      </svg>
                    </button>
                  </div>
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