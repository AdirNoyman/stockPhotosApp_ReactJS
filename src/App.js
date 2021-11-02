import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaRegHourglass } from 'react-icons/fa';
import Photo from './Photo';

const clientID = process.env.REACT_APP_ACCESS_KEY;
const mainUrl = `https://api.unsplash.com/photos/?client_id=`;
const searchUrl = `https://api.unsplash.com/search/photos/?client_id=`;

function App() {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [getNewImages, setGetNewImages] = useState(false);
  const mounted = useRef(false);
  const fetchImages = async (req, res) => {
    setLoading(true);
    let url;
    const urlPage = `&page=${page}`;
    const urlQuery = `&query=${searchTerm}`;

    if (searchTerm) {
      url = `${searchUrl}${clientID}${urlPage}${urlQuery}`;
    } else {
      url = `${mainUrl}${clientID}${urlPage}`;
    }

    console.log(url);

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      setPhotos((oldPhotos) => {
        // If there searchterm was typed in, clear the old results and present only the photos that came back from the query

        if (searchTerm && page === 1) {
          return data.results;
        }

        if (searchTerm) {
          console.log(data.results);
          return [...oldPhotos, ...data.results];
        } else {
          return [...oldPhotos, ...data];
        }
      });
      setGetNewImages(false);
      setLoading(false);
    } catch (err) {
      setGetNewImages(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [page]);

  // This useEffect is for adding the scroll event but only after the first useEffect ran the first time and initial page was rendered
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (!getNewImages) return;
    if (loading) return;
    setPage((currentPageNum) => currentPageNum + 1);
  }, [getNewImages]);

  // Scroll event trigers getting new images
  const event = () => {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
      console.log(
        `window height is ${window.innerHeight} and window scrollY is ${window.scrollY} and the document.body.scrollHeight is ${document.body.scrollHeight}`
      );

      setGetNewImages(true);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', event);
    return () => window.removeEventListener('scroll', event);
  }, []);

  const handelSubmit = (e) => {
    e.preventDefault();
    // If there is nothing in the search field, don't change page number (so that way it will not triger a new fetch images at useEffect)
    if (!searchTerm) return;
    // TODO - complete the submit action
    if (page === 1) {
      fetchImages();
      return;
    }
    setPage(1);
  };

  return (
    <main>
      <section className='search'>
        <form className='search-form'>
          <input
            type='text'
            placeholder='search'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='form-input'
          />
          <button type='submit' className='submit-btn' onClick={handelSubmit}>
            <FaSearch />
          </button>
        </form>
      </section>
      <section className='photos'>
        <div className='photos-center'>
          {photos.map((image, index) => {
            return <Photo key={image.id} {...image} />;
          })}
        </div>
        {loading && (
          <h2 className='loading'>
            <FaRegHourglass /> Loading...
          </h2>
        )}
      </section>
    </main>
  );
}

export default App;
