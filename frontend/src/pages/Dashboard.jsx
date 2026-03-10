import React, { useEffect, useState } from 'react';
import { getStudentCount, getStudentsByYear, getStudentsPaged } from '../services/api';
import { Users, AlertCircle, TrendingUp, Loader, Calendar, Hash } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [count, setCount] = useState(0);
  const [statsByYear, setStatsByYear] = useState([]);
  const [pageInfo, setPageInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [countRes, yearRes, pagedRes] = await Promise.all([
          getStudentCount(),
          getStudentsByYear(),
          getStudentsPaged(0, 1) // fetch page metadata
        ]);
        setCount(countRes.data);
        setStatsByYear(yearRes.data);
        // Extract page metadata from Spring Data REST response
        if (pagedRes.data?.page) {
          setPageInfo(pagedRes.data.page);
        }
        setError(null);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
        setError("Could not load statistics. Ensure the backend is running on port 8081.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="page-loading"><Loader className="spinner" size={20}/> Loading dashboard...</div>;

  const yearCount = statsByYear.length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of student enrollment statistics</p>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {!error && (
        <>
          <div className="stats-row">
            <div className="card stat-card">
              <div className="stat-icon-box indigo">
                <Users size={24} />
              </div>
              <div>
                <div className="stat-label">Total Students</div>
                <div className="stat-number">{count}</div>
              </div>
            </div>

            <div className="card stat-card">
              <div className="stat-icon-box amber">
                <Calendar size={24} />
              </div>
              <div>
                <div className="stat-label">Birth Years</div>
                <div className="stat-number">{yearCount}</div>
              </div>
            </div>

            <div className="card stat-card">
              <div className="stat-icon-box green">
                <TrendingUp size={24} />
              </div>
              <div>
                <div className="stat-label">Avg / Year</div>
                <div className="stat-number">{yearCount > 0 ? Math.round(count / yearCount) : 0}</div>
              </div>
            </div>
          </div>

          {/* Paginated info from Spring Data REST */}
          {pageInfo && (
            <div className="card page-info-card">
              <h3><Hash size={16} /> Spring Data REST — Pagination Info</h3>
              <div className="page-info-grid">
                <div className="page-info-item">
                  <span className="page-info-label">Total Elements</span>
                  <span className="page-info-value">{pageInfo.totalElements}</span>
                </div>
                <div className="page-info-item">
                  <span className="page-info-label">Total Pages</span>
                  <span className="page-info-value">{pageInfo.totalPages}</span>
                </div>
                <div className="page-info-item">
                  <span className="page-info-label">Page Size</span>
                  <span className="page-info-value">{pageInfo.size}</span>
                </div>
                <div className="page-info-item">
                  <span className="page-info-label">Current Page</span>
                  <span className="page-info-value">{pageInfo.number}</span>
                </div>
              </div>
            </div>
          )}

          <div className="card chart-section">
            <h2>Students by Birth Year</h2>
            {statsByYear.length > 0 ? (
              <div className="chart-bars">
                {statsByYear.map((item, i) => {
                  const year = item[0] || 'N/A';
                  const value = item[1] || 0;
                  const max = Math.max(...statsByYear.map(x => x[1]));
                  const pct = max > 0 ? (value / max) * 100 : 0;
                  return (
                    <div key={i} className="chart-bar-row">
                      <div className="chart-bar-label">{year}</div>
                      <div className="chart-bar-track">
                        <div className="chart-bar-fill" style={{ width: `${pct}%` }}>
                          <span className="chart-bar-value">{value}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="empty-chart-msg">No birth year data available yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
