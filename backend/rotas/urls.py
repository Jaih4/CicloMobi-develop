from django.urls import path
from .views import criar_rota, listar_rotas

urlpatterns = [
    path("criar/", criar_rota, name="criar"),
    path("listar/", listar_rotas, name="listar_rotas"),
]
