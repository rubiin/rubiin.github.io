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
          <i className="share fa fa-facebook fb"></i>
        </a>
        <a
          className="share__link "
          href={`https://twitter.com/share?url=${link}&text=${title}`}
          title="twitter">
          <i className="share fa fa-twitter tw"></i>
        </a>
        <a
          className="share__link "
          href={`https://www.linkedin.com/shareArticle?url=${link}&title=${title}`}
          title="linkedin">
          <i className="share fa fa-linkedin sk"></i>
        </a>

        <a
          className="share__link "
          href={`mailto:?&subject=Here's a Blog Post I Think You'll Love!&cc=&bcc=&body=Check out this quick read at ${link}%0A`}
          title="email">
          <i className="share fa fa-envelope em"></i>
        </a>
      </div>
    </>
  );
};

export default ShareLink;
