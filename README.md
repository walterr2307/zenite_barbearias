# Zenite Barbearias ✂️💈

O **Zenite Barbearias** é um projeto que visa se tornar uma **rede social dedicada a conectar barbeiros e cabeleireiros de todo o Brasil**.  
A proposta é criar um ambiente digital onde profissionais da área possam compartilhar experiências, divulgar seus trabalhos, fortalecer conexões profissionais e se aproximar de clientes.

---

## 📌 Objetivo do Projeto

Promover a integração entre profissionais da barbearia e estética capilar, oferecendo uma plataforma colaborativa, moderna e acessível, focada no crescimento profissional e na visibilidade dos serviços prestados.

---

## 🚀 Tecnologias Utilizadas

### 🔧 Backend
- **C#**
- **.NET Core**

### 🎨 Frontend
- **HTML**
- **CSS**
- **JavaScript**


## 📂 Estrutura do Projeto

📌 **Status do Projeto**

🚧 Em desenvolvimento
> ⚠️ *O projeto encontra-se em estágio inicial, utilizando apenas tecnologias básicas para estruturação.*

---

## Integração Backend (.NET Core)

Endpoints esperados (exemplos simples):

- POST /api/login
  - Payload: { "username": "...", "password": "..." }
  - Retorno: 200 OK (opcionalmente JSON com token) ou 401 Unauthorized

- POST /api/register
  - Payload (cliente):
    { "userType":"cliente", "fullName":"", "email":"", "phone":"", "username":"", "password":"" }
  - Payload (profissional):
    { "userType":"profissional", "fullName":"", "email":"", "phone":"", "username":"", "password":"", "barbershopName":"", "barbershopLocation":"", "cnpj":"" }
  - Retorno: 201 Created ou 400 Bad Request (com mensagens)

- POST /api/forgot-password
  - Payload: { "email": "usuario@ex.com" }
  - Retorno: 200 OK (mesmo se e-mail não existir, por segurança) ou 400/500

Observações importantes:
- Habilite CORS no backend para permitir requisições do frontend local (por exemplo http://localhost:5500).
  No .NET Core: services.AddCors(...); app.UseCors(...);
- Valide senhas e e-mails no backend também (o frontend só faz validações básicas).
- Retorne mensagens JSON úteis no erro para facilitar debug: { "message":"Erro X" }.

