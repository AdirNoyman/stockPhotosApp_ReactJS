import React from 'react';

const Photo = ({
  urls: { regular },
  description,
  likes,
  user: {
    name,
    portfolio_url,
    profile_image: { medium },
  },
}) => {
  return (
    <article className='photo'>
      <img src={regular} alt={description} />
      <div className='photo-info'>
        <div className=''>
          <h4>{name}</h4>
          <p>{likes} Likes</p>
        </div>
        <a href={portfolio_url}>
          <img src={medium} alt={`picture of ${name}`} className='user-img' />
        </a>
      </div>
    </article>
  );
};

export default Photo;
