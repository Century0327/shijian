# 开发预览服务器：带 no-cache 响应头，保证刷新即见最新数据
import http.server
import os

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        if self.path.endswith('.html') or self.path in ('/', ''):
            self.send_header('Cache-Control', 'no-store')
        else:
            self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

os.chdir(os.path.dirname(os.path.abspath(__file__)))
http.server.ThreadingHTTPServer(('0.0.0.0', 8777), Handler).serve_forever()
