import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaVideoSlash, FaChevronDown } from 'react-icons/fa';

import { getMovieInfo, getMovieVideo } from '../../services/apiTmdb';

import './styles.scss';

const MovieModal = (props) => {
  const { movieId, isModalOpen, onModalClose } = props;

  const [movieData, setMovieData] = useState({});
  const [movieVideo, setMovieVideo] = useState({});

  useEffect(async () => {
    const loadMovieInfo = async () => {
      const data = await getMovieInfo(movieId);

      setMovieData(data);
    };

    const loadMovieVideo = async () => {
      const video = await getMovieVideo(movieId);

      setMovieVideo(video);
    };

    await loadMovieInfo();
    await loadMovieVideo();
  }, [movieId]);

  const {
    title,
    tagline,
    genres,
    runtime,
    overview,
    backdrop_path,
    release_date,
  } = movieData;

  const listVideo = [];
  const { results } = movieVideo;

  for (let i in results) {
    listVideo.push(results[i].key);
  }

  const movieGeners = [];

  for (let i in genres) {
    movieGeners.push(genres[i].name);
  }

  const optionsDate = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  const date = new Date(release_date);
  const releaseDate = date.toLocaleDateString('pt-br', optionsDate);

  return (
    <Modal
      className="movie-modal"
      isOpen={isModalOpen}
      onRequestClose={onModalClose}
      contentLabel="Modal Movie"
      style={{ overlay: { backgroundColor: 'transparent' } }}
    >
      <img
        src={`https://image.tmdb.org/t/p/original${backdrop_path}`}
        alt="Movie Background"
      />

      <div className="modal-container">
        <div className="movie-info">
          <div className="movie-content">
            <div className="title-container">
              <h2>{title}</h2>
              <button type="button" onClick={onModalClose}>
                <FaChevronDown />
              </button>
            </div>

            <p>{tagline}</p>

            <dl>
              <div>
                <dt className="yellow">Estréia:</dt>
                <dd>{releaseDate}</dd>
              </div>

              <div>
                <dt>Gênero:</dt>
                <dd>{movieGeners.join(', ')}</dd>
              </div>

              <div>
                <dt>Duração:</dt>
                <dd>{runtime}min</dd>
              </div>
            </dl>

            <p className="movie-overview">{overview}</p>
          </div>
        </div>
        {listVideo[0] ? (
          <iframe
            className="movie-video"
            src={`https://www.youtube.com/embed/${listVideo[0]}`}
            frameBorder={0}
            allowFullscreen="true"
          ></iframe>
        ) : (
          <div className="movie-video">
            <FaVideoSlash className="video-notfound" />
            <h3>Não encontramos nenhum video :(</h3>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default MovieModal;
