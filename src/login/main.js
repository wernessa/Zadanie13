import { createSupabase } from '../utils/createSupabase.js';

const supabase = createSupabase();

const loginForm = document.getElementById('LoginForm');

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);

  const email = formData.get('email');
  const password = formData.get('password');

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    alert('Nieprawidłowy email lub hasło.');
  } else {
    window.location.href = '/';
  }
});
