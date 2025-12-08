import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React, { useEffect, useState } from "react";
import "../css/LabManagement.css";
import { Button, Modal, Form, Table, Alert, Spinner, Dropdown } from "react-bootstrap";
import { Edit3, Trash2, Plus, FlaskConical, MoreVertical, Save, X } from "lucide-react";
import { LabAPI } from "../../services/api";

const LabManagement = () => {
  const [categories, setCategories] = useState([]);
  const [tests, setTests] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [showAddTestForm, setShowAddTestForm] = useState(false);
  const [newTest, setNewTest] = useState({ name: "", cost: "" });
  const [editingTestId, setEditingTestId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", cost: "" });
  const [loading, setLoading] = useState(false);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false }), 3000);
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await LabAPI.getAllCategories();
      setCategories(res.data);
      if (res.data.length > 0 && !selectedCategory) setSelectedCategory(res.data[0]);
    } catch {
      showAlert("danger", "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTests = async () => {
    try {
      const res = await LabAPI.getAllTests();
      setTests(res.data);
    } catch {
      showAlert("danger", "Failed to load tests.");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTests();
  }, []);

  const addCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const res = await LabAPI.addCategory({ categoryName: newCategoryName });
      setCategories([...categories, res.data]);
      setNewCategoryName("");
      setShowCategoryModal(false);
      showAlert("success", "Category added successfully!");
    } catch {
      showAlert("danger", "Failed to add category.");
    }
  };

  const updateCategory = async (id, name) => {
    try {
      await LabAPI.updateCategory(id, { categoryName: name });
      const updated = categories.map((c) =>
        c.categoryId === id ? { ...c, categoryName: name } : c
      );
      setCategories(updated);
      showAlert("success", "Category updated!");
    } catch {
      showAlert("danger", "Failed to update category.");
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category and all its tests?")) return;
    try {
      await LabAPI.deleteCategory(id);
      setCategories(categories.filter((c) => c.categoryId !== id));
      if (selectedCategory?.categoryId === id) setSelectedCategory(null);
      showAlert("warning", "Category deleted.");
    } catch {
      showAlert("danger", "Failed to delete category.");
    }
  };

  const addTest = async (e) => {
    e.preventDefault();
    if (!newTest.name || !newTest.cost) return;
    try {
      const res = await LabAPI.addTest({
        testName: newTest.name,
        testCost: parseFloat(newTest.cost),
        category: { categoryId: selectedCategory.categoryId },
      });
      setTests([...tests, res.data]);
      setNewTest({ name: "", cost: "" });
      setShowAddTestForm(false);
      showAlert("success", "Test added successfully!");
    } catch {
      showAlert("danger", "Failed to add test.");
    }
  };

  const startEditTest = (test) => {
    setEditingTestId(test.testId);
    setEditForm({ name: test.testName, cost: test.testCost });
  };

  const saveEditTest = async (id) => {
    try {
      await LabAPI.updateTest(id, {
        testName: editForm.name,
        testCost: parseFloat(editForm.cost),
      });
      const updated = tests.map((t) =>
        t.testId === id ? { ...t, testName: editForm.name, testCost: editForm.cost } : t
      );
      setTests(updated);
      setEditingTestId(null);
      showAlert("success", "Test updated!");
    } catch {
      showAlert("danger", "Failed to update test.");
    }
  };

  const deleteTest = async (testId) => {
    if (!window.confirm("Delete this test?")) return;
    try {
      await LabAPI.deleteTest(testId);
      setTests(tests.filter((t) => t.testId !== testId));
      showAlert("warning", "Test deleted.");
    } catch {
      showAlert("danger", "Failed to delete test.");
    }
  };

  return (
    <div className="lab-admin-wrapper">
      {/* ---- Header ---- */}
      <div className="lab-admin-header">
        <h3 className="lab-admin-title">
          <FlaskConical size={22} /> Lab Management
        </h3>
        <div className="lab-admin-btn-right">
          <Button
            variant="success"
            className="lab-admin-btn-small"
            onClick={() => setShowCategoryModal(true)}
          >
            <Plus size={14} /> Add Category
          </Button>
        </div>
      </div>

      {alert.show && (
        <Alert variant={alert.type} onClose={() => setAlert({ show: false })} dismissible>
          {alert.message}
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <div className="lab-admin-grid">
            {categories.map((cat) => (
              <div
                key={cat.categoryId}
                className={`lab-admin-card ${
                  selectedCategory?.categoryId === cat.categoryId ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                <div className="lab-admin-card-header">
                  <h6>{cat.categoryName}</h6>
                  <Dropdown align="end" onClick={(e) => e.stopPropagation()}>
                    <Dropdown.Toggle variant="light" className="lab-admin-dots-btn">
                      <MoreVertical size={18} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => {
                          const name = prompt("Edit Category:", cat.categoryName);
                          if (name) updateCategory(cat.categoryId, name);
                        }}
                      >
                        <Edit3 size={14} /> Edit
                      </Dropdown.Item>
                      <Dropdown.Item
                        className="text-danger"
                        onClick={() => deleteCategory(cat.categoryId)}
                      >
                        <Trash2 size={14} /> Delete
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <span className="lab-admin-badge">
                  {tests.filter((t) => t.category?.categoryId === cat.categoryId).length}
                </span>
              </div>
            ))}
          </div>

          {selectedCategory && (
            <div className="lab-admin-tests-section">
              <div className="lab-admin-tests-header">
                <h5 className="m-0">{selectedCategory.categoryName} — Tests</h5>
                <div className="lab-admin-btn-right">
                  <Button
                    size="sm"
                    variant="success"
                    className="lab-admin-btn-small"
                    onClick={() => setShowAddTestForm(!showAddTestForm)}
                  >
                    <Plus size={14} /> Add Test
                  </Button>
                </div>
              </div>

              {showAddTestForm && (
                <Form onSubmit={addTest} className="lab-admin-addtest-form">
                  <Form.Control
                    type="text"
                    placeholder="Test Name"
                    value={newTest.name}
                    onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
                    required
                  />
                  <Form.Control
                    type="number"
                    placeholder="Cost (₹)"
                    value={newTest.cost}
                    onChange={(e) => setNewTest({ ...newTest, cost: e.target.value })}
                    required
                  />
                  <Button type="submit" variant="success">
                    Add
                  </Button>
                  <Button variant="secondary" onClick={() => setShowAddTestForm(false)}>
                    Cancel
                  </Button>
                </Form>
              )}

              <Table bordered hover responsive className="lab-admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Test Name</th>
                    <th>Cost</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tests
                    .filter((t) => t.category?.categoryId === selectedCategory.categoryId)
                    .map((test, index) => (
                      <tr key={test.testId}>
                        <td>{index + 1}</td>
                        <td>
                          {editingTestId === test.testId ? (
                            <Form.Control
                              value={editForm.name}
                              onChange={(e) =>
                                setEditForm({ ...editForm, name: e.target.value })
                              }
                            />
                          ) : (
                            test.testName
                          )}
                        </td>
                        <td>
                          {editingTestId === test.testId ? (
                            <Form.Control
                              type="number"
                              value={editForm.cost}
                              onChange={(e) =>
                                setEditForm({ ...editForm, cost: e.target.value })
                              }
                            />
                          ) : (
                            `₹${test.testCost}`
                          )}
                        </td>
                        <td className="lab-admin-actions">
                          {editingTestId === test.testId ? (
                            <>
                              <Button
                                size="sm"
                                variant="success"
                                onClick={() => saveEditTest(test.testId)}
                              >
                                <Save size={14} />
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => setEditingTestId(null)}
                              >
                                <X size={14} />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="outline-primary"
                                onClick={() => startEditTest(test)}
                              >
                                <Edit3 size={14} />
                              </Button>
                              <span className="lab-action-sep">--</span>
                              <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => deleteTest(test.testId)}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
          )}
        </>
      )}

      <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)} centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>Add New Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="e.g., Ultrasound"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCategoryModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={addCategory}>
            Add Category
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LabManagement;
