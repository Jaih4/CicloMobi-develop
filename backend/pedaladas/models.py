from django.db import models
from rotas.models import Rotas


# Create your models here.
class Pedaladas(models.Model):
    rota = models.ForeignKey(Rotas, on_delete=models.CASCADE, related_name="pedaladas")
    tempo_total = models.FloatField()
    distancia_percorrida = models.TextField(default="", blank=True)
    pontos_registrados = models.TextField(default="", blank=True)
    caminho = models.JSONField(default=list, blank=True)

    def __str__(self):
        return f"{self.rota.nome} - {self.tempo_total} min"

    class Meta:
        verbose_name = "Pedalada"
        verbose_name_plural = "Pedaladas"
        ordering = ["tempo_total"]
