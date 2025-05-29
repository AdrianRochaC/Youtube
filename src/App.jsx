import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AppProvider } from './Componentes/Contexto/contexto';
import { supabase } from "./supabase";

import Menu from './Componentes/Menu';
import Usuarios from './Componentes/Usuarios';
import Login from './Componentes/Login';
import Registro from './Componentes/Registro';
import Inicio from './Componentes/Inicio';
import Admin from './Componentes/Admin';
import Likes from './Componentes/Likes';
import VideoDetalle from './Componentes/Videos';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const verificarSesion = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUsuario(session?.user || null);
      setCargando(false);
    };

    verificarSesion();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(session?.user || null);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  if (cargando) return <p>Cargando...</p>;

  return (
    <AppProvider>
      <Router>
        {usuario && <Menu />}
        <Routes>
          <Route path="/" element={usuario ? <Inicio /> : <Navigate to="/login" />} />
          <Route path="/usuarios" element={usuario ? <Usuarios /> : <Navigate to="/login" />} />
          <Route path="/video/:id" element={<VideoDetalle />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/admin" element={usuario ? <Admin /> : <Navigate to="/login" />} />
          <Route path="/likes" element={usuario ? <Likes /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/inicio" element={<Inicio />} />
        </Routes>

      </Router>
    </AppProvider>
  );
}

export default App;