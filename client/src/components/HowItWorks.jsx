import React from 'react';
import styles from './HowItWorks.module.css';

function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: 'Sign Up',
      description: 'Create your free workspace in seconds.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
      )
    },
    {
      number: 2,
      title: 'Add Items',
      description: 'Log your tasks or job applications.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      )
    },
    {
      number: 3,
      title: 'Focus',
      description: 'Work through your list with clarity.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      )
    }
  ];

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>How it works</h2>
      <p className={styles.subheading}>Three steps to a clearer mind.</p>
      
      <div className={styles.stepsContainer}>
        {steps.map((step) => (
          <div key={step.number} className={styles.step}>
            <div className={styles.iconWrapper}>
              <div className={styles.badge}>{step.number}</div>
              <div className={styles.iconCircle}>
                {step.icon}
              </div>
            </div>
            <h3 className={styles.title}>{step.title}</h3>
            <p className={styles.description}>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;
