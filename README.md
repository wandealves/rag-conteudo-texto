# Passo Python

- Criar ambiente

python -m venv ragRestaurante

- Ativar o ambiente

source ragRestaurante/bin/activate

- Desativar o ambiente

deactivate

- Instalar chromadb

pip install chromadb

- Instalar ollama

pip install ollama

- Criar DB

python restaurante-db.py

- Iniciar pergunta

python modelo-conecte.py

# Executar o server API

uvicorn main:app --reload

- Adicionar fastapi
  pip install fastapi[all]

# Chat UI

npm i
npm run start

Acessar: http://localhost:3000/
