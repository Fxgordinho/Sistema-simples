from flask import Blueprint, request, jsonify, render_template
from src.models.pedido import Pedido, db
from datetime import datetime

pedido_bp = Blueprint('pedido', __name__)

@pedido_bp.route('/api/pedidos', methods=['GET'])
def listar_pedidos():
    try:
        pedidos = Pedido.query.order_by(Pedido.data_criacao.desc()).all()
        return jsonify([pedido.to_dict() for pedido in pedidos])
    except Exception as e:
        print(f"Erro ao listar pedidos: {str(e)}")
        return jsonify({"erro": str(e)}), 500

@pedido_bp.route('/api/pedidos', methods=['POST'])
def criar_pedido():
    dados = request.json
    
    try:
        # Tratamento mais flexível para o formato de data
        data_hora_str = dados['data_hora_entrega']
        print(f"Data recebida: {data_hora_str}")
        
        # Tentar diferentes formatos de data
        try:
            data_hora_entrega = datetime.strptime(data_hora_str, '%Y-%m-%dT%H:%M')
        except ValueError:
            try:
                # Tentar extrair os primeiros 16 caracteres (YYYY-MM-DDTHH:MM)
                data_hora_str_corrigida = data_hora_str[:16] if len(data_hora_str) > 16 else data_hora_str
                data_hora_entrega = datetime.strptime(data_hora_str_corrigida, '%Y-%m-%dT%H:%M')
            except ValueError:
                # Se ainda falhar, usar data atual
                print(f"Formato de data inválido, usando data atual")
                data_hora_entrega = datetime.now()
        
        novo_pedido = Pedido(
            nome_cliente=dados['nome_cliente'],
            tipo_bolo=dados['tipo_bolo'],
            cobertura=dados['cobertura'],
            tamanho_bolo=dados['tamanho_bolo'],
            data_hora_entrega=data_hora_entrega,
            observacoes=dados.get('observacoes', ''),
            prioridade=dados['prioridade'],
            status='pendente'
        )
        
        db.session.add(novo_pedido)
        db.session.commit()
        
        print(f"Pedido criado com sucesso: {novo_pedido.to_dict()}")
        return jsonify(novo_pedido.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        print(f"Erro ao criar pedido: {str(e)}")
        return jsonify({'erro': str(e)}), 400

@pedido_bp.route('/api/pedidos/<int:pedido_id>', methods=['PUT'])
def atualizar_pedido(pedido_id):
    pedido = Pedido.query.get_or_404(pedido_id)
    dados = request.json
    
    try:
        if 'status' in dados:
            pedido.status = dados['status']
            
        db.session.commit()
        return jsonify(pedido.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 400

@pedido_bp.route('/api/pedidos/<int:pedido_id>', methods=['DELETE'])
def deletar_pedido(pedido_id):
    pedido = Pedido.query.get_or_404(pedido_id)
    
    try:
        db.session.delete(pedido)
        db.session.commit()
        return jsonify({'mensagem': 'Pedido excluído com sucesso'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 400
