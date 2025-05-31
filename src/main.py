import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))  # DON'T CHANGE THIS !!!

from flask import Flask, render_template, send_from_directory
from src.models.pedido import db
from src.routes.pedido import pedido_bp

app = Flask(__name__)

# Configuração do banco de dados
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{os.getenv('DB_USERNAME', 'root')}:{os.getenv('DB_PASSWORD', 'password')}@{os.getenv('DB_HOST', 'localhost')}:{os.getenv('DB_PORT', '3306')}/{os.getenv('DB_NAME', 'mydb')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicialização do banco de dados
db.init_app(app)

# Registro dos blueprints
app.register_blueprint(pedido_bp)

# Rota para a página inicial (formulário da atendente)
@app.route('/')
def index():
    return render_template('index.html')

# Rota para a página da cozinha (quadro visual)
@app.route('/cozinha')
def cozinha():
    return render_template('cozinha.html')

# Rota para servir arquivos estáticos
@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

# Criação das tabelas do banco de dados
with app.app_context():
    db.create_all()

