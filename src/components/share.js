import React from 'react';
import './share.css';

const Share = ({ location, title }) => {
  const link = location.href;

  return (
    <div class="wrap">
      <div class="social">
        <i class="icon-facebook fb"></i>
        <i class="icon-twitter tw"></i>
        <i class="icon-linkedin sk"></i>
      </div>
    </div>
  );
};

export default Share;

// linkedin https://www.linkedin.com/shareArticle?url=[post-url]&title=[post-title]
// twitter https://twitter.com/share?url=[post-url]&text=[post-title]
// https://twitter.com/intent/tweet/?text=${post.frontmatter.title
