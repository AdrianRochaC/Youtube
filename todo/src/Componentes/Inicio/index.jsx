import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../Contexto/contexto';
import { useNavigate } from "react-router-dom";
import './inicio.css';
import Filtro from '../Filtro';

const API_KEY = 'AIzaSyADbXCvUl0tZLvYMYAwy4QwOcMKGKts06Q';

function Inicio() {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [videos, setVideos] = useState([]);
  const [canales, setCanales] = useState([]);
  const { tipoSeleccionado, setTipoSeleccionado } = useContext(AppContext);

  useEffect(() => {
    if (busqueda.trim().length === 0) {
      fetchVideosPopularesPorCategoria(tipoSeleccionado);
      setCanales([]); // limpiar canales al cambiar de tipo
    }
  }, [tipoSeleccionado]);

  useEffect(() => {
    if (busqueda.trim().length >= 3) {
      fetchVideosBusqueda(busqueda);
    } else if (busqueda.trim().length === 0) {
      fetchVideosPopularesPorCategoria(tipoSeleccionado);
      setCanales([]);
    }
  }, [busqueda]);

  const fetchVideosPopularesPorCategoria = async (categoryId) => {
    try {
      const url = categoryId === '0'
        ? `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=12&key=${API_KEY}`
        : `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&videoCategoryId=${categoryId}&maxResults=12&key=${API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();
      setVideos(data.items);
    } catch (error) {
      console.error('Error fetching videos populares:', error);
    }
  };

  const fetchVideosBusqueda = async (query) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video,channel&maxResults=12&q=${encodeURIComponent(query)}&key=${API_KEY}`
      );
      const data = await response.json();

      const nuevosVideos = data.items.filter(item => item.id.kind === 'youtube#video');
      const nuevosCanales = data.items.filter(item => item.id.kind === 'youtube#channel');

      setVideos(nuevosVideos);
      setCanales(nuevosCanales);
    } catch (error) {
      console.error('Error fetching videos búsqueda:', error);
    }
  };

  const handleTipoChange = (categoryId) => {
    setTipoSeleccionado(categoryId);
    setBusqueda('');
    setCanales([]);
  };

  const handleIrUsuarios = () => {
    navigate("/usuarios");
  };

  return (
    <div className="inicio-container">
      <header className="inicio-header">
        <h1>YouTube</h1><br></br><br></br>
        <input
          type="text"
          placeholder="Buscar videos en YouTube"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="inicio-buscador"
        />

      </header>


      <main className="inicio-main main-content">
        <Filtro tipoSeleccionado={tipoSeleccionado} onTipoChange={handleTipoChange} />

        {/* Canales y videos siguen igual */}
        {canales.length > 0 && (
          <section className="inicio-canales">
            <h2>Canales encontrados</h2>
            <div className="inicio-canales-lista">
              {canales.map((canal) => (
                <div
                  className="inicio-canal-card"
                  key={canal.id.channelId}
                  onClick={() => navigate(`/canal/${canal.id.channelId}`)}
                >
                  <img
                    className="inicio-canal-imagen"
                    src={canal.snippet.thumbnails.medium.url}
                    alt={canal.snippet.channelTitle}
                    loading="lazy"
                  />
                  <p>{canal.snippet.channelTitle}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className='inicio-lista'>
          {videos && videos.length > 0 ? (
            videos.map((video) => {
              const videoId = video.id.videoId || video.id;
              return (
                <div
                  className='inicio-lista-video'
                  onClick={() => navigate(`/video/${videoId}`)}
                  key={videoId}
                >
                  <img
                    src={video.snippet.thumbnails.medium.url}
                    alt={video.snippet.title}
                    loading='lazy'
                  />
                  <p>{video.snippet.title}</p>
                </div>
              );
            })
          ) : (
            <p>No hay videos para mostrar</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default Inicio;