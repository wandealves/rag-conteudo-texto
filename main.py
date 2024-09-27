from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import chromadb
import ollama

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todas as origens. Para maior segurança, especifique a URL da sua UI
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Question(BaseModel):
    question: str

@app.post("/chat")
async def chat_endpoint(question: Question):
    questao = question.question
    
    chroma_client = chromadb.PersistentClient(path="db")
    collection = chroma_client.get_or_create_collection(name="artigo")

    results = collection.query(query_texts=questao, n_results=2)
    conteudo = results["documents"][0][0] + results["documents"][0][1]

    prompt = """
    Você é um assistente do Restaurante Sabores.
    Use o seguinte contexto para responder a questão, não use nenhuma informação adicional, se nao houver informacao no contexto, responda: Desculpe mas não consigo ajudar.
    Sempre termine a resposta com: Foi um prazer lhe atender, não deixe de provar nossos sabores.
    """

    response = ollama.chat(
      model='llama3.1',
      messages=[
            {
                "role": "system",
                "content": prompt,
            },
            {
              "role": "system", 
              "content": conteudo
            },
            {
              "role": "user", 
              "content": questao
            },
        ],
    )
    return {"response": response['message']['content']}
