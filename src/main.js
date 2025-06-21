import { createSupabase } from './utils/createSupabase.js';

const supabase = createSupabase();

const { data } = await supabase.auth.getSession();
const currentUser = data.session?.user;

const addArticleButton = document.getElementById('AddArticleButton');
const logoutButton = document.getElementById('LogoutButton');

const closeModal = () => {
  document.getElementById('ModalContainer').innerHTML = '';
};

const deleteArticle = async (article) => {
  const { error } = await supabase.from('articles').delete().eq('id', article.id);

  if (error) {
    return alert('Błąd podczas usuwania artykułu');
  }

  await renderArticleList();
};

const editArticle = async (article) => {
  showArticleModal({
    article,
    mode: 'edit',
    onSubmit: async (formData) => {
      const { error } = await supabase.from('articles')
          .update({
            content: formData.get('content'),
            subtitle: formData.get('subtitle'),
            title: formData.get('title'),
            modified_at: new Date().toISOString(),
          })
          .eq('id', article.id);

      if (error) {
        return alert('Błąd podczas edycji artykułu');
      }

      closeModal();
      await renderArticleList();
    },
  });
};

const renderArticle = (article) => {
  const isAuthor = currentUser && currentUser.email === article.author;

  const card = document.createElement('article');

  card.classList.add('bg-white', 'rounded', 'shadow', 'p-4', 'flex', 'flex-col', 'gap-2');
  card.innerHTML = `
    <header>
      <h2 class="text-xl font-bold">${article.title}</h2>
      ${article.subtitle ? `<h3 class="text-md text-gray-500">${article.subtitle}</h3>` : ''}
      <div class="text-xs text-gray-400 mt-1">${article.author} • ${new Date(article.created_at).toLocaleString()}</div>
    </header>
    
    <div>${article.content}</div>
    
    <footer class="flex gap-2 mt-2 ${isAuthor ? '' : 'hidden'}">
      <button class="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 " id="EditButton-${article.id}">Edytuj</button>
      <button class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 " id="DeleteButton-${article.id}" >Usuń</button>
    </footer>
  `;

  return card;
};

const renderArticleList = async () => {
  const { data, error } = await supabase
      .from('articles')
      .select('author, content, created_at, id, subtitle, title')
      .order('created_at', { ascending: false });

  console.log(data);

  if (error) {
    return alert('Błąd podczas pobierania artykułów');
  }

  const articlesList = document.getElementById('ArticleList');
  articlesList.innerHTML = '';

  for (const article of data) {
    articlesList.appendChild(renderArticle(article));
    document.getElementById(`EditButton-${article.id}`).onclick = () => editArticle(article);
    document.getElementById(`DeleteButton-${article.id}`).onclick = () => deleteArticle(article);
  }
};

const showArticleModal = ({ mode, article = {}, onSubmit }) => {
  const modalContainer = document.getElementById('ModalContainer');

  modalContainer.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative animate-fade-in">
        <h2 class="text-xl font-bold mb-4">${mode === 'add' ? 'Dodaj artykuł' : 'Edytuj artykuł'}</h2>
        
        <form id="ArticleForm" class="flex flex-col gap-4">
          <input
            class="border rounded px-3 py-2 focus:outline-none focus:ring"
            name="title"
            placeholder="Tytuł"
            required
            type="text"
            value="${article.title || ''}"
          />
          
          <input
            class="border rounded px-3 py-2 focus:outline-none focus:ring"
            name="subtitle"
            placeholder="Podtytuł"
            type="text"
            value="${article.subtitle || ''}"
          />
          
          <textarea
            class="border rounded px-3 py-2 focus:outline-none focus:ring min-h-[120px]"
            name="content"
            placeholder="Treść"
            required
          >${article.content || ''}</textarea>
          
          <div class="flex justify-end gap-2">
            <button class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition" id="CancelButton"  type="button">
              Anuluj
            </button>
            
            <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition" type="submit">
              ${mode === 'add' ? 'Dodaj' : 'Zapisz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.getElementById('CancelButton').onclick = closeModal;
  document.getElementById('ArticleForm').onsubmit = async (event) => {
    event.preventDefault();
    await onSubmit(new FormData(event.target));
  };
};

const toggleAuthorisedUI = (showUI) => {
  if (showUI) {
    addArticleButton.classList.remove('hidden');
    logoutButton.classList.remove('hidden');
  } else {
    addArticleButton.classList.add('hidden');
    logoutButton.classList.add('hidden');
  }
};

addArticleButton.addEventListener('click', () => {
  showArticleModal({
    mode: 'add',
    onSubmit: async (formData) => {
      const { error } = await supabase.from('articles').insert({
        author: currentUser.email,
        content: formData.get('content'),
        subtitle: formData.get('subtitle'),
        title: formData.get('title'),
      });

      if (error) {
        alert('Błąd podczas dodawania artykułu');
      }

      closeModal();
      await renderArticleList();
    },
  });
});

logoutButton.addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.reload();
});

toggleAuthorisedUI(!!currentUser);
await renderArticleList();