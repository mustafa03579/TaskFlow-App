/**
 * Returns a greeting and matching emoji based on the user's local time.
 * Morning:   5am  – 11:59am → "Good morning"
 * Afternoon: 12pm – 4:59pm  → "Good afternoon"
 * Evening:   5pm  – 9:59pm  → "Good evening"
 * Night:     10pm – 4:59am  → "Good night"
 */
export function getGreeting() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return { text: 'Good morning', emoji: '☀️' };
  } else if (hour >= 12 && hour < 17) {
    return { text: 'Good afternoon', emoji: '🌤️' };
  } else if (hour >= 17 && hour < 22) {
    return { text: 'Good evening', emoji: '🌇' };
  } else {
    return { text: 'Good night', emoji: '🌙' };
  }
}

/**
 * Returns the user's first name from a full name or email.
 * "mustafa.abdulrahman@email.com" → "Mustafa"
 * "John Doe" → "John"
 */
export function getFirstName(nameOrEmail = '') {
  const part = nameOrEmail.split('@')[0].split('.')[0].split(' ')[0];
  return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
}
