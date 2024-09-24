import chromadb
import ollama

questao = input('Como posso lhe ajudar?')

chroma_client = chromadb.Client()
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
print(response['message']['content'])