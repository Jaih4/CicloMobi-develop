from django.urls import path
from .views import criar_pedalada, listar_pedaladas

urlpatterns = [
    path("criar/", criar_pedalada, name="criar"),
    path("listar/", listar_pedaladas, name="listar_pedaladas"),
]
