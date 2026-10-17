from random import randint

def ingresar_entero(mensaje, minimo=1):
    while True:
        try:
            valor = int(input(mensaje))
        except ValueError:
            print(f"\nError. Ingresá un número, nabo.\n")
            continue
        
        if valor < minimo:
            print(f"\nError. Ingresá un número entero mayor o igual a {minimo}, nabo.\n")
            continue
        
        return valor

def armar_equipos():
    cant = ingresar_entero("Cantidad de jugadores: ")
    
    if (cant % 2) == 1:
        print("\nDisclaimer: La cantidad es impar. Un equipo va a quedar con un jugador más que el otro.") 
    
    equipo1 = []
    equipo2 = []
    
    print("Jugadores (nombres):")
    for i in range(cant):
        j = input(f"Jugador {i+1}: ")
        equipo = randint(1, 2)
        
        if equipo == 1:
            if len(equipo1) < (cant / 2):
                equipo1.append(j)
            else:
                equipo2.append(j)
        else:
            if len(equipo2) < (cant / 2):
                equipo2.append(j)
            else:
                equipo1.append(j)
    
    print("\nListo, nene")
    print("\nEquipo 1:")
    for j in equipo1:
        print("- " + j)
    
    print("\nEquipo 2:")
    for j in equipo2:
        print("- " + j)

def main():
    print("Sorteo para el fulbito")
    print("======================")
    print("Cargá los nombres de todos y te genera los equipos de forma completamente imparcial.")
    print("No hay sesgos. No hay forma de hacer trampa.")
    
    op = -1
    while op != 0:
        print("\nMenú de opciones")
        print("----------------")
        print("1) Armar equipos")
        print("0) Salir")
        # El 0 se conserva como opción válida para salir del menú.
        op = ingresar_entero("--> ", minimo=0)
        
        if op == 1:
            armar_equipos()
        elif op == 0:
            print("\nAdieu! Bye Bye! Aufwiedersehen!")
        

if __name__ == "__main__":
    main()