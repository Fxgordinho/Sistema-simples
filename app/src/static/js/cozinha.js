document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const colunaPendente = document.getElementById('coluna-pendente');
    const colunaFeito = document.getElementById('coluna-feito');
    const colunaEntregue = document.getElementById('coluna-entregue');
    
    // Carregar pedidos ao iniciar
    carregarPedidos();
    
    // Função para carregar todos os pedidos
    function carregarPedidos() {
        fetch('/api/pedidos')
        .then(response => response.json())
        .then(pedidos => {
            // Limpar colunas
            colunaPendente.innerHTML = '';
            colunaFeito.innerHTML = '';
            colunaEntregue.innerHTML = '';
            
            // Verificar se há pedidos
            if (pedidos.length === 0) {
                colunaPendente.innerHTML = '<div class="alert alert-info">Nenhum pedido pendente</div>';
                colunaFeito.innerHTML = '<div class="alert alert-info">Nenhum pedido feito</div>';
                colunaEntregue.innerHTML = '<div class="alert alert-info">Nenhum pedido entregue</div>';
                return;
            }
            
            // Distribuir pedidos nas colunas
            pedidos.forEach(pedido => {
                const cardPedido = criarCardPedido(pedido);
                
                switch(pedido.status) {
                    case 'pendente':
                        colunaPendente.appendChild(cardPedido);
                        break;
                    case 'feito':
                        colunaFeito.appendChild(cardPedido);
                        break;
                    case 'entregue':
                        colunaEntregue.appendChild(cardPedido);
                        break;
                }
            });
        })
        .catch(error => {
            console.error('Erro ao carregar pedidos:', error);
            colunaPendente.innerHTML = '<div class="alert alert-danger">Erro ao carregar pedidos</div>';
        });
    }
    
    // Função para criar card de pedido
    function criarCardPedido(pedido) {
        const card = document.createElement('div');
        card.className = `card card-pedido prioridade-${pedido.prioridade}`;
        card.dataset.id = pedido.id;
        
        let botoesStatus = '';
        
        // Botões de ação baseados no status atual
        if (pedido.status === 'pendente') {
            botoesStatus = `
                <button class="btn btn-sm btn-info w-100 btn-status" 
                        onclick="atualizarStatus(${pedido.id}, 'feito')">
                    Marcar como Feito
                </button>
            `;
        } else if (pedido.status === 'feito') {
            botoesStatus = `
                <button class="btn btn-sm btn-success w-100 btn-status" 
                        onclick="atualizarStatus(${pedido.id}, 'entregue')">
                    Marcar como Entregue
                </button>
            `;
        }
        
        card.innerHTML = `
            <div class="card-header bg-${getStatusColor(pedido.status)} text-white">
                <h5>${pedido.nome_cliente}</h5>
            </div>
            <div class="card-body">
                <div class="info-pedido"><strong>Bolo:</strong> ${pedido.tipo_bolo}</div>
                <div class="info-pedido"><strong>Cobertura:</strong> ${pedido.cobertura}</div>
                <div class="info-pedido"><strong>Tamanho:</strong> ${pedido.tamanho_bolo}</div>
                <div class="info-pedido data-entrega"><strong>Entrega:</strong> ${formatarData(pedido.data_hora_entrega)}</div>
                ${pedido.observacoes ? `<div class="info-pedido observacoes"><strong>Obs:</strong> ${pedido.observacoes}</div>` : ''}
                <div class="info-pedido"><strong>Prioridade:</strong> <span class="badge ${getPrioridadeBadge(pedido.prioridade)}">${pedido.prioridade}</span></div>
                ${botoesStatus}
            </div>
        `;
        
        return card;
    }
    
    // Função para formatar data
    function formatarData(dataString) {
        const data = new Date(dataString);
        return data.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    // Função para obter cor do status
    function getStatusColor(status) {
        switch(status) {
            case 'pendente':
                return 'warning';
            case 'feito':
                return 'info';
            case 'entregue':
                return 'success';
            default:
                return 'secondary';
        }
    }
    
    // Função para obter classe do badge de prioridade
    function getPrioridadeBadge(prioridade) {
        switch(prioridade) {
            case 'Alta':
                return 'bg-danger';
            case 'Média':
                return 'bg-warning text-dark';
            case 'Baixa':
                return 'bg-primary';
            default:
                return 'bg-secondary';
        }
    }
    
    // Atualizar pedidos a cada 5 segundos
    setInterval(carregarPedidos, 5000);
    
    // Adicionar função global para atualizar status
    window.atualizarStatus = function(id, novoStatus) {
        fetch(`/api/pedidos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: novoStatus })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao atualizar status');
            }
            return response.json();
        })
        .then(data => {
            // Recarregar pedidos após atualização
            carregarPedidos();
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao atualizar status. Por favor, tente novamente.');
        });
    };
});
