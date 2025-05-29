import { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const API_KEY = 'AIzaSyADbXCvUl0tZLvYMYAwy4QwOcMKGKts06Q';

  const [likes, setLikes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('likes')) || [];
    } catch {
      return [];
    }
  });

  const [videos, setVideos] = useState([]); // Aquí guardamos los videos de YouTube
  const [busqueda, setBusqueda] = useState('trending'); // Palabra clave inicial para búsqueda
  const [tipoSeleccionado, setTipoSeleccionado] = useState('All'); // Para categorías (si lo quieres usar)

  // Buscar videos cada vez que cambia la búsqueda
  useEffect(() => {
    const obtenerVideos = async () => {
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${encodeURIComponent(busqueda)}&key=${API_KEY}`
        );
        const json = await res.json();

        // Formateamos los datos para facilitar su uso
        const videosFormateados = json.items.map((item) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.high.url,
        }));

        setVideos(videosFormateados);
      } catch (error) {
        console.error('Error al obtener videos:', error);
      }
    };

    obtenerVideos();
  }, [busqueda]);

  // Guardar los likes en localStorage cada vez que cambian
  useEffect(() => {
    localStorage.setItem('likes', JSON.stringify(likes));
  }, [likes]);

  // Función para agregar o quitar un video de los likes
  const toggleLike = (video) => {
    const isLiked = likes.some((item) => item.id === video.id);
    if (isLiked) {
      setLikes(likes.filter((item) => item.id !== video.id));
    } else {
      setLikes([...likes, video]);
    }
  };

  return (
    <AppContext.Provider
      value={{
        likes,
        toggleLike, // Esta función la usaremos en VideoDetalle y Likes
        videos,
        setBusqueda,
        tipoSeleccionado,
        setTipoSeleccionado,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}