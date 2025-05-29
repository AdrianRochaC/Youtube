import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import "./usuario.css";

export default function Usuario() {
  const [usuario, setUsuario] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    fecha_nacimiento: "",
    telefono: "",
    rol: ""
  });
  const [nuevaUrl, setNuevaUrl] = useState("");
  const [imagenes, setImagenes] = useState([]);

  useEffect(() => {
    const fetchUsuario = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("usuario")
          .select("*")
          .eq("id", user.id)
          .single();
        if (data) {
          setUsuario(data);
          setForm(data);
          fetchImagenes(user.id);
        }
      }
    };
    fetchUsuario();
  }, []);

  const fetchImagenes = async (usuarioid) => {
    const { data } = await supabase
      .from("multimedia")
      .select("*")
      .eq("usuarioid", usuarioid);
    if (data) setImagenes(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const { error } = await supabase
      .from("usuario")
      .update(form)
      .eq("id", usuario.id);
    if (error) alert("Error al actualizar");
    else alert("Datos actualizados");
  };

  const handleAgregarUrl = async () => {
    if (!nuevaUrl.trim()) return;
    const { error } = await supabase
      .from("multimedia")
      .insert([{ url: nuevaUrl, usuarioid: usuario.id }]);
    if (error) {
      alert("Error al agregar la imagen");
    } else {
      setNuevaUrl("");
      fetchImagenes(usuario.id);
    }
  };

  const handleEliminarImagen = async (id) => {
    const { error } = await supabase
      .from("multimedia")
      .delete()
      .eq("id", id);
    if (!error) {
      setImagenes(imagenes.filter((img) => img.id !== id));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    alert("Sesión cerrada");
  };

  if (!usuario) return <p>Cargando...</p>;

  return (
    <div className="usuario-container">
      <h2>Perfil de Usuario</h2>
      {["nombre", "correo", "fecha_nacimiento", "telefono", "rol"].map((campo) => (
        <label key={campo}>
          {campo.charAt(0).toUpperCase() + campo.slice(1).replace("_", " ")}:
          <input
            name={campo}
            value={form[campo]}
            onChange={handleChange}
            type={campo === "correo" ? "email" : campo === "fecha_nacimiento" ? "date" : "text"}
          />
        </label>
      ))}

      <button onClick={handleUpdate}>Guardar cambios</button>

      <hr />

      <h3>Agregar imagen por URL</h3>
      <div className="agregar-imagen">
        <input
          type="text"
          placeholder="URL de la imagen"
          value={nuevaUrl}
          onChange={(e) => setNuevaUrl(e.target.value)}
        />
        <button onClick={handleAgregarUrl}>Agregar</button>
      </div>

      <h3>Imágenes guardadas</h3>
      <div className="videos-grid">
        {imagenes.length === 0 ? (
          <p>No hay imágenes guardadas.</p>
        ) : (
          imagenes.map((img) => (
            <div key={img.id} className="video-card">
              <img src={img.url} alt="Imagen" />
              <button onClick={() => handleEliminarImagen(img.id)}>Eliminar</button>
            </div>
          ))
        )}
      </div>

      <hr />

      <button className="cerrar-sesion" onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}