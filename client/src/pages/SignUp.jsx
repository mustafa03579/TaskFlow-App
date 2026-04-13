import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';
import Logo from '../components/Logo';
import { registerUser } from '../utils/auth';
import ThemeToggle from '../components/ThemeToggle';

function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const result = await registerUser(email, password);
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
          <Link to="/signin" className={styles.navText}>Sign In</Link>
          <Link to="/" className={styles.getStartedBtn}>Get Started</Link>
        </nav>
      </header>

      <main className={styles.main}>
        <form className={styles.authCard} onSubmit={handleSignUp}>
          <h2 className={styles.title}>Create your account</h2>
          <p className={styles.subtitle}>Welcome! Please fill in the details to get started.</p>

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
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Create a password (min. 6 characters)"
                className={styles.input}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
              />
              <svg
                className={styles.eyeIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </>
                ) : (
                  <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </>
                )}
              </svg>
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Creating account…' : 'Continue'}
          </button>

          <div className={styles.footer}>
            <span>Already have an account? <Link to="/signin">Sign in</Link></span>
          </div>
        </form>
      </main>
    </div>
  );
}

export default SignUp;
