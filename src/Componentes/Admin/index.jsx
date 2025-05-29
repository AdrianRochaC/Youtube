import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { useNavigate } from "react-router-dom";
import "./style.css";

function Admin() {
  const [usuarios, setUsuarios] = useState([]);
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accesoPermitido, setAccesoPermitido] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    correo: "",
    password: "",
    fechaNacimiento: "",
    telefono: "",
    rol: "usuario",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const verificarAcceso = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        navigate("/");
        return;
      }

      const { data, error } = await supabase
        .from("usuario")
        .select("rol")
        .eq("id", user.id)
        .single();

      if (error || !data || data.rol !== "admin") {
        navigate("/");
        return;
      }

      setAccesoPermitido(true);
    };

    verificarAcceso();
  }, [navigate]);

  useEffect(() => {
    if (!accesoPermitido) return;

    const obtenerDatos = async () => {
      try {
        const { data: usuariosData, error: usuariosError } = await supabase
          .from("usuario")
          .select("id, nombre, correo, rol, telefono");

        const { data: fotosData, error: fotosError } = await supabase
          .from("multimedia")
          .select("id, url, usuarioid");

        if (usuariosError || fotosError) {
          console.error(usuariosError || fotosError);
          return;
        }

        const usuariosConFotos = usuariosData.map((usuario) => ({
          ...usuario,
          fotos: fotosData.filter((foto) => foto.usuarioid === usuario.id),
        }));

        setUsuarios(usuariosConFotos);
        setFotos(fotosData);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    obtenerDatos();
  }, [accesoPermitido]);

  const crearUsuario = async () => {
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: nuevoUsuario.correo,
        password: nuevoUsuario.password,
      });

      if (authError) {
        console.error("Error al crear cuenta:", authError.message);
        return;
      }

      const uid = data.user.id;

      const { error: insertError } = await supabase.from("usuario").insert([
        {
          id: uid,
          nombre: nuevoUsuario.nombre,
          correo: nuevoUsuario.correo,
          telefono: nuevoUsuario.telefono,
          fecha_nacimiento: nuevoUsuario.fechaNacimiento,
          rol: nuevoUsuario.rol,
        },
      ]);

      if (insertError) {
        console.error("Usuario creado pero error en tabla usuario:", insertError.message);
      } else {
        const nuevo = { ...nuevoUsuario, id: uid, fotos: [] };
        setUsuarios((prev) => [...prev, nuevo]);
        setNuevoUsuario({
          nombre: "",
          correo: "",
          password: "",
          fechaNacimiento: "",
          telefono: "",
          rol: "usuario",
        });
      }
    } catch (error) {
      console.error("Error al crear usuario:", error);
    }
  };

  const editarUsuario = async (id, nuevoNombre, nuevoCorreo, nuevoTelefono, nuevoRol) => {
    try {
      const { error } = await supabase
        .from("usuario")
        .update({
          nombre: nuevoNombre,
          correo: nuevoCorreo,
          telefono: nuevoTelefono,
          rol: nuevoRol,
        })
        .eq("id", id);

      if (error) {
        console.error(error);
      } else {
        setUsuarios((prev) =>
          prev.map((usuario) =>
            usuario.id === id
              ? { ...usuario, nombre: nuevoNombre, correo: nuevoCorreo, telefono: nuevoTelefono, rol: nuevoRol }
              : usuario
          )
        );
      }
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
    }
  };

  const eliminarImagen = async (imagenId) => {
    try {
      const { error } = await supabase.from("multimedia").delete().eq("id", imagenId);

      if (error) {
        console.error("Error al eliminar la imagen:", error);
      } else {
        setFotos((prevFotos) => prevFotos.filter((foto) => foto.id !== imagenId));

        setUsuarios((prevUsuarios) =>
          prevUsuarios.map((usuario) => ({
            ...usuario,
            fotos: usuario.fotos.filter((foto) => foto.id !== imagenId),
          }))
        );
      }
    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
    }
  };

  const eliminarUsuario = async (id) => {
    try {
      await supabase.from("multimedia").delete().eq("usuarioid", id);
      await supabase.from("usuario").delete().eq("id", id);
      setUsuarios((prev) => prev.filter((usuario) => usuario.id !== id));
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  const handleChange = (e, usuarioId, campo) => {
    const newValue = e.target.value;
    setUsuarios((prev) =>
      prev.map((usuario) =>
        usuario.id === usuarioId ? { ...usuario, [campo]: newValue } : usuario
      )
    );
  };

  if (!accesoPermitido) return null;
  if (loading) return <div>Cargando...</div>;

  return (
    <div className="admin-container">
      <h1>Administrador - Gestión de Usuarios y Multimedia</h1>

      <h2>Crear Nuevo Usuario</h2>
      <input
        type="text"
        placeholder="Nombre"
        value={nuevoUsuario.nombre}
        onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
      />
      <input
        type="email"
        placeholder="Correo"
        value={nuevoUsuario.correo}
        onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, correo: e.target.value })}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={nuevoUsuario.password}
        onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })}
      />
      <input
        type="date"
        placeholder="Fecha de nacimiento"
        value={nuevoUsuario.fechaNacimiento}
        onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, fechaNacimiento: e.target.value })}
      />
      <input
        type="tel"
        placeholder="Teléfono"
        value={nuevoUsuario.telefono}
        onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, telefono: e.target.value })}
      />
      <select
        value={nuevoUsuario.rol}
        onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })}
      >
        <option value="usuario">Usuario</option>
        <option value="admin">Administrador</option>
      </select>
      <button onClick={crearUsuario}>Crear Usuario</button>

      <table>
        <thead>
          <tr>
            <th>ID Usuario</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Rol</th>
            <th>Fotos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>
                <input
                  type="text"
                  value={usuario.nombre}
                  onChange={(e) => handleChange(e, usuario.id, "nombre")}
                />
              </td>
              <td>{usuario.correo}</td>
              <td>
                <input
                  type="tel"
                  value={usuario.telefono}
                  onChange={(e) => handleChange(e, usuario.id, "telefono")}
                />
              </td>
              <td>
                <select
                  value={usuario.rol}
                  onChange={(e) => handleChange(e, usuario.id, "rol")}
                >
                  <option value="usuario">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </td>
              <td>
                {usuario.fotos.map((foto) => (
                  <div key={foto.id} style={{ display: "inline-block", marginRight: "10px" }}>
                    <img
                      src={foto.url}
                      alt={`Foto de ${usuario.nombre}`}
                      style={{ width: "100px", height: "auto", marginBottom: "5px" }}
                    />
                    <button onClick={() => eliminarImagen(foto.id)}>Eliminar</button>
                  </div>
                ))}
              </td>
              <td>
                <button
                  onClick={() =>
                    editarUsuario(
                      usuario.id,
                      usuario.nombre,
                      usuario.correo,
                      usuario.telefono,
                      usuario.rol
                    )
                  }
                >
                  Guardar Cambios
                </button>
                <button
                  onClick={() => eliminarUsuario(usuario.id)}
                  style={{ marginLeft: "10px", color: "red", background: "white"}}
                >
                  Eliminar Usuario
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;
