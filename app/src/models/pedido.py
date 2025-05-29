from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Pedido(db.Model):
    __tablename__ = 'pedidos'
    
    id = db.Column(db.Integer, primary_key=True)
    nome_cliente = db.Column(db.String(100), nullable=False)
    tipo_bolo = db.Column(db.String(100), nullable=False)
    cobertura = db.Column(db.String(100), nullable=False)
    tamanho_bolo = db.Column(db.String(50), nullable=False)
    data_hora_entrega = db.Column(db.DateTime, nullable=False)
    observacoes = db.Column(db.Text, nullable=True)
    prioridade = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(20), default='pendente')
    data_criacao = db.Column(db.DateTime, default=datetime.now)
    data_atualizacao = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)
    
    def to_dict(self):
        return {
            'id': self.id,
            'nome_cliente': self.nome_cliente,
            'tipo_bolo': self.tipo_bolo,
            'cobertura': self.cobertura,
            'tamanho_bolo': self.tamanho_bolo,
            'data_hora_entrega': self.data_hora_entrega.strftime('%Y-%m-%d %H:%M'),
            'observacoes': self.observacoes,
            'prioridade': self.prioridade,
            'status': self.status,
            'data_criacao': self.data_criacao.strftime('%Y-%m-%d %H:%M'),
            'data_atualizacao': self.data_atualizacao.strftime('%Y-%m-%d %H:%M')
        }
