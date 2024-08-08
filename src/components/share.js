import React from 'react';
import './share.css';

const Share = ({ location, title }) => {
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
          href={`https://twitter.com/share?url=${link}&text=[post-title]`}
          title="twitter">
          <i className="fa fa-twitter tw"></i>
        </a>
        <a
          className="share__link "
          href={`https://www.linkedin.com/shareArticle?url=${link}&title=[post-title]`}
          title="linkedin">
          <i className="fa fa-linkedin sk"></i>
        </a>
      </div>
    </>
  );
};

export default Share;

// linkedin https://www.linkedin.com/shareArticle?url=[post-url]&title=[post-title]
// twitter https://twitter.com/share?url=[post-url]&text=[post-title]
// https://twitter.com/intent/tweet/?text=${post.frontmatter.title
