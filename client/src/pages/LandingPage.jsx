import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css';
import HowItWorks from '../components/HowItWorks';
import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';

function LandingPage() {
  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>
        <Logo size={40} />
        <nav className={styles.nav}>
          <ThemeToggle />
          <Link to="/signin" className={styles.loginBtn}>Sign in</Link>
          <Link to="/signup" className={styles.getStartedBtn}>Get Started</Link>
        </nav>
      </header>

      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.heroBadge}>Your workspace awaits</div>
          <h1>A calm place for<br/><span>your daily work.</span></h1>
          <p>Task Flow brings your to-dos and job search into one quiet, organized workspace. No noise. No clutter. Just what you need to get things done.</p>
          <div className={styles.heroActions}>
            <Link to="/signup" className={styles.primaryBtn}>Start Organizing &rarr;</Link>
            <Link to="/signin" className={styles.secondaryBtn}>Sign In</Link>
          </div>
        </div>

        <div className={styles.features}>
            <div className={styles.featureCard}>
              <div className={styles.iconCircle}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <h3>Track Tasks</h3>
              <p>Keep track of what matters. Categorize by priority and check them off when done. A focused to-do list without the bloat.</p>
            </div>
            
            <div className={styles.featureCard}>
                <div className={styles.iconCircle}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                </div>
                <h3>Manage Applications</h3>
                <p>Stay on top of your job search. Log roles, companies, and interview statuses in a clean, professional pipeline.</p>
            </div>
        </div>

        <HowItWorks />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>
            Created by <span className={styles.authorBadge}>Mustafa Abdulrahman</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
