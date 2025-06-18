from rest_framework import generics
from .serializers import UserSerializer
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


@api_view(["GET"])
def listar_usuarios(request):
    usuarios = User.objects.all().values("username", "email")
    return Response(list(usuarios))


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def perfil_usuario(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
