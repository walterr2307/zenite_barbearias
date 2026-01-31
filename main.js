const API_BASE = 'http://localhost:8080/api';

// helpers
const getEl = id => document.getElementById(id);
const postJson = async (path, data) => fetch(`${API_BASE}${path}`, {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify(data)
});
const showOnly = (...idsVisible) => {
	['loginSection','registerSection','forgotPasswordSection'].forEach(id => {
		const el = getEl(id); if (!el) return;
		el.style.display = idsVisible.includes(id) ? 'block' : 'none';
	});
};

// coleta valores seguros por name
const value = (form, name) => (form && form[name]) ? form[name].value.trim() : '';

// inicializa tudo quando DOM pronto
document.addEventListener('DOMContentLoaded', () => {
	// elementos principais
	const loginForm = getEl('loginForm');
	const registerForm = getEl('registerForm');
	const forgotForm = getEl('forgotPasswordForm');
	const loginBox = getEl('loginBox');

	// login
	if (loginForm) loginForm.addEventListener('submit', async e => {
		e.preventDefault();
		const username = value(loginForm,'username'), password = value(loginForm,'password');
		if (!username || !password) return alert('Preencha usuário e senha.');
		try {
			const res = await postJson('/login', { username, password });
			if (res.ok) { alert('Login realizado com sucesso!'); /* salvar token / redirecionar */ }
			else if (res.status === 401) alert('Usuário ou senha inválidos.');
			else alert('Erro ao realizar login. Código: ' + res.status);
		} catch (err) { console.error(err); alert('Erro ao conectar com o servidor.'); }
	});

	// mostrar seção cadastro
	const openRegister = getEl('openRegister');
	if (openRegister) openRegister.addEventListener('click', e => {
		e.preventDefault(); showOnly('registerSection');
		if (loginBox) loginBox.classList.add('horizontal-cadastro');
	});

	// voltar ao login do cadastro
	const backToLogin = getEl('backToLogin');
	if (backToLogin) backToLogin.addEventListener('click', e => {
		e.preventDefault(); showOnly('loginSection');
		if (loginBox) loginBox.classList.remove('horizontal-cadastro');
	});

	// toggle "esqueceu a senha"
	const forgotLink = getEl('forgotPasswordLink');
	const backFromForgot = getEl('backToLoginFromForgot');
	if (forgotLink) forgotLink.addEventListener('click', e => { e.preventDefault(); showOnly('forgotPasswordSection'); if (loginBox) loginBox.classList.remove('horizontal-cadastro'); });
	if (backFromForgot) backFromForgot.addEventListener('click', e => { e.preventDefault(); showOnly('loginSection'); });

	// toggle campos profissional
	const radios = document.querySelectorAll('input[name="userType"]');
	const profFields = getEl('professionalFields');
	if (radios && profFields) radios.forEach(r => r.addEventListener('change', () => {
		profFields.style.display = (r.value === 'profissional') ? 'block' : 'none';
	}));

	// cadastro
	if (registerForm) registerForm.addEventListener('submit', async e => {
		e.preventDefault();
		const userType = registerForm.userType ? registerForm.userType.value : 'cliente';
		const password = value(registerForm,'password'), confirm = value(registerForm,'confirmPassword');
		if (password !== confirm) return alert('As senhas não coincidem.');
		const data = {
			userType,
			fullName: value(registerForm,'fullName'),
			email: value(registerForm,'email'),
			phone: value(registerForm,'phone'),
			username: value(registerForm,'username'),
			password
		};
		if (userType === 'profissional') {
			data.barbershopName = value(registerForm,'barbershopName');
			data.barbershopLocation = value(registerForm,'barbershopLocation');
			data.cnpj = value(registerForm,'cnpj');
		}
		try {
			const res = await postJson('/register', data);
			if (res.ok) { alert('Cadastro realizado com sucesso!'); registerForm.reset(); showOnly('loginSection'); if (loginBox) loginBox.classList.remove('horizontal-cadastro'); }
			else { let msg = 'Erro ao cadastrar. Código: '+res.status; try { const j = await res.json(); if (j && j.message) msg = j.message; } catch{} alert(msg); }
		} catch (err) { console.error(err); alert('Erro ao conectar com o servidor.'); }
	});

	// recuperar senha
	if (forgotForm) forgotForm.addEventListener('submit', async e => {
		e.preventDefault();
		const email = value(forgotForm,'recoveryEmail');
		if (!email) return alert('Informe o e-mail.');
		try {
			const res = await postJson('/forgot-password', { email });
			if (res.ok) { alert('Se o e-mail estiver cadastrado, enviamos instruções.'); forgotForm.reset(); showOnly('loginSection'); }
			else alert('Erro ao solicitar recuperação. Código: ' + res.status);
		} catch (err) { console.error(err); alert('Erro ao conectar com o servidor.'); }
	});
});
