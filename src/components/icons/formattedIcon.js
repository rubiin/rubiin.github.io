import React from 'react';
import PropTypes from 'prop-types';
import {
  IconGitHub,
  IconLinkedin,
  IconDev,
  IconDiscord,
  IconTwitter,
  IconRss,
} from '@components/icons';

const FormattedIcon = ({ name }) => {
  switch (name) {
    case 'GitHub':
      return <IconGitHub />;
    case 'Linkedin':
      return <IconLinkedin />;
    case 'Dev.to':
      return <IconDev />;
    case 'Discord':
      return <IconDiscord />;
    case 'Twitter':
      return <IconTwitter />;
    case 'Rss':
      return <IconRss />;
    default:
      return <IconGitHub />;
  }
};

FormattedIcon.propTypes = {
  name: PropTypes.string.isRequired,
};

export default FormattedIcon;
