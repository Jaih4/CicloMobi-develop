from django.db import models


# Create your models here.
class Rotas(models.Model):
    nome = models.CharField(max_length=100)
    descricao = models.TextField()
    coordenadas = models.JSONField()

    def __str__(self):
        return self.nome

    class Meta:
        verbose_name = "Rota"
        verbose_name_plural = "Rotas"
        ordering = ["nome"]
