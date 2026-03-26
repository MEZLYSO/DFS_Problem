# Puzzle lineal con busqueda en profundidad

from arbol import Nodo
from flask import Flask, request
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


def busqueda_solucion_dfs(estado_inicial, solucion):
    solucionado = False
    nodos_visitados = []
    nodos_frontera = []
    nodo_inicial = Nodo(estado_inicial)
    nodos_frontera.append(nodo_inicial)
    while (not solucionado) and len(nodos_frontera) != 0:
        nodo = nodos_frontera.pop()
        # Extraer nodo y agregarlo a visitados
        nodos_visitados.append(nodo)
        if nodo.get_datos() == solucion:
            # Solucion encontrada
            solucionado = True
            return nodo
        else:
            # Expandir nodos hijo
            dato_nodo = nodo.get_datos()

            # Operador izquierdo
            hijo = [dato_nodo[1], dato_nodo[0], dato_nodo[2], dato_nodo[3]]
            hijo_izquierdo = Nodo(hijo)
            if not hijo_izquierdo.en_lista(nodos_visitados)\
                    and not hijo_izquierdo.en_lista(nodos_frontera):
                nodos_frontera.append(hijo_izquierdo)

            # Operador central
            hijo = [dato_nodo[0], dato_nodo[2], dato_nodo[1], dato_nodo[3]]
            hijo_central = Nodo(hijo)
            if not hijo_central.en_lista(nodos_visitados)\
                    and not hijo_central.en_lista(nodos_frontera):
                nodos_frontera.append(hijo_central)

            # Operador derecho
            hijo = [dato_nodo[0], dato_nodo[1], dato_nodo[3], dato_nodo[2]]
            hijo_derecho = Nodo(hijo)
            if not hijo_derecho.en_lista(nodos_visitados)\
                    and not hijo_derecho.en_lista(nodos_frontera):
                nodos_frontera.append(hijo_derecho)

        nodo.set_hijos([hijo_izquierdo, hijo_central, hijo_derecho])


@app.route("/calcular", methods=["POST"])
def calcular():

    data = request.get_json()
    inicio = data.get('inicio')
    final = data.get('final')

    estado_inicial = inicio
    solucion = final
    nodo_solucion = busqueda_solucion_dfs(estado_inicial, solucion)
    # Mostrar resultado
    resultado = []
    nodo = nodo_solucion
    while nodo.get_padre() is not None:
        resultado.append(nodo.get_datos())
        nodo = nodo.get_padre()
    resultado.append(estado_inicial)
    resultado.reverse()
    return {"ruta": resultado}


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')
