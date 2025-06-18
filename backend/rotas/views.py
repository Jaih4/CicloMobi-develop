from rest_framework import generics
from .models import Rotas
from rest_framework.decorators import api_view
from .serializers import RotaSerializer
from rest_framework.response import Response
from rest_framework import status


@api_view(["GET"])
def listar_rotas(request):
    rotas = Rotas.objects.all().values("coordenadas", "nome", "descricao")
    return Response(list(rotas))


@api_view(["POST"])
def criar_rota(request):
    serializer = RotaSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
