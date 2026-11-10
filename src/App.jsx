import React, { useState, useEffect, useRef } from 'react';
import './App.css';
function App() {
  // ============================================
  // 📌 ESTADOS
  // ============================================
  const [habitos, setHabitos] = useState([]);
  const [nuevoHabito, setNuevoHabito] = useState('');
  const [segundos, setSegundos] = useState(0);
  const [filtro, setFiltro] = useState('Todos');
  const [categoria, setCategoria] = useState('Personal');
  const [prioridad, setPrioridad] = useState('Media');
  const [mostrarMensaje, setMostrarMensaje] = useState('');
  // ============================================
  // 📌 REFERENCIAS
  // ============================================
  const inputRef = useRef(null);

  const contadorRef = useRef(0);
  const ultimoIdRef = useRef(null);
  // ============================================
  // 🎯 EFECTO 1: CARGAR AL INICIO
  // ============================================
  useEffect(() => {
    console.log('🚀 Cargando hábitos guardados...');
    const habitosGuardados = localStorage.getItem('habitos');
    if (habitosGuardados) {
      try {
        setHabitos(JSON.parse(habitosGuardados));
      } catch (e) {
        console.error('Error al cargar hábitos:', e);
      }
    }
    // Enfocar input al cargar
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  }, []);
  // ============================================
  // 🎯 EFECTO 2: GUARDAR AUTOMÁTICAMENTE
  // ============================================
  useEffect(() => {
    console.log('💾 Guardando hábitos...');
    localStorage.setItem('habitos', JSON.stringify(habitos));
  }, [habitos]);
  // ============================================
  // 🎯 EFECTO 3: TEMPORIZADOR
  // ============================================
  useEffect(() => {
    console.log('⏰ Iniciando temporizador...');
    const intervalo = setInterval(() => {
      setSegundos(prev => prev + 1);
    }, 1000);
    return () => {
      console.log('🧹 Limpiando temporizador...');

      clearInterval(intervalo);
    };
  }, []);
  // ============================================
  // 🎯 EFECTO 4: NOTIFICAR NUEVOS HÁBITOS
  // ============================================
  useEffect(() => {
    if (habitos.length > 0 && ultimoIdRef.current) {
      const ultimo = habitos.find(h => h.id === ultimoIdRef.current);
      if (ultimo) {
        const mensaje = `🎉 Nuevo hábito: "${ultimo.nombre}"`;
        console.log(mensaje);
        setMostrarMensaje(mensaje);
        setTimeout(() => setMostrarMensaje(''), 3000);
      }
    }
  }, [habitos]);
  // ============================================
  // 📌 FUNCIONES
  // ============================================
  // 🎯 Manejar cambio en input
  const handleInputChange = (event) => {
    setNuevoHabito(event.target.value);
  };
  // 🎯 Agregar hábito
  const agregarHabito = () => {
    if (nuevoHabito.trim() === '') {
      alert('¡Escribe un hábito primero!');
      return;
    }
    const nuevoItem = {
      id: Date.now(),
      nombre: nuevoHabito.trim(),
      completado: false,
      categoria: categoria,
      prioridad: prioridad,
      fechaCreacion: new Date().toLocaleDateString('es-ES')

    };
    contadorRef.current += 1;
    ultimoIdRef.current = nuevoItem.id;
    console.log(`📊 Hábitos agregados: ${contadorRef.current}`);
    setHabitos(prev => [...prev, nuevoItem]);
    setNuevoHabito('');
    // Enfocar input después de agregar
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  // 🎯 Marcar completado
  const toggleCompletado = (id) => {
    setHabitos(prev =>
      prev.map(habito =>
        habito.id === id ? { ...habito, completado: !habito.completado } : habito
      )
    );
  };
  // 🎯 Eliminar hábito
  const eliminarHabito = (id) => {
    if (window.confirm('¿Seguro que quieres eliminar este hábito?')) {
      setHabitos(prev => prev.filter(habito => habito.id !== id));
    }
  };
  // 🎯 Enfocar input manualmente
  const enfocarInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.style.background = '#e3f2fd';
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.style.background = 'white';
        }
      }, 2000);

    }
  };
  // 🎯 Limpiar todos los hábitos
  const limpiarTodos = () => {
    if (window.confirm('¿Seguro que quieres eliminar TODOS los hábitos?')) {
      setHabitos([]);
      localStorage.removeItem('habitos');
    }
  };
  // 🎯 Filtrar hábitos
  const habitosFiltrados = filtro === 'Todos'
    ? habitos
    : habitos.filter(h => h.categoria === filtro);
  // 🎯 Obtener emoji por prioridad
  const getEmojiPrioridad = (prioridad) => {
    switch (prioridad) {
      case 'Alta': return '🔴';
      case 'Media': return '🟡';
      case 'Baja': return '🟢';
      default: return '⚪';
    }
  };
  // 🎯 Obtener estadísticas
  const total = habitos.length;
  const completados = habitos.filter(h => h.completado).length;
  const pendientes = total - completados;
  const porcentaje = total > 0 ? Math.round((completados / total) * 100) : 0;
  // ============================================
  // 🎨 RENDERIZADO
  // ============================================
  return (
    <div className="app-container">
      <h1>📊 <span>Mis Hábitos</span></h1>
      {/* ⏰ TEMPORIZADOR */}
      <div className="timer">
        ⏰ Tiempo de práctica: <strong>{segundos}</strong> segundos

      </div>
      {/* 📨 MENSAJE DE NOTIFICACIÓN */}
      {mostrarMensaje && (
        <div className="mensaje-notificacion">
          {mostrarMensaje}
        </div>
      )}
      {/* 📝 FORMULARIO DE ENTRADA */}
      <div className="input-group">
        <input
          ref={inputRef}
          type="text"
          value={nuevoHabito}
          onChange={handleInputChange}
          placeholder="Ejemplo: Leer 30 minutos"
          className="input-habito"
          onKeyPress={(e) => e.key === 'Enter' && agregarHabito()}
        />
        <button onClick={agregarHabito} className="btn-agregar">
          ➕ Agregar
        </button>
        <button
          onClick={enfocarInput}
          className="btn-foco"
          title="Enfocar input"
        >
          🔦
        </button>
      </div>
      {/* 🏷️ FILTROS Y CATEGORÍAS */}
      <div className="filtros-group">
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="select-filtro"
        >
          <option value="Todos">📋 Todos</option>
          <option value="Personal">👤 Personal</option>
          <option value="Trabajo">💼 Trabajo</option>

          <option value="Salud">🏥 Salud</option>
          <option value="Educación">📚 Educación</option>
          <option value="Fitness">💪 Fitness</option>
          <option value="Hogar">🏠 Hogar</option>
        </select>
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="select-filtro"
        >
          <option value="Personal">👤 Personal</option>
          <option value="Trabajo">💼 Trabajo</option>
          <option value="Salud">🏥 Salud</option>
          <option value="Educación">📚 Educación</option>
          <option value="Fitness">💪 Fitness</option>
          <option value="Hogar">🏠 Hogar</option>
        </select>
        <select
          value={prioridad}
          onChange={(e) => setPrioridad(e.target.value)}
          className="select-filtro"
        >
          <option value="Alta">🔴 Alta</option>
          <option value="Media">🟡 Media</option>
          <option value="Baja">🟢 Baja</option>
        </select>
      </div>
      {/* 📊 BARRA DE PROGRESO */}
      {total > 0 && (
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${porcentaje}%` }}
            />
          </div>
          <span className="progress-text">
            {porcentaje}% completado
          </span>

        </div>
      )}
      {/* 📋 LISTA DE HÁBITOS */}
      <div className="lista-habitos">
        {habitosFiltrados.length === 0 ? (
          <div className="empty-state">
            <p>🌱 No tienes hábitos en <strong>{filtro}</strong>.</p>
            <p className="empty-sub">
              Agrega un nuevo hábito para empezar tu camino de mejora
            </p>
          </div>
        ) : (
          habitosFiltrados.map(habito => (
            <div
              key={habito.id}
              className={`habito-item ${habito.completado ? 'completado' : ''
                }`}
            >
              <div className="habito-info">
                <span
                  className={`nombre ${habito.completado ? 'completado' : ''}
`}
                  onClick={() => toggleCompletado(habito.id)}
                >
                  {habito.nombre}
                </span>
                <div className="habito-meta">
                  <span className="categoria-tag">
                    📌 {habito.categoria || 'Sin categoría'}
                  </span>
                  <span className="prioridad-tag">
                    {getEmojiPrioridad(habito.prioridad || 'Media')} {habito.
                      prioridad || 'Media'}
                  </span>
                  <span className="fecha-tag">
                    📅 {habito.fechaCreacion}
                  </span>
                </div>
              </div>
              <div className="habito-acciones">

                <button
                  onClick={() => toggleCompletado(habito.id)}
                  className={`btn ${habito.completado ? 'btn-descompletar' :
                    'btn-completar'}`}
                  title={habito.completado ? 'Desmarcar' : 'Marcar como completado'}
                >
                  {habito.completado ? '↩️' : '✅'}
                </button>
                <button
                  onClick={() => eliminarHabito(habito.id)}
                  className="btn btn-eliminar"
                  title="Eliminar hábito"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {/* 📊 CONTADOR Y ESTADÍSTICAS */}
      <div className="contador">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-number">{total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-item completado-stat">
            <span className="stat-number">{completados}</span>
            <span className="stat-label">✅ Completados</span>
          </div>
          <div className="stat-item pendiente-stat">
            <span className="stat-number">{pendientes}</span>
            <span className="stat-label">⏳ Pendientes</span>
          </div>
          <div className="stat-item porcentaje-stat">
            <span className="stat-number">{porcentaje}%</span>
            <span className="stat-label">📊 Progreso</span>
          </div>

        </div>
        <div className="contador-acciones">
          <button onClick={limpiarTodos} className="btn-limpiar">
            🧹 Limpiar todo
          </button>
        </div>
        <p className="contador-info">
          🏷️ <strong>{filtro}</strong>: {habitosFiltrados.length} hábitos
          {total > 0 && ` · ${contadorRef.current} hábitos creados en total`}
        </p>
      </div>
    </div >
  );
}
export default App;

/*
import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App

*/
