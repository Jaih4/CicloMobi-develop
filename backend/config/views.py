from django.http import HttpResponse

def api_root_view(request):
    html = """
    <html>
        <head>
            <title>CicloMobi API</title>
            <style>
                body { font-family: sans-serif; background: #f8f9fa; padding: 20px; }
                h1 { color: #4a4a4a; }
                ul { padding-left: 20px; }
                li { margin: 10px 0; }
                code { background: #eee; padding: 2px 4px; border-radius: 4px; }
                a { text-decoration: none; color: #007bff; }
                a:hover { text-decoration: underline; }
            </style>
        </head>
        <body>
            <h1>🌐 CicloMobi API</h1>
            <p>Rotas disponíveis:</p>
            <ul>
                <li><code>POST</code> <a href="/api/usuarios/register/">/api/usuarios/register/</a> — Criar novo usuário</li>
                <li><code>POST</code> <a href="/api/token/">/api/token/</a> — Obter token JWT</li>
                <li><code>POST</code> <a href="/api/token/refresh/">/api/token/refresh/</a> — Renovar token JWT</li>
                <li><code>GET</code> <a href="/api/usuarios/listar/">/api/usuarios/listar/</a> — Listar usuários cadastrados</li>
            </ul>
        </body>
    </html>
    """
    return HttpResponse(html)

