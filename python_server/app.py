import http.server
import socketserver
import json
from joblib import load

clf=load('../models/Fertility_Diagnoser_Classifier.joblib')

def predictFertility(data):
    # print(data)
    season=getSeason(data['season'])
    age=calAge(data['age'])
    disease= int(data['disease'])
    acc=int(data['accident'])
    surgery=int(data['surgery'])
    fever=int(data['fever'])
    smoking=int(data['smoking'])
    print(season)
    print(age)
    print(disease)
    print(acc)
    print(surgery)
    print(fever)
    print(smoking)
    result=clf.predict([[
        season,
        age,
        disease,
        acc,
        surgery,
        fever,
        smoking,
    ]])
    return result[0]

def getSeason(season):
    if season == "winter":
        return -1
    elif season == "spring":
        return -0.33
    elif season == "summer":
        return 0.33
    elif season == "autumn":
        return 1

def calAge(age):
    return age/100

# print(predictFertility(-0.33,0.69,0,1,1,0,1))

PORT = 8000
Handler = http.server.SimpleHTTPRequestHandler
class MyHandler(http.server.BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_GET(self):
        if self.path == '/data':
            data = {'message': 'Hello, world!'}
            json_data = json.dumps(data).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Content-length', len(json_data))
            self.end_headers()
            self.wfile.write(json_data)
        else:
            super().do_GET()
    
    def do_POST(self):
        if self.path == '/data':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            response=predictFertility(data['body'])
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Content-type', 'application/json')
            self.end_headers()
        self.wfile.write(bytes(json.dumps({'message': int(response)}), 'utf-8'))

Handler = MyHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("Server running at port", PORT)
    httpd.serve_forever()
