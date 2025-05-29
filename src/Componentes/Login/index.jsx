import { useState } from 'react';
import { supabase } from '../../supabase';
import { useNavigate } from "react-router-dom";
import './login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const { data: sessionData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInError) {
      alert('Usuario o contraseña no válidos');
      return;
    }

    const userId = sessionData.user.id;

    // Consulta ahora a la tabla correcta: "usuario"
    const { data: userProfile, error: profileError } = await supabase
      .from('usuario')
      .select('rol')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error(profileError);
      alert('Error al obtener el perfil del usuario');
      return;
    }

    if (userProfile.rol === 'admin') {
      navigate('/Admin');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Inicia sesión</h2>
        <br />
        <form className="login-form" onSubmit={handleLogin}>
          <input
            className="login-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="login-input"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="login-button" type="submit">Iniciar sesión</button>
        </form><br />
        <p className="login-text">¿No tienes cuenta?</p>
        <button className="register-button" onClick={() => navigate('/registro')}>
          Regístrate
        </button>
      </div>
    </div>
  );
}

export default Login;
