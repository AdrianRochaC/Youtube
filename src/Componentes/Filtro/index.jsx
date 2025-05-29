import './filtro.css';

function Filtro({ tipoSeleccionado, onTipoChange }) {
  const tipos = [
    { id: "0", label: "Todos" },
    { id: "1", label: "Musica" },
    { id: "2", label: "Deportes" },
    { id: "10", label: "Videos Musicales" },
    { id: "15", label: "Mascotas y Animales" },
    { id: "17", label: "Deportes" },
  ];

  return (
    <div className="c-filtro-container">
      {tipos.map(({ id, label }) => (
        <button
          key={id}
          className={`c-filtro-boton ${tipoSeleccionado === id ? 'activo' : ''}`}
          onClick={() => onTipoChange(id)}
          type="button"
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default Filtro;
