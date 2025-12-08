import React from "react";

export default function ViewHospitalPage({ item, onBack }) {
  if (!item) return null;

  let documents = [];
  try {
    documents = item.documents ? JSON.parse(item.documents) : [];
  } catch {
    documents = [];
  }

  return (
    <div className="page-wrapper">

      <button className="btn ghost" onClick={onBack}>⬅ Back</button>

      <h2 className="page-title">{item.name}</h2>
      <div className="pg-sub">Hospital Full Details</div>

      <div className="details-scroll" style={{ maxHeight: "75vh", overflowY: "auto" }}>
        <table className="details-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>VALUE</th>
            </tr>
          </thead>

          <tbody>
            {Object.entries(item).map(([key, value]) => {
              // Handle null or empty
              if (!value) value = "—";

              // Skip documents here (we show separately)
              if (key === "documents") return null;

              return (
                <tr key={key}>
                  <td>{key.replace(/_/g, " ").toUpperCase()}</td>
                  <td>{value.toString()}</td>
                </tr>
              );
            })}

            {/* IMAGES */}
            <tr>
              <td colSpan="2"><strong>IMAGES</strong></td>
            </tr>

            {Object.entries(item).map(([key, value]) => {
              if (key.toLowerCase().includes("image") && value) {
                return (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>
                      <img
                        src={value}
                        style={{ width: "150px", borderRadius: "6px" }}
                        alt="hospital"
                      />
                    </td>
                  </tr>
                );
              }
              return null;
            })}

            {/* DOCUMENTS */}
            <tr>
              <td colSpan="2"><strong>DOCUMENTS</strong></td>
            </tr>

            {documents.length > 0 ? (
              documents.map((doc, i) => (
                <tr key={i}>
                  <td>{doc.name}</td>
                  <td>
                    <a
                      href={`data:${doc.type};base64,${doc.data}`}
                      download={doc.name}
                      className="btn small"
                    >
                      Download
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No Documents Found</td>
              </tr>
            )}

          </tbody>
        </table>
      </div>
    </div>
  );
}
