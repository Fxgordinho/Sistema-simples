# Sistema de Pedidos - Loja de Bolos

Este sistema foi desenvolvido para facilitar a comunicação entre a atendente e a cozinha em uma loja de bolos. Ele permite que a atendente registre os pedidos em um formulário digital, eliminando a necessidade de se deslocar até a cozinha para anotar os pedidos manualmente.

## Funcionalidades

### Para a Atendente:
- Formulário para registro de pedidos com os seguintes campos:
  - Nome do cliente
  - Tipo de bolo
  - Cobertura
  - Tamanho do bolo
  - Data e hora de entrega
  - Observações
  - Prioridade
- Histórico de pedidos para consulta

### Para a Cozinha:
- Quadro visual estilo Trello com os pedidos organizados por status:
  - Pendentes
  - Feitos
  - Entregues
- Botões para atualizar o status dos pedidos

## Como Usar

### Página da Atendente (Formulário):
1. Acesse a página inicial do sistema
2. Preencha todos os campos do formulário
3. Clique em "Enviar Pedido"
4. O pedido será registrado e aparecerá no histórico e no quadro da cozinha

### Página da Cozinha:
1. Clique na aba "Cozinha" no menu superior
2. Visualize os pedidos organizados por status
3. Quando um pedido estiver pronto, clique no botão "Marcar como Feito"
4. O pedido será movido para a coluna "Feitos"

## Requisitos Técnicos

- Python 3.11+
- Flask
- SQLite (banco de dados)
- HTML, CSS, JavaScript

## Instalação e Execução

1. Clone o repositório
2. Navegue até a pasta do projeto
3. Ative o ambiente virtual:
   ```
   cd app
   source venv/bin/activate
   ```
4. Execute o aplicativo:
   ```
   cd src
   python main.py
   ```
5. Acesse o sistema no navegador: http://127.0.0.1:5000

## Estrutura do Projeto

```
sistema_pedidos_bolo/
├── app/
│   ├── venv/                  # Ambiente virtual Python
│   ├── src/
│   │   ├── models/            # Modelos de dados
│   │   │   └── pedido.py      # Modelo de pedido
│   │   ├── routes/            # Rotas da API
│   │   │   └── pedido.py      # Rotas para gerenciar pedidos
│   │   ├── static/            # Arquivos estáticos
│   │   │   ├── css/           # Estilos CSS
│   │   │   │   └── style.css  # Estilos do sistema
│   │   │   └── js/            # Scripts JavaScript
│   │   │       ├── formulario.js  # Lógica do formulário
│   │   │       └── cozinha.js     # Lógica da tela da cozinha
│   │   ├── templates/         # Templates HTML
│   │   │   ├── index.html     # Página da atendente
│   │   │   └── cozinha.html   # Página da cozinha
│   │   └── main.py            # Ponto de entrada da aplicação
│   └── requirements.txt       # Dependências Python
└── README.md                  # Este arquivo
```

## Personalização

O sistema pode ser facilmente personalizado para atender às necessidades específicas da sua loja de bolos:

- Adicionar novos campos ao formulário
- Modificar o layout do quadro da cozinha
- Adicionar novos status para os pedidos
- Implementar notificações para novos pedidos

## Suporte

Para suporte ou dúvidas, entre em contato com o desenvolvedor.
