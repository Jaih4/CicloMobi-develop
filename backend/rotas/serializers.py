from rest_framework import serializers
from .models import Rotas


class RotaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rotas
        fields = ["id", "nome", "descricao", "coordenadas"]
