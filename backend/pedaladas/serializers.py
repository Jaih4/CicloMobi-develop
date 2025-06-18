from rest_framework import serializers
from .models import Pedaladas


class PedaladaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedaladas
        fields = [
            "rota",
            "tempo_total",
            "distancia_percorrida",
            "pontos_registrados",
            "caminho",
        ]
