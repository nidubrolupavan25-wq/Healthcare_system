import React from "react";
import "../SuperAdminDashboard/css/dashboard-analytics.css"

/* ----- Mini SVG Charts ----- */
function MiniBar({ data = [], height = 30 }) {
  const max = Math.max(...data, 1);
  return (
    <div className="mini-bar" style={{ height }}>
      {data.map((v, i) => (
        <div key={i} className="mini-bar-col" style={{ height: `${(v / max) * 100}%` }} />
      ))}
    </div>
  );
}

function MiniLine({ data = [], width = 200, height = 48 }) {
  if (!data.length) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / (max - min || 1)) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg className="mini-line" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = angleDeg * Math.PI / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function MiniDonut({ series = [1, 2], size = 64 }) {
  const total = series.reduce((a, b) => a + b, 0) || 1;
  let angle = -90;

  const arcs = series.map((s, i) => {
    const portion = (s / total) * 360;
    const large = portion > 180 ? 1 : 0;

    const start = polarToCartesian(size / 2, size / 2, size / 2 - 6, angle);
    angle += portion;
    const end = polarToCartesian(size / 2, size / 2, size / 2 - 6, angle);

    const d = [
      `M ${size / 2} ${size / 2}`,
      `L ${start.x} ${start.y}`,
      `A ${size / 2 - 6} ${size / 2 - 6} 0 ${large} 1 ${end.x} ${end.y}`,
      "Z",
    ].join(" ");

    return { d, i };
  });

  return (
    <svg width={size} height={size} className="mini-donut" viewBox={`0 0 ${size} ${size}`}>
      {arcs.map((a) => (
        <path key={a.i} d={a.d} className={`donut-slice s${a.i}`} />
      ))}
      <circle cx={size / 2} cy={size / 2} r={size / 2 - 18} fill="white" />
    </svg>
  );
}

/* ----- Analytics Cards UI ----- */
export default function SuperAdminDashboardPage({ analyticsSample, dashboardCounts, openApproval }) {
  const a = analyticsSample;

  return (
    <div className="analytics-section">
      {/* ----- Top Metrics Row ----- */}
      <div className="metrics-row">
        <div className="metric-card">
          <div className="m-left">🏥</div>
          <div className="m-right">
            <div className="m-label">Total Hospitals</div>
            <div className="m-value">{dashboardCounts.hospitals}</div>
            <div className="m-mini">
              <MiniDonut
                series={[
                  a.hospitalsByCity[0].value,
                  a.hospitalsByCity.slice(1).reduce((s, c) => s + c.value, 0),
                ]}
              />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="m-left">💊</div>
          <div className="m-right">
            <div className="m-label">Medical Stores</div>
            <div className="m-value">{dashboardCounts.stores}</div>
            <div className="m-mini">
              <MiniBar data={a.storesByMonth.values} height={28} />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="m-left">👨‍⚕️</div>
          <div className="m-right">
            <div className="m-label">Total Patients</div>
            <div className="m-value">{a.totalPatients.toLocaleString()}</div>
            <div className="m-mini">
              <MiniLine data={a.approvalsTrend.values} />
            </div>
          </div>
        </div>

        {/* Pending Requests Card */}
        <div className="metric-card pending-card">
          <div className="m-left">⏳</div>
          <div className="m-right">
            <div className="m-label">Pending Requests</div>

            <div className="pending-list">
              <div className="pending-item">
                <span>Hospitals</span>
                <strong>{a.pendingApprovals}</strong>
              </div>

              <div className="pending-item">
                <span>Stores</span>
                <strong>0</strong>
              </div>

              <div className="pending-item total">
                <span>Total Pending</span>
                <strong>{a.pendingApprovals}</strong>
              </div>
            </div>

            <button className="btn small primary" style={{ marginTop: "10px" }} onClick={() => openApproval("pending")}>
              📥 View Pending Requests
            </button>
          </div>
        </div>
      </div>

      {/* ----- Charts Row ----- */}
      <div className="charts-row">
        {/* Hospitals by City */}
        <div className="chart-card">
          <div className="chart-title">Hospitals by City</div>
          <div className="chart-body">
            {a.hospitalsByCity.map((c) => (
              <div key={c.city} className="city-row">
                <div className="city-label">{c.city}</div>
                <div className="city-bar">
                  <div
                    style={{
                      width: `${Math.round(
                        (c.value / a.hospitalsByCity.reduce((s, x) => s + x.value, 0)) * 100
                      )}%`,
                    }}
                  />
                </div>
                <div className="city-val">{c.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Stores */}
        <div className="chart-card">
          <div className="chart-title">Monthly Registered Stores</div>
          <div className="chart-body">
            <MiniBar data={a.storesByMonth.values} height={80} />
            <div className="xlabels">{a.storesByMonth.months.join(" • ")}</div>
          </div>
        </div>

        {/* Approval Trend */}
        <div className="chart-card small">
          <div className="chart-title">Approval Trend (14d)</div>
          <MiniLine data={a.approvalsTrend.values} />
        </div>

        <div className="chart-card small">
          <div className="chart-title">Pending vs Approved</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <MiniDonut
              series={[
                a.pendingVsApproved.pending,
                a.pendingVsApproved.approved,
                a.pendingVsApproved.rejected,
              ]}
            />
            <div>
              <div className="tiny">Pending: {a.pendingVsApproved.pending}</div>
              <div className="tiny">Approved: {a.pendingVsApproved.approved}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
