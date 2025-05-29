import { useContext } from 'react';
import { AppContext } from '../Contexto/contexto';
import { Link } from 'react-router-dom'; // 👈 Importar Link
import './likes.css';

export default function Likes() {
  const { likes } = useContext(AppContext);

  return (
    <div className="likes-container">
      <h2>Videos que te gustaron</h2>
      {likes.length === 0 ? (
        <p>No has dado like a ningún video aún.</p>
      ) : (
        <div className="likes-grid">
          {likes.map((video) => (
            <Link to={`/video/${video.id}`} key={video.id} className="like-card-link">
              <div className="like-card">
                <img src={video.thumbnail} alt={video.title} />
                <h4>{video.title}</h4>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
