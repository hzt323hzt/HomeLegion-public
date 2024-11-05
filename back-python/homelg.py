from flask import Flask,send_from_directory,request,jsonify,abort,has_request_context
from flask.logging import default_handler
import logging
from getData import get_houses
from flask_cors import CORS
from projCal import projCal
from new1 import zillow_style_city, getSingleHouse
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature
from datetime import datetime, timedelta
from flask_apscheduler import APScheduler
from getBlockIPs import read_ip_list,write_ip_list
import logging
from recentHouse import recentHouse
# set configuration values
class Config:
    SCHEDULER_API_ENABLED = True
    SECRET_KEY = 'home_legion_key'

MAX_FAILED_ATTEMPTS = 5
MAX_API_ATTEMPTS = 50
BLOCK_DURATION = timedelta(minutes=60)
global_ip_dict = dict()
failed_attempts = {}
blocked_ips = {}
PermBlocked = []
recentH = recentHouse()

def is_ip_blocked(ip):
    """Check if the IP is currently blocked."""
    if ip in PermBlocked:
        return True
    if ip in blocked_ips:
        block_time = blocked_ips[ip]
        if datetime.now() < block_time:
            return True
        else:
            del blocked_ips[ip]  # Unblock IP after block duration
    return False

app = Flask(__name__,static_folder='front')
# app.config['SECRET_KEY'] = 'home_legion_key'

CORS(app, resources={r"/*"},origins=["http://localhost:3000"],supports_credentials=True)

app.config.from_object(Config())

# initialize scheduler
scheduler = APScheduler()

@scheduler.task('interval', id='do_job_1', seconds=600, misfire_grace_time=900)
def job1():
    global_ip_dict.clear()
    recentH.saveRecents()
    # print('Job 1 executed')

@scheduler.task('interval', id='do_job_2', seconds=1800, misfire_grace_time=900)
def job2():
    PermBlocked = read_ip_list()

scheduler.init_app(app)
scheduler.start()



serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])

def get_client_ip():
    if request.environ.get('HTTP_X_FORWARDED_FOR') is None:
        return request.environ['REMOTE_ADDR']
    else:
        return request.environ['HTTP_X_FORWARDED_FOR']

@app.before_request
def block_ips():
    """Middleware to block requests from blocked IPs."""
    if request.headers.getlist("X-Forwarded-For"):
        client_ip = request.headers.getlist("X-Forwarded-For")[0]
    else:
        client_ip = request.remote_addr
    app.logger.info(f"Client IP: {client_ip}")
    if is_ip_blocked(client_ip):
        abort(403)  # Forbidden

@app.errorhandler(404)
def handle_404(error):
    """Handle 404 errors to track incorrect routes."""
    client_ip = request.remote_addr
    failed_attempts[client_ip] = failed_attempts.get(client_ip, 0) + 1
    # print(failed_attempts)
    if failed_attempts[client_ip] >= MAX_FAILED_ATTEMPTS:
        blocked_ips[client_ip] = datetime.now() + BLOCK_DURATION
        return jsonify({'error': 'Too many incorrect requests. You are temporarily blocked.'}), 403
    return jsonify({'error': 'Invalid route'}), 404

@app.route('/api/generate_token', methods=['GET'])
def generate_token():
    # print("generate_token")
    ip_address = get_client_ip()
    token = serializer.dumps({'user_id': 1, 'ip': ip_address})  # Add IP address and relevant user data or session info
    return jsonify({'token': token})

def check_token():
    token = request.headers.get('Authorization').replace('Bearer ','')
    # print(token)
    if not token:
        return False, {'error': 'Token is missing'}, 400

    try:
        data = serializer.loads(token, max_age=3600)  # Token is valid for 1 hour
        current_ip = get_client_ip()
        if data['ip'] != current_ip:
            return False, {'error': 'IP address does not match'}, 400
        if current_ip not in global_ip_dict:
            global_ip_dict[current_ip] = 0
        else:
            global_ip_dict[current_ip] += 1
        # print(global_ip_dict)
        if global_ip_dict[current_ip] > MAX_API_ATTEMPTS:
            return False, {'error': 'Too many requests'}, 400        
        return True, {'message': 'Hello, World!'}, 200
    except SignatureExpired:
        return False, {'error': 'Token has expired'}, 400
    except BadSignature:
        return False, {'error': 'Invalid token'}, 400


@app.route('/api/<location>', methods = ['GET','POST'])
def hello_world(location):
    valid, response, status_code = check_token()
    if not valid:
        return jsonify(response), status_code
    return get_houses(zillow_style_city(location))
    # if request.method == 'POST':
    
@app.route('/api/<location>/<page>', methods = ['GET','POST'])
def query_location_page(location,page):
    # if request.method == 'POST':
    valid, response, status_code = check_token()
    if not valid:
        return jsonify(response), status_code
    return get_houses(zillow_style_city(location),page)

@app.route('/api/house-with-address', methods = ['POST'])
def getSingleHouseWithAddress():
    valid, response, status_code = check_token()
    if not valid:
        return jsonify(response), status_code
    data = request.get_json()
    return recentH.addToRecents(getSingleHouse(data))

@app.route('/api/recent-houses', methods = ['GET'])
def getRecentHouses():
    return recentH.getRecents()

@app.route('/api/add-recent-houses', methods = ['POST'])
def addRecentHouses():
    valid, response, status_code = check_token()
    if not valid:
        return jsonify(response), status_code
    data = request.get_json()
    return recentH.addToRecents(data)
     

@app.route('/api/cal-results', methods = ['POST'])
def getCalResults():
    valid, response, status_code = check_token()
    if not valid:
        return jsonify(response), status_code
    data = request.get_json()
    # print(data)
    dataObj = projCal()
    dataObj.dict_to_obj(data)
    # if request.method == 'POST':
    return dataObj.getResult()

@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/home')
def serve_home():
    return send_from_directory(app.static_folder, 'index.html')

# Route to serve static files like CSS and JavaScript
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

logging.basicConfig(level=logging.INFO)

if __name__ == '__main__':
    app.run()