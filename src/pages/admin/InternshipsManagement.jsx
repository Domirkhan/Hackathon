import React, { useState, useEffect } from 'react';
import axios from '../../services/api';
import '../../styles/admin/InternshipsManagement.css';

const InternshipsManagement = () => {
  const [internships, setInternships] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    direction: '',
    duration: { value: '', unit: 'weeks' },
    isPaid: false,
    description: '',
    conditions: [''],
    requirements: ['']
  });

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const response = await axios.get('/internships/employer');
      setInternships(response.data.data);
    } catch (error) {
      console.error('Ошибка при загрузке стажировок:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedInternship) {
        await axios.put(`/internships/${selectedInternship._id}`, formData);
      } else {
        await axios.post('/internships', formData);
      }
      fetchInternships();
      resetForm();
    } catch (error) {
      console.error('Ошибка при сохранении стажировки:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту стажировку?')) {
      try {
        await axios.delete(`/internships/${id}`);
        fetchInternships();
      } catch (error) {
        console.error('Ошибка при удалении стажировки:', error);
      }
    }
  };

  // Добавьте остальной код компонента по аналогии с JobsManagement
  
  return (
    <div className="internships-management">
      <h1>Управление стажировками</h1>
      
      {/* Форма и список стажировок */}
    </div>
  );
};

export default InternshipsManagement;