import React, { useState, useEffect, useRef } from "react";
import { WardAPI, BedBookingAPI } from "../../services/api";
import "../css/BookingPage.css";
import Header from "../Header/Header";

const BookingPage = () => {
  const [blocks, setBlocks] = useState([
    { id: 1, name: "General", wardType: "General", wards: [] },
    { id: 2, name: "ICU", wardType: "ICU", wards: [] },
  ]);

  const [expandedBlock, setExpandedBlock] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [filterStatus, setFilterStatus] = useState("Total");
  const [wardCounts, setWardCounts] = useState({});
  const [loading, setLoading] = useState(false);

  // Add Ward form state
  const [showAddWardForm, setShowAddWardForm] = useState(false);
  const [newWardData, setNewWardData] = useState({
    name: "",
    type: "",
    totalBeds: "",
  });

  // Booking & Edit modals state
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showDischargeDateForm, setShowDischargeDateForm] = useState(false);
  const [showEditOptions, setShowEditOptions] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);
  const [bookingFormData, setBookingFormData] = useState({
    patientId: "",
    dischargeDate: "",
  });
  const [dischargeDateInput, setDischargeDateInput] = useState("");

  // NEW: 3-dot menu
  const [menuOpenFor, setMenuOpenFor] = useState(null);
  const [showRemoveBedModal, setShowRemoveBedModal] = useState(false);
  const [showAddBedModal, setShowAddBedModal] = useState(false);
  const [bedIdInput, setBedIdInput] = useState("");
  const [currentWardId, setCurrentWardId] = useState(null);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpenFor(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch wards and counts
  useEffect(() => {
    if (!expandedBlock) return;

    const fetchWardsAndCounts = async () => {
      setLoading(true);
      try {
        const block = blocks.find((b) => b.id === expandedBlock);
        const res = await WardAPI.getAll();

        const filteredWards = res.data
          .filter((w) => w.wardType === block.wardType)
          .map((w) => ({
            wardId: w.wardId,
            wardName: w.wardName,
            wardType: w.wardType,
          }));

        const counts = {};

        await Promise.all(
          filteredWards.map(async (ward) => {
            try {
              const [totalRes, bookedRes, availableRes] = await Promise.all([
                WardAPI.getTotalBeds(ward.wardId),
                WardAPI.getBookedBeds(ward.wardId),
                WardAPI.getAvailableBeds(ward.wardId),
              ]);

              counts[ward.wardId] = {
                total: Number(totalRes.data) || 0,
                booked: Number(bookedRes.data) || 0,
                available: Number(availableRes.data) || 0,
              };
            } catch (err) {
              console.error("Error fetching counts:", err);
            }
          })
        );

        setWardCounts(counts);
        setBlocks((prevBlocks) =>
          prevBlocks.map((b) =>
            b.id === expandedBlock ? { ...b, wards: filteredWards } : b
          )
        );
      } catch (err) {
        console.error("Error fetching wards:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWardsAndCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandedBlock]);

  const toggleBlock = (blockId) => {
    setExpandedBlock(expandedBlock === blockId ? null : blockId);
    setSelectedWard(null);
    setFilterStatus("Total");
    setMenuOpenFor(null);
  };

  const handleWardClick = async (ward) => {
    setFilterStatus("Total");
    const beds = await fetchBeds(ward, "Total");
    setSelectedWard({ ...ward, beds });
  };

  const fetchBeds = async (ward, status) => {
    if (!ward) return [];

    try {
      let res;
      if (status === "Available") {
        res = await WardAPI.getAvailableBedsList(ward.wardId);
      } else if (status === "Booked") {
        res = await WardAPI.getBookedBedsList(ward.wardId);
      } else {
        res = await WardAPI.getAllBeds(ward.wardId);
      }

      if (!Array.isArray(res.data)) return [];

      const seen = new Set();
      const beds = [];

      res.data.forEach((bed) => {
        const id = bed.BED_ID ?? bed.BEDID ?? bed.bedId;
        if (!id || seen.has(id)) return;
        seen.add(id);

        beds.push({
          bedId: id,
          bedNumber: id,
          bookingId: bed.bookingId ?? bed.BOOKING_ID ?? bed.bookingId,
          bedType: bed.BED_TYPE ?? bed.BEDTYPE ?? "-",
          patientId: bed.PATIENT_ID ?? bed.PATIENTID,
          bookingDate: bed.ADMISSION_DATE ?? bed.BOOKINGDATE,
          dischargeDate: bed.DISCHARGE_DATE ?? bed.DISCHARGEDATE,
          status: bed.STATUS === "Active" ? "Booked" : "Not Booked",
        });
      });

      return beds;
    } catch (err) {
      console.error("Error fetching beds:", err);
      return [];
    }
  };

  const handleFilterClick = async (ward, status) => {
    setFilterStatus(status);
    const beds = await fetchBeds(ward, status);
    setSelectedWard({ ...ward, beds });
  };

  // Add Ward
  const handleAddWardClick = (blockName) => {
    setShowAddWardForm(true);
    setNewWardData({ name: "", type: blockName, totalBeds: "" });
  };

  const handleNewWardChange = (e) => {
    const { name, value } = e.target;
    setNewWardData({ ...newWardData, [name]: value });
  };

  const handleAddWardSubmit = async (e) => {
    e.preventDefault();
    if (!newWardData.name || !newWardData.type || !newWardData.totalBeds) {
      alert("Please fill all fields!");
      return;
    }

    try {
      const payload = {
        wardName: newWardData.name.trim(),
        wardType: newWardData.type.trim(),
        totalBeds: Number(newWardData.totalBeds),
      };

      const res = await WardAPI.add(payload);
      const blockId = blocks.find((b) => b.name === newWardData.type)?.id;

      if (blockId) {
        const newWard = {
          wardId: res.data.wardId,
          wardName: res.data.wardName,
          wardType: res.data.wardType,
        };
        setBlocks((prev) =>
          prev.map((b) =>
            b.id === blockId ? { ...b, wards: [...b.wards, newWard] } : b
          )
        );
      }

      setShowAddWardForm(false);
      setNewWardData({ name: "", type: "", totalBeds: "" });
    } catch (err) {
      console.error("Error adding ward:", err);
      alert("Failed to add ward. Please try again.");
    }
  };

  const filteredBeds = () => selectedWard?.beds || [];
  const selectedBlock = blocks.find((b) => b.id === expandedBlock);

  // BOOKING LOGIC
  const handleBookClick = (bed) => {
    setSelectedBed(bed);
    setBookingFormData({ patientId: "", dischargeDate: "" });
    setShowBookingForm(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingFormData.patientId || !bookingFormData.dischargeDate) {
      alert("Please enter Patient ID and Discharge Date");
      return;
    }

    try {
      const payload = {
        bedId: selectedBed.bedId,
        patientId: parseInt(bookingFormData.patientId),
        ward: { wardId: selectedWard.wardId },
        dischargeDate: bookingFormData.dischargeDate,
        status: "Active",
      };

      await BedBookingAPI.bookBed(payload);
      alert("Bed booked successfully!");
      setShowBookingForm(false);

      const beds = await fetchBeds(selectedWard, filterStatus);
      setSelectedWard((prev) => ({ ...prev, beds }));

      const [totalRes, bookedRes, availableRes] = await Promise.all([
        WardAPI.getTotalBeds(selectedWard.wardId),
        WardAPI.getBookedBeds(selectedWard.wardId),
        WardAPI.getAvailableBeds(selectedWard.wardId),
      ]);
      setWardCounts((prev) => ({
        ...prev,
        [selectedWard.wardId]: {
          total: Number(totalRes.data) || 0,
          booked: Number(bookedRes.data) || 0,
          available: Number(availableRes.data) || 0,
        },
      }));
    } catch (err) {
      console.error("Booking failed:", err);
      alert(
        "Failed to book bed. " + (err.response?.data?.message || "Please try again.")
      );
    }
  };

  const handleEditClick = (bed) => {
    setSelectedBed(bed);
    setShowEditOptions(true);
  };

  const handleChangeDischargeClick = (bed) => {
    setSelectedBed(bed);
    setDischargeDateInput("");
    setShowDischargeDateForm(true);
  };

  const handleDischargeDateSubmit = async (e) => {
    e.preventDefault();
    if (!dischargeDateInput) return alert("Select date");

    try {
      await BedBookingAPI.updateBedByWardAndBed({
        wardId: selectedWard.wardId,
        bedId: selectedBed.bedId,
        dischargeDate: dischargeDateInput,
      });

      alert("Discharge date updated!");
      setShowDischargeDateForm(false);
      setShowEditOptions(false);

      const beds = await fetchBeds(selectedWard, filterStatus);
      setSelectedWard(prev => ({ ...prev, beds }));
      await refreshWardCounts();
    } catch (err) {
      alert("Failed to update discharge date");
    }
  };

  const handleChangeStatusClick = async (bed) => {
    if (!window.confirm("Mark this bed as Available for next patient?")) return;

    try {
      await BedBookingAPI.updateBedByWardAndBed({
        wardId: selectedWard.wardId,
        bedId: bed.bedId,
        makeAvailable: true,
      });

      alert("Bed is now Available!");
      setShowEditOptions(false);

      const beds = await fetchBeds(selectedWard, filterStatus);
      setSelectedWard(prev => ({ ...prev, beds }));
      await refreshWardCounts();
    } catch (err) {
      console.error("Make available failed:", err);
      alert("Failed to make available. Check console for details.");
    }
  };

  const refreshWardCounts = async () => {
    if (!selectedWard) return;
    const [totalRes, bookedRes, availableRes] = await Promise.all([
      WardAPI.getTotalBeds(selectedWard.wardId),
      WardAPI.getBookedBeds(selectedWard.wardId),
      WardAPI.getAvailableBeds(selectedWard.wardId),
    ]);
    setWardCounts((prev) => ({
      ...prev,
      [selectedWard.wardId]: {
        total: Number(totalRes.data) || 0,
        booked: Number(bookedRes.data) || 0,
        available: Number(availableRes.data) || 0,
      },
    }));
  };

  // NEW: 3-dot menu handlers
  const openMenu = (wardId, e) => {
    e.stopPropagation();
    setMenuOpenFor(wardId);
  };

  const handleRemoveWard = async (wardId) => {
    if (!window.confirm("Delete this entire ward? All beds will be lost.")) return;
    try {
      await WardAPI.deleteWard(wardId);
      setBlocks(prev => prev.map(b => ({
        ...b,
        wards: b.wards.filter(w => w.wardId !== wardId)
      })));
      setWardCounts(prev => { const { [wardId]: _, ...rest } = prev; return rest; });
      setMenuOpenFor(null);
      if (selectedWard?.wardId === wardId) setSelectedWard(null);
    } catch (err) {
      alert("Failed to delete ward");
    }
  };

  const openRemoveBed = (wardId, e) => {
    e.stopPropagation();
    setCurrentWardId(wardId);
    setBedIdInput("");
    setShowRemoveBedModal(true);
    setMenuOpenFor(null);
  };

  const openAddBed = (wardId, e) => {
    e.stopPropagation();
    setCurrentWardId(wardId);
    setBedIdInput("");
    setShowAddBedModal(true);
    setMenuOpenFor(null);
  };

  const submitRemoveBed = async (e) => {
    e.preventDefault();
    const bedId = Number(bedIdInput);
    if (isNaN(bedId)) return alert("Enter valid Bed ID");

    try {
      await BedBookingAPI.deleteBed({ wardId: currentWardId, bedId });
      alert("Bed removed!");
      setShowRemoveBedModal(false);
      if (selectedWard?.wardId === currentWardId) {
        const beds = await fetchBeds(selectedWard, filterStatus);
        setSelectedWard(prev => ({ ...prev, beds }));
      }
      await refreshWardCounts();
    } catch (err) {
      alert("Failed to remove bed");
    }
  };

  const submitAddBed = async (e) => {
    e.preventDefault();
    const bedId = Number(bedIdInput);
    if (isNaN(bedId)) return alert("Enter valid Bed ID");

    try {
      await BedBookingAPI.addBed({ wardId: currentWardId, bedId });
      alert("Bed added!");
      setShowAddBedModal(false);
      if (selectedWard?.wardId === currentWardId) {
        const beds = await fetchBeds(selectedWard, filterStatus);
        setSelectedWard(prev => ({ ...prev, beds }));
      }
      await refreshWardCounts();
    } catch (err) {
      alert("Failed to add bed");
    }
  };

  return (
    <>
   
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div className="page-header">
        <h1 style={{ textAlign: "center", color: "#2C3E50" }}>
          Hospital Bed Overview
        </h1>
        {expandedBlock && (
          <div>
            <button
              className="add_button"
              onClick={() =>
                handleAddWardClick(blocks.find((b) => b.id === expandedBlock).name)
              }
            >
              Add {blocks.find((b) => b.id === expandedBlock)?.name}
            </button>
          </div>
        )}
      </div>

      {/* BLOCKS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {blocks.map((block) => (
          <div
            key={block.id}
            onClick={() => toggleBlock(block.id)}
            style={{
              padding: "25px",
              borderRadius: "10px",
              backgroundColor: expandedBlock === block.id ? "#2980B9" : "#3498DB",
              color: "white",
              textAlign: "center",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
              fontSize: "18px",
            }}
          >
            {block.name}
          </div>
        ))}
      </div>

      {/* WARDS SECTION */}
      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
      {selectedBlock && selectedBlock.wards.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3 style={{ color: "#2C3E50" }}>{selectedBlock.name}s</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "15px",
              padding: "10px",
            }}
          >
            {selectedBlock.wards.map((ward) => (
              <div
                key={ward.wardId}
                onClick={() => handleWardClick(ward)}
                style={{
                  position: "relative",
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  padding: "10px",
                  backgroundColor: "#F0F3F4",
                  cursor: "pointer",
                  textAlign: "center",
                }}
                ref={menuOpenFor === ward.wardId ? menuRef : null}
              >
                <h4>{ward.wardName}</h4>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "5px",
                    marginTop: "10px",
                  }}
                >
                  {["Total", "Available", "Booked"].map((status) => (
                    <div
                      key={status}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFilterClick(ward, status);
                      }}
                      style={{
                        backgroundColor:
                          filterStatus === status
                            ? status === "Total"
                              ? "#3498DB"
                              : status === "Available"
                              ? "#58D68D"
                              : "#E74C3C"
                            : status === "Total"
                            ? "#5DADE2"
                            : status === "Available"
                            ? "#82E0AA"
                            : "#EC7063",
                        color: "white",
                        padding: "10px",
                        borderRadius: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      {status}
                      <br />
                      {wardCounts[ward.wardId]?.[
                        status === "Total"
                          ? "total"
                          : status === "Available"
                          ? "available"
                          : "booked"
                      ] || 0}
                    </div>
                  ))}
                </div>

                {/* 3-dot menu */}
                <div
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    fontSize: "20px",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                  onClick={(e) => openMenu(ward.wardId, e)}
                >
                  &#x22EE;
                </div>

                {/* Dropdown */}
                {menuOpenFor === ward.wardId && (
                  <div
                    style={{
                      position: "absolute",
                      top: "32px",
                      right: "0",
                      background: "white",
                      border: "1px solid #ddd",
                      borderRadius: "6px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      zIndex: 10,
                      minWidth: "140px",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div style={menuItem} onClick={() => handleRemoveWard(ward.wardId)}>
                      Remove Ward
                    </div>
                    <div style={menuItem} onClick={(e) => openRemoveBed(ward.wardId, e)}>
                      Remove Bed
                    </div>
                    <div style={menuItem} onClick={(e) => openAddBed(ward.wardId, e)}>
                      Add Bed
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* BEDS TABLE */}
          {selectedWard && (
            <div style={{ marginTop: "20px" }}>
              <h3>
                {selectedWard.wardName} Beds ({filterStatus})
              </h3>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "center",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#34495E", color: "white" }}>
                    <th>Bed ID</th>
                    <th>Patient ID</th>
                    <th>Booking Date</th>
                    <th>Discharge Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBeds().map((bed) => (
                    <tr key={bed.bedId}>
                      <td>{bed.bedId}</td>
                      <td>{bed.patientId || "-"}</td>
                      <td>{bed.bookingDate || "-"}</td>
                      <td>{bed.dischargeDate || "-"}</td>
                      <td>
                        {bed.status === "Not Booked" ? (
                          <button
                            onClick={() => handleBookClick(bed)}
                            style={{
                              backgroundColor: "#27AE60",
                              color: "white",
                              border: "none",
                              borderRadius: "5px",
                              padding: "5px 10px",
                              cursor: "pointer",
                            }}
                          >
                            Book
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEditClick(bed)}
                            style={{
                              backgroundColor: "#E67E22",
                              color: "white",
                              border: "none",
                              borderRadius: "5px",
                              padding: "5px 10px",
                              cursor: "pointer",
                            }}
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* === ALL MODALS (UNCHANGED + NEW ONES) === */}

      {/* ADD WARD MODAL */}
      {showAddWardForm && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3>Add New Ward</h3>
            <form onSubmit={handleAddWardSubmit}>
              <label>Ward Name:</label>
              <input type="text" name="name" value={newWardData.name} onChange={handleNewWardChange} style={inputStyle} />
              <label>Ward Type:</label>
              <input type="text" name="type" value={newWardData.type} readOnly style={{ ...inputStyle, backgroundColor: "#f0f0f0" }} />
              <label>Total Beds:</label>
              <input type="number" name="totalBeds" value={newWardData.totalBeds} onChange={handleNewWardChange} style={inputStyle} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px" }}>
                <button type="submit" style={greenBtn}>Add Ward</button>
                <button type="button" onClick={() => setShowAddWardForm(false)} style={redBtn}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BOOKING MODAL */}
      {showBookingForm && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3>Book Bed #{selectedBed?.bedNumber}</h3>
            <form onSubmit={handleBookingSubmit}>
              <label>Patient ID:</label>
              <input type="text" value={bookingFormData.patientId} onChange={e => setBookingFormData({ ...bookingFormData, patientId: e.target.value })} style={inputStyle} required />
              <label>Discharge Date:</label>
              <input type="date" value={bookingFormData.dischargeDate} onChange={e => setBookingFormData({ ...bookingFormData, dischargeDate: e.target.value })} style={inputStyle} required />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px" }}>
                <button type="submit" style={greenBtn}>Confirm</button>
                <button type="button" onClick={() => setShowBookingForm(false)} style={redBtn}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT OPTIONS MODAL */}
      {showEditOptions && (
        <div style={modalOverlay}>
          <div style={{ ...modalContent, width: "380px", textAlign: "center" }}>
            <h3 style={{ margin: "0 0 15px 0" }}>Edit Bed #{selectedBed?.bedNumber}</h3>
            <p style={{ margin: "10px 0", fontSize: "14px" }}>
              Patient ID: <strong>{selectedBed?.patientId}</strong>
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button onClick={() => { setShowEditOptions(false); handleChangeDischargeClick(selectedBed); }} style={{ ...blueBtn, flex: 1 }}>Change Discharge Date</button>
              <button onClick={() => { setShowEditOptions(false); handleChangeStatusClick(selectedBed); }} style={{ ...orangeBtn, flex: 1 }}>Make Available</button>
            </div>
            <button onClick={() => setShowEditOptions(false)} style={{ ...grayBtn, marginTop: "15px", width: "100%" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* CHANGE DISCHARGE DATE MODAL */}
      {showDischargeDateForm && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3>Update Discharge Date - Bed #{selectedBed?.bedNumber}</h3>
            <form onSubmit={handleDischargeDateSubmit}>
              <label>New Discharge Date:</label>
              <input type="date" value={dischargeDateInput} onChange={e => setDischargeDateInput(e.target.value)} style={inputStyle} required />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px" }}>
                <button type="submit" style={blueBtn}>Update</button>
                <button type="button" onClick={() => setShowDischargeDateForm(false)} style={redBtn}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REMOVE BED MODAL */}
      {showRemoveBedModal && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3>Remove Bed</h3>
            <form onSubmit={submitRemoveBed}>
              <label>Enter Bed ID:</label>
              <input type="number" value={bedIdInput} onChange={e => setBedIdInput(e.target.value)} style={inputStyle} required />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px" }}>
                <button type="submit" style={redBtn}>Remove</button>
                <button type="button" onClick={() => setShowRemoveBedModal(false)} style={grayBtn}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD BED MODAL */}
      {showAddBedModal && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3>Add Bed</h3>
            <form onSubmit={submitAddBed}>
              <label>Enter Bed ID:</label>
              <input type="number" value={bedIdInput} onChange={e => setBedIdInput(e.target.value)} style={inputStyle} required />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px" }}>
                <button type="submit" style={greenBtn}>Add</button>
                <button type="button" onClick={() => setShowAddBedModal(false)} style={grayBtn}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

// Reusable styles
const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContent = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "10px",
  width: "400px",
};

const inputStyle = {
  width: "100%",
  marginBottom: "10px",
  padding: "8px",
};

const greenBtn = {
  backgroundColor: "#27AE60",
  color: "white",
  border: "none",
  padding: "8px 15px",
  borderRadius: "5px",
  cursor: "pointer",
};

const redBtn = {
  backgroundColor: "#E74C3C",
  color: "white",
  border: "none",
  padding: "8px 15px",
  borderRadius: "5px",
  cursor: "pointer",
};

const blueBtn = {
  backgroundColor: "#3498DB",
  color: "white",
  border: "none",
  padding: "10px 15px",
  borderRadius: "5px",
  cursor: "pointer",
};

const orangeBtn = {
  backgroundColor: "#E67E22",
  color: "white",
  border: "none",
  padding: "10px 15px",
  borderRadius: "5px",
  cursor: "pointer",
};

const grayBtn = {
  backgroundColor: "#95A5A6",
  color: "white",
  border: "none",
  padding: "8px 15px",
  borderRadius: "5px",
  cursor: "pointer",
};

const menuItem = {
  padding: "10px 14px",
  cursor: "pointer",
  borderBottom: "1px solid #eee",
  fontSize: "14px",
};
menuItem[':last-child'] = { borderBottom: "none" };

export default BookingPage;