import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import salaryService from '../services/salaryService';
import employeeService from '../services/employeeService';
import { useAuth } from '../context/AuthContext';
import './Salary.css';

const Salary = () => {
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [formData, setFormData] = useState({
    employee: '',
    basicSalary: '',
    allowances: [],
    deductions: [],
    currency: 'USD',
    paymentMode: 'Bank Transfer',
    bankDetails: {
      accountNumber: '',
      bankName: '',
      ifscCode: '',
      accountHolderName: ''
    },
    notes: ''
  });

  const { user, isHR, isAdmin } = useAuth();

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [salariesData, employeesData] = await Promise.all([
        salaryService.getAllSalaries(),
        employeeService.getEmployees()
      ]);
      setSalaries(salariesData);
      setEmployees(employeesData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('bankDetails.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        bankDetails: { ...formData.bankDetails, [field]: value }
      });
    } else if (name === 'employee') {
      // Auto-fill bank details when employee is selected
      const selectedEmp = employees.find(emp => emp._id === value);
      setFormData({
        ...formData,
        employee: value,
        bankDetails: selectedEmp?.bankDetails || {
          accountNumber: '',
          bankName: '',
          ifscCode: '',
          accountHolderName: ''
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addAllowance = () => {
    setFormData({
      ...formData,
      allowances: [...formData.allowances, { name: '', amount: 0 }]
    });
  };

  const removeAllowance = (index) => {
    const newAllowances = formData.allowances.filter((_, i) => i !== index);
    setFormData({ ...formData, allowances: newAllowances });
  };

  const updateAllowance = (index, field, value) => {
    const newAllowances = [...formData.allowances];
    if (field === 'amount') {
      newAllowances[index][field] = value === '' ? '' : parseFloat(value) || 0;
    } else {
      newAllowances[index][field] = value;
    }
    setFormData({ ...formData, allowances: newAllowances });
  };

  const addDeduction = () => {
    setFormData({
      ...formData,
      deductions: [...formData.deductions, { name: '', amount: 0 }]
    });
  };

  const removeDeduction = (index) => {
    const newDeductions = formData.deductions.filter((_, i) => i !== index);
    setFormData({ ...formData, deductions: newDeductions });
  };

  const updateDeduction = (index, field, value) => {
    const newDeductions = [...formData.deductions];
    if (field === 'amount') {
      newDeductions[index][field] = value === '' ? '' : parseFloat(value) || 0;
    } else {
      newDeductions[index][field] = value;
    }
    setFormData({ ...formData, deductions: newDeductions });
  };

  const openModal = (salary = null) => {
    if (salary) {
      setSelectedSalary(salary);
      setFormData({
        employee: salary.employee._id,
        basicSalary: salary.basicSalary,
        allowances: salary.allowances || [],
        deductions: salary.deductions || [],
        currency: salary.currency || 'USD',
        paymentMode: salary.paymentMode || 'Bank Transfer',
        bankDetails: salary.bankDetails || {
          accountNumber: '',
          bankName: '',
          ifscCode: '',
          accountHolderName: ''
        },
        notes: salary.notes || ''
      });
    } else {
      setSelectedSalary(null);
      setFormData({
        employee: '',
        basicSalary: '',
        allowances: [],
        deductions: [],
        currency: 'USD',
        paymentMode: 'Bank Transfer',
        bankDetails: {
          accountNumber: '',
          bankName: '',
          ifscCode: '',
          accountHolderName: ''
        },
        notes: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSalary(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (selectedSalary) {
        await salaryService.updateSalary(selectedSalary._id, formData);
        setSuccess('Salary updated successfully');
      } else {
        await salaryService.createSalary(formData);
        setSuccess('Salary created successfully');
      }
      fetchData();
      closeModal();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save salary');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this salary record?')) {
      try {
        await salaryService.deleteSalary(id);
        setSuccess('Salary deleted successfully');
        fetchData();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete salary');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const calculateTotals = (salary) => {
    const totalAllowances = salary.allowances?.reduce((sum, a) => sum + a.amount, 0) || 0;
    const totalDeductions = salary.deductions?.reduce((sum, d) => sum + d.amount, 0) || 0;
    const grossSalary = salary.basicSalary + totalAllowances;
    const netSalary = grossSalary - totalDeductions;
    return { totalAllowances, totalDeductions, grossSalary, netSalary };
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="salary-container">
        <div className="salary-header">
          <h1>Salary Management</h1>
          {(isHR() || isAdmin()) && (
            <button className="btn-primary" onClick={() => openModal()}>
              + Add Salary Structure
            </button>
          )}
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="salary-table-container">
          <table className="salary-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Basic Salary</th>
                <th>Allowances</th>
                <th>Deductions</th>
                <th>Gross Salary</th>
                <th>Net Salary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {salaries.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-data">No salary records found</td>
                </tr>
              ) : (
                salaries.map(salary => {
                  const totals = calculateTotals(salary);
                  return (
                    <tr key={salary._id}>
                      <td>
                        {salary.employee?.firstName} {salary.employee?.lastName}
                        <br />
                        <small>ID: {salary.employee?.employeeId}</small>
                      </td>
                      <td>{salary.employee?.department?.name || 'N/A'}</td>
                      <td>₹{salary.basicSalary.toLocaleString()}</td>
                      <td>₹{totals.totalAllowances.toLocaleString()}</td>
                      <td>₹{totals.totalDeductions.toLocaleString()}</td>
                      <td>₹{totals.grossSalary.toLocaleString()}</td>
                      <td className="net-salary">₹{totals.netSalary.toLocaleString()}</td>
                      <td>
                        <button className="btn-edit" onClick={() => openModal(salary)}>
                          Edit
                        </button>
                        {isAdmin() && (
                          <button className="btn-delete" onClick={() => handleDelete(salary._id)}>
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeModal}>&times;</button>
              <h2>{selectedSalary ? 'Edit Salary' : 'Add Salary Structure'}</h2>
              
              {error && <div className="alert alert-error">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Employee *</label>
                  <select
                    name="employee"
                    value={formData.employee}
                    onChange={handleInputChange}
                    required
                    disabled={selectedSalary !== null}
                  >
                    <option value="">Select Employee</option>
                    {employees.map(emp => (
                      <option key={emp._id} value={emp._id}>
                        {emp.firstName} {emp.lastName} - {emp.employeeId}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Basic Salary *</label>
                    <input
                      type="number"
                      name="basicSalary"
                      value={formData.basicSalary}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="form-group">
                    <label>Currency</label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="INR">INR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                </div>

                <div className="form-section">
                  <div className="section-header">
                    <h3>Allowances</h3>
                    <button type="button" className="btn-add-item" onClick={addAllowance}>
                      + Add Allowance
                    </button>
                  </div>
                  {formData.allowances.map((allowance, index) => (
                    <div key={index} className="item-row">
                      <input
                        type="text"
                        placeholder="Allowance name"
                        value={allowance.name}
                        onChange={(e) => updateAllowance(index, 'name', e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Amount"
                        value={allowance.amount}
                        onChange={(e) => updateAllowance(index, 'amount', e.target.value)}
                        min="0"
                        step="0.01"
                      />
                      <button type="button" className="btn-remove" onClick={() => removeAllowance(index)}>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div className="form-section">
                  <div className="section-header">
                    <h3>Deductions</h3>
                    <button type="button" className="btn-add-item" onClick={addDeduction}>
                      + Add Deduction
                    </button>
                  </div>
                  {formData.deductions.map((deduction, index) => (
                    <div key={index} className="item-row">
                      <input
                        type="text"
                        placeholder="Deduction name"
                        value={deduction.name}
                        onChange={(e) => updateDeduction(index, 'name', e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Amount"
                        value={deduction.amount}
                        onChange={(e) => updateDeduction(index, 'amount', e.target.value)}
                        min="0"
                        step="0.01"
                      />
                      <button type="button" className="btn-remove" onClick={() => removeDeduction(index)}>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div class="form-group">
                  <label>Payment Mode</label>
                  <select
                    name="paymentMode"
                    value={formData.paymentMode}
                    onChange={handleInputChange}
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>

                <div className="form-section">
                  <h3>Bank Details</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Account Holder Name</label>
                      <input
                        type="text"
                        name="bankDetails.accountHolderName"
                        value={formData.bankDetails.accountHolderName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Account Number</label>
                      <input
                        type="text"
                        name="bankDetails.accountNumber"
                        value={formData.bankDetails.accountNumber}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Bank Name</label>
                      <input
                        type="text"
                        name="bankDetails.bankName"
                        value={formData.bankDetails.bankName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>IFSC Code</label>
                      <input
                        type="text"
                        name="bankDetails.ifscCode"
                        value={formData.bankDetails.ifscCode}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                  ></textarea>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {selectedSalary ? 'Update' : 'Create'} Salary
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Salary;
