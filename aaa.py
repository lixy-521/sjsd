from flask import Flask, request, Response
import requests
import json

app = Flask(__name__)

# 并行智算云的配置
PARALLEL_BASE_URL = "https://api.paracloud.com/v1"
PARALLEL_API_KEY = "sk-hw-tqsckFvzDNHQGlNXSTw"

@app.route('/v1/chat/completions', methods=['POST'])
def chat_completions():
    """转发聊天请求"""
    try:
        data = request.get_json()
        headers = {
            "Authorization": f"Bearer {PARALLEL_API_KEY}",
            "Content-Type": "application/json"
        }
        resp = requests.post(
            f"{PARALLEL_BASE_URL}/chat/completions",
            json=data,
            headers=headers,
            stream=True
        )
        return Response(
            resp.iter_content(chunk_size=1024),
            content_type=resp.headers.get('content-type'),
            status=resp.status_code
        )
    except Exception as e:
        return {"error": str(e)}, 500

@app.route('/v1/models', methods=['GET'])
def list_models():
    """列出可用模型（可选）"""
    headers = {"Authorization": f"Bearer {PARALLEL_API_KEY}"}
    resp = requests.get(f"{PARALLEL_BASE_URL}/models", headers=headers)
    return resp.json(), resp.status_code

if __name__ == '__main__':
    print("本地代理启动: http://127.0.0.1:8000/v1")
    app.run(host='0.0.0.0', port=8000, debug=False)