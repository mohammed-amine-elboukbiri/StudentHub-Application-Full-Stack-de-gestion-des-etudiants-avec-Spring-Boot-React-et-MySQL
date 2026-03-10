import React, { useEffect, useState } from 'react';
import { getAllStudents, deleteStudentById, saveStudent, updateStudent } from '../services/api';
import { Trash2, Plus, Users as UsersIcon, Loader, X, Edit, Check } from 'lucide-react';
import './StudentsList.css';

const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null); // null = create, object = edit
  const [formData, setFormData] = useState({ nom: '', prenom: '', dateNaissance: '' });

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data } = await getAllStudents();
      setStudents(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch students", err);
      setError("Could not load students. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const openCreateModal = () => {
    setEditingStudent(null);
    setFormData({ nom: '', prenom: '', dateNaissance: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setFormData({
      nom: student.nom || '',
      prenom: student.prenom || '',
      dateNaissance: student.dateNaissance
        ? new Date(student.dateNaissance).toISOString().split('T')[0]
        : ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this student?")) {
      try {
        await deleteStudentById(id);
        setStudents(prev => prev.filter(s => s.id !== id));
      } catch (err) {
        alert("Failed to delete student.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        // PUT update via Spring Data REST /students/{id}
        await updateStudent(editingStudent.id, formData);
        // Refresh the list to get updated data
        await fetchStudents();
      } else {
        // POST create via custom controller /students/save
        const { data } = await saveStudent(formData);
        setStudents(prev => [...prev, data]);
      }
      setIsModalOpen(false);
      setEditingStudent(null);
      setFormData({ nom: '', prenom: '', dateNaissance: '' });
    } catch (err) {
      console.error("Failed to save student", err);
      alert("Failed to save student.");
    }
  };

  if (loading && students.length === 0) {
    return <div className="page-loading"><Loader className="spinner" size={20}/> Loading students...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Students</h1>
          <p>Manage all enrolled students — Create, Edit, Delete</p>
        </div>
        <button className="btn-primary" onClick={openCreateModal}>
          <Plus size={18} /> Add Student
        </button>
      </div>

      {error && <div className="error-banner" style={{marginBottom: 20}}>{error}</div>}

      {students.length > 0 ? (
        <div className="card students-table-wrapper">
          <table className="students-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>ID</th>
                <th>Date of Birth</th>
                <th style={{width: 100}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id}>
                  <td>
                    <div className="student-name-cell">
                      <div className="table-avatar">{s.prenom?.charAt(0)}{s.nom?.charAt(0)}</div>
                      <div>
                        <div className="name">{s.prenom} {s.nom}</div>
                        <div className="sub">Student</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="id-chip">#{s.id}</span></td>
                  <td>{new Date(s.dateNaissance).toLocaleDateString('fr-FR')}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="icon-btn edit-btn" onClick={() => openEditModal(s)} title="Edit">
                        <Edit size={15} />
                      </button>
                      <button className="icon-btn delete-btn" onClick={() => handleDelete(s.id)} title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card empty-state">
          <div className="empty-icon-box"><UsersIcon size={32} /></div>
          <h3>No students yet</h3>
          <p>Get started by adding your first student.</p>
          <button className="btn-primary" onClick={openCreateModal}>
            <Plus size={16} /> Add Student
          </button>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingStudent ? 'Edit Student' : 'New Student'}</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>First Name (Prénom)</label>
                <input
                  type="text"
                  value={formData.prenom}
                  onChange={e => setFormData({...formData, prenom: e.target.value})}
                  required
                  placeholder="e.g. Amine"
                />
              </div>
              <div className="form-group">
                <label>Last Name (Nom)</label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={e => setFormData({...formData, nom: e.target.value})}
                  required
                  placeholder="e.g. Benali"
                />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={formData.dateNaissance}
                  onChange={e => setFormData({...formData, dateNaissance: e.target.value})}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">
                  {editingStudent ? <><Check size={16}/> Update</> : <><Plus size={16}/> Create</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsList;
