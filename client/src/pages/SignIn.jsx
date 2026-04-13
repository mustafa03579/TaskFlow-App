import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';
import Logo from '../components/Logo';
import { loginUser } from '../utils/auth';
import ThemeToggle from '../components/ThemeToggle';

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await loginUser(email, password);
    setLoading(false);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className={styles.authContainer}>
      <header className={styles.header}>
        <Logo size={38} />
        <nav className={styles.nav}>
          <ThemeToggle />
          <span className={styles.navText}>Sign in</span>
          <Link to="/" className={styles.getStartedBtn}>Get Started</Link>
        </nav>
      </header>

      <main className={styles.main}>
        <form className={styles.authCard} onSubmit={handleSignIn}>
          <h2 className={styles.title}>Sign in to Task Flow</h2>
          <p className={styles.subtitle}>Welcome back! Please sign in to continue</p>

          {error && <div className={styles.errorBanner}>{error}</div>}

          <div className={styles.formGroup}>
            <label>Email address</label>
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className={styles.input}
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              required
              placeholder="Enter your password"
              className={styles.input}
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Signing in…' : 'Continue'}
          </button>

          <div className={styles.footer}>
            <span>Don't have an account? <Link to="/signup">Sign up</Link></span>
          </div>
        </form>
      </main>
    </div>
  );
}

export default SignIn;
