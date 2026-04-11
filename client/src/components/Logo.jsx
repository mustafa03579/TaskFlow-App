import React from 'react';
import { Link } from 'react-router-dom';
import LogoIcon from './LogoIcon';
import styles from './Logo.module.css';

const Logo = ({ to = '/', size = 36 }) => (
  <Link to={to} className={styles.logo}>
    <LogoIcon size={size} />
    <span className={styles.logoText}>Task Flow</span>
  </Link>
);

export default Logo;
