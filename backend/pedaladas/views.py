from rest_framework import generics
from .models import Pedaladas
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import PedaladaSerializer
from rest_framework import status


@api_view(["GET"])
def listar_pedaladas(request):
    pedaladas = Pedaladas.objects.all().values(
        "tempo_total", "distancia_percorrida", "pontos_registrados"
    )
    return Response(list(pedaladas))


@api_view(["POST"])
def criar_pedalada(request):
    serializer = PedaladaSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
