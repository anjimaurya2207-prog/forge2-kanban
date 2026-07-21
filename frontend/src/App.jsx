import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [tag, setTag] = useState('');

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    try {
      await axios.post('http://127.0.0.1:8000/api/tasks', {
        title: inputVal,
        status: 'todo',
        due_date: dueDate || null,
        tag: tag || null,
      });
      setInputVal('');
      setDueDate('');
      setTag('');
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const moveCard = async (task, newStatus) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/tasks/${task.id}`, {
        status: newStatus,
      });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const deleteCard = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const isOverdue = (dateStr) => {
    if (!dateStr) return false;
    const today = new Date().toISOString().split('T')[0];
    return dateStr < today;
  };

  const columns = [
    { id: 'todo', title: 'To Do', statusKey: 'todo' },
    { id: 'inprogress', title: 'In Progress', statusKey: 'in-progress' },
    { id: 'done', title: 'Done', statusKey: 'done' },
  ];

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f6f8', minHeight: '100vh', boxSizing: 'border-box' }}>

      {/* Clean & Stacked Header Section to Avoid Messy Overlap */}
      <div style={{ marginBottom: '25px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h1 style={{ color: '#172b4d', margin: '0', fontSize: '26px', fontWeight: 'bold' }}>Forge2 Kanban Board</h1>
        <p style={{ color: '#5e6c84', margin: '0', fontSize: '14px' }}>Manage your tasks efficiently with tags and due dates</p>
      </div>

      <form onSubmit={addTask} style={{ marginBottom: '25px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Enter new task..."
          style={{ padding: '10px', width: '220px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input
          type="text"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="Tag (e.g. Bug, Feature)"
          style={{ padding: '10px', width: '150px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '10px 20px', background: '#0079bf', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Add Task
        </button>
      </form>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {columns.map((col, colIdx) => {
          const colTasks = tasks.filter(t => t.status === col.statusKey);
          return (
            <div key={col.id} style={{ background: '#ebecf0', borderRadius: '8px', width: '300px', padding: '15px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#172b4d' }}>{col.title}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {colTasks.map((task) => {
                  const overdue = isOverdue(task.due_date) && task.status !== 'done';
                  return (
                    <div key={task.id} style={{ background: overdue ? '#ffebee' : '#fff', borderLeft: overdue ? '4px solid #c62828' : 'none', padding: '10px 12px', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', color: '#172b4d', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ fontWeight: 'bold', wordBreak: 'break-word', maxWidth: '180px' }}>{task.title}</span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {colIdx > 0 && (
                            <button onClick={() => moveCard(task, columns[colIdx - 1].statusKey)} style={{ background: '#dfe1e6', border: 'none', borderRadius: '3px', cursor: 'pointer', padding: '2px 5px', fontSize: '11px' }}>◀</button>
                          )}
                          {colIdx < columns.length - 1 && (
                            <button onClick={() => moveCard(task, columns[colIdx + 1].statusKey)} style={{ background: '#dfe1e6', border: 'none', borderRadius: '3px', cursor: 'pointer', padding: '2px 5px', fontSize: '11px' }}>▶</button>
                          )}
                          <button onClick={() => deleteCard(task.id)} style={{ background: '#ffebee', color: '#c62828', border: 'none', borderRadius: '3px', cursor: 'pointer', padding: '2px 5px', fontSize: '11px' }}>✕</button>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#5e6c84', flexWrap: 'wrap' }}>
                        {task.tag && <span style={{ background: '#dfe1e6', padding: '2px 6px', borderRadius: '4px' }}>{task.tag}</span>}
                        {task.due_date && <span style={{ color: overdue ? '#c62828' : '#5e6c84', fontWeight: overdue ? 'bold' : 'normal' }}>Due: {task.due_date} {overdue && '(Overdue!)'}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;