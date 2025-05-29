document.addEventListener('DOMContentLoaded', function() {
    const pedidoForm = document.getElementById('pedidoForm');
    const historicoPedidos = document.getElementById('historicoPedidos');
    
    // Carregar histórico de pedidos ao iniciar
    carregarHistoricoPedidos();
    
    // Configurar envio do formulário
    pedidoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Formatar data para o formato esperado pelo backend
        const dataHoraEntregaInput = document.getElementById('data_hora_entrega').value;
        
        // Garantir que a data está no formato correto YYYY-MM-DDTHH:MM
        const dataHoraEntrega = formatarDataParaEnvio(dataHoraEntregaInput);
        
        const pedido = {
            nome_cliente: document.getElementById('nome_cliente').value,
            tipo_bolo: document.getElementById('tipo_bolo').value,
            cobertura: document.getElementById('cobertura').value,
            tamanho_bolo: document.getElementById('tamanho_bolo').value,
            data_hora_entrega: dataHoraEntrega,
            observacoes: document.getElementById('observacoes').value,
            prioridade: document.getElementById('prioridade').value
        };
        
        console.log('Enviando pedido:', pedido);
        
        // Enviar pedido para o servidor
        fetch('/api/pedidos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedido)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error('Erro ao enviar pedido: ' + (err.erro || 'Erro desconhecido'));
                });
            }
            return response.json();
        })
        .then(data => {
            // Limpar formulário
            pedidoForm.reset();
            
            // Atualizar histórico
            carregarHistoricoPedidos();
            
            // Mostrar mensagem de sucesso
            alert('Pedido enviado com sucesso!');
        })
        .catch(error => {
            console.error('Erro:', error);
            alert(error.message || 'Erro ao enviar pedido. Por favor, tente novamente.');
        });
    });
    
    // Função para formatar data para envio ao backend
    function formatarDataParaEnvio(dataString) {
        try {
            // Verificar se a data está no formato correto
            const partes = dataString.split('T');
            if (partes.length !== 2) {
                throw new Error('Formato de data inválido');
            }
            
            const dataPartes = partes[0].split('-');
            if (dataPartes.length !== 3) {
                throw new Error('Formato de data inválido');
            }
            
            // Garantir que o ano está no formato correto (4 dígitos)
            let ano = dataPartes[0];
            if (ano.length > 4) {
                ano = ano.substring(0, 4);
            }
            
            // Reconstruir a data no formato correto
            return `${ano}-${dataPartes[1]}-${dataPartes[2]}T${partes[1]}`;
        } catch (e) {
            console.error('Erro ao formatar data:', e);
            // Retornar uma data padrão em caso de erro
            const hoje = new Date();
            const ano = hoje.getFullYear();
            const mes = String(hoje.getMonth() + 1).padStart(2, '0');
            const dia = String(hoje.getDate()).padStart(2, '0');
            const hora = String(hoje.getHours()).padStart(2, '0');
            const minuto = String(hoje.getMinutes()).padStart(2, '0');
            
            return `${ano}-${mes}-${dia}T${hora}:${minuto}`;
        }
    }
    
    // Função para carregar histórico de pedidos
    function carregarHistoricoPedidos() {
        fetch('/api/pedidos')
        .then(response => response.json())
        .then(pedidos => {
            historicoPedidos.innerHTML = '';
            
            if (pedidos.length === 0) {
                const row = document.createElement('tr');
                row.innerHTML = '<td colspan="4" class="text-center">Nenhum pedido encontrado</td>';
                historicoPedidos.appendChild(row);
                return;
            }
            
            // Limitar a 10 pedidos mais recentes
            const pedidosRecentes = pedidos.slice(0, 10);
            
            pedidosRecentes.forEach(pedido => {
                const row = document.createElement('tr');
                
                // Definir classe baseada na prioridade
                if (pedido.prioridade === 'Alta') {
                    row.classList.add('table-danger');
                } else if (pedido.prioridade === 'Média') {
                    row.classList.add('table-warning');
                }
                
                row.innerHTML = `
                    <td>${pedido.nome_cliente}</td>
                    <td>${pedido.tipo_bolo}</td>
                    <td>${formatarData(pedido.data_hora_entrega)}</td>
                    <td><span class="badge ${getBadgeClass(pedido.status)}">${pedido.status}</span></td>
                `;
                
                historicoPedidos.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar histórico:', error);
        });
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
    
    // Função para obter classe do badge baseado no status
    function getBadgeClass(status) {
        switch(status) {
            case 'pendente':
                return 'bg-warning text-dark';
            case 'feito':
                return 'bg-info text-dark';
            case 'entregue':
                return 'bg-success';
            default:
                return 'bg-secondary';
        }
    }
    
    // Atualizar histórico a cada 30 segundos
    setInterval(carregarHistoricoPedidos, 30000);
});
