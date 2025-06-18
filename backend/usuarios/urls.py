from django.urls import path
from .views import RegisterView, listar_usuarios, perfil_usuario

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("listar/", listar_usuarios),
    path("perfil/", perfil_usuario, name="perfil_usuario"),
]
