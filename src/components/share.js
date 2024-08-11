import React from 'react';

const ShareLink = ({ location, title }) => {
  const link = location.href;
  return (
    <>
      <div className="social">
        <a
          className="share__link "
          target="_blank"
          href={`https://www.facebook.com/sharer.php?u=${link}`}
          title="facebook">
          <i className="fa fa-facebook fb"></i>
        </a>
        <a
          className="share__link "
          href={`https://twitter.com/share?url=${link}&text=${title}`}
          title="twitter">
          <i className="fa fa-twitter tw"></i>
        </a>
        <a
          className="share__link "
          href={`https://www.linkedin.com/shareArticle?url=${link}&title=${title}`}
          title="linkedin">
          <i className="fa fa-linkedin sk"></i>
        </a>
      </div>
    </>
  );
};

export default ShareLink;
