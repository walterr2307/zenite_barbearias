const API_BASE = 'http://localhost:8080/api';

// Helpers
const getEl = id => document.getElementById(id);
const getJson = async (path) => {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) throw new Error(`Erro na API: ${res.status}`);
    return res.json();
};

// Elementos principais
const sidebar = getEl('sidebar');
const sidebarOverlay = getEl('sidebarOverlay');
const mainContent = document.querySelector('.main-content');
const sidebarClose = getEl('sidebarClose');
const searchInput = getEl('searchInput');
const searchBtn = getEl('searchBtn');
const loading = getEl('loading');
const results = getEl('results');

// Função para expandir/colapsar sidebar
const toggleSidebar = (expand) => {
    if (expand) {
        sidebar.classList.remove('collapsed');
        sidebar.classList.add('expanded');
        mainContent.classList.add('sidebar-expanded');
        if (window.innerWidth < 768) sidebarOverlay.style.display = 'block'; // Só overlay em mobile
    } else {
        sidebar.classList.remove('expanded');
        sidebar.classList.add('collapsed');
        mainContent.classList.remove('sidebar-expanded');
        sidebarOverlay.style.display = 'none';
    }
};

// Expandir sidebar ao clicar em qualquer item do menu
document.querySelectorAll('.sidebar-menu li').forEach(item => {
    item.addEventListener('click', () => {
        const isCollapsed = sidebar.classList.contains('collapsed');
        if (isCollapsed) {
            // Se estiver colapsada, só expande (não navega ainda)
            toggleSidebar(true);
        } else {
            // Se já expandida, navega
            const page = item.getAttribute('data-page');
            if (page === 'home') {
                // Já na home – não faz nada (ou window.location.reload() se quiser recarregar)
            } else if (page === 'agendamentos') {
                window.location.href = 'agendamentos.html';
            } else if (page === 'perfil') {
                window.location.href = 'perfil.html';
            } else if (page === 'ajuda') {
                window.location.href = 'ajuda.html';
            }
        }
    });
});

// Fechar/colapsar sidebar com botão X
sidebarClose.addEventListener('click', () => toggleSidebar(false));

// Overlay para fechar (mobile)
sidebarOverlay.addEventListener('click', () => toggleSidebar(false));

// Busca por barbearias
const searchBarbershops = async (query) => {
    loading.style.display = 'block';
    results.innerHTML = '';

    try {
        const data = await getJson(`/barbershops?query=${encodeURIComponent(query)}`);
        loading.style.display = 'none';

        if (data && data.length > 0) {
            displayResults(data);
        } else {
            results.innerHTML = '<p style="color: #ccc; text-align: center;">Nenhuma barbearia encontrada para essa busca.</p>';
        }
    } catch (err) {
        console.error(err);
        loading.style.display = 'none';
        results.innerHTML = '<p style="color: #e53935; text-align: center;">Erro ao buscar barbearias. Tente novamente.</p>';
    }
};

// Exibir resultados
const displayResults = (data) => {
    data.forEach(shop => {
        const card = document.createElement('div');
        card.className = 'barbershop-card';
        card.innerHTML = `
            <h3>${shop.name}</h3>
            <p>Endereço: ${shop.address}</p>
            <p>Telefone: ${shop.phone || 'Não informado'}</p>
            <p>Avaliação: ${shop.rating || 'N/A'}</p>
        `;
        results.appendChild(card);
    });
};

// Busca manual
searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (!query) {
        alert('Digite um CEP ou endereço.');
        return;
    }
    searchBarbershops(query);
});
searchInput.addEvent