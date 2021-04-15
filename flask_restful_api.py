from flask import Flask,request,make_response,send_file,jsonify
from flask_restful import Resource,Api
from flask_cors import CORS
import mysql.connector
import qrcode
import io
import base64 as encoder

app = Flask(__name__)
cors = CORS(app)
api = Api(app)

config = {
        "ip": "192.168.0.105",
        "ports": {
            "web_app": 3000,
            "api": 5000
        },
        "database": {
            "DB_HOST": "localhost",
            "DB_USER": "root",
            "DB_PASSWORD": "password",
            "DB_DATABASE": "qr_attendance",
            "DB_PORT": 3300
        }
    }

def execute_sql_cmd(sql_cmd,commit):
    mydb = mysql.connector.connect(
      host = config["database"]["DB_HOST"],
      port = config["database"]["DB_PORT"],
      user = config["database"]["DB_USER"],
      password = config["database"]["DB_PASSWORD"],
      database = config["database"]["DB_DATABASE"]
    )
    mycursor = mydb.cursor()
    mycursor.execute(sql_cmd)
    if not commit:
        values = mycursor.fetchall()
    else:
        values = True
        mydb.commit()
    mydb.close()
    return values

def encode_two_words(first,second):
    inp_string = f"{first}/{second}"
    return encoder.b64encode(bytes(inp_string, 'utf-8')).decode('ascii')

def decode_two_words(encoded_str):
    decoded_str = encoder.b64decode(encoded_str).decode('ascii')
    decoded_str = decoded_str.split('/')
    return decoded_str[0].replace('-',' '),decoded_str[1].replace('-',' ')

class Students(Resource):
    def post(self):
        req_body = request.get_json()
        sql_cmd = f"insert into student values ('{0}','{1}','{2}')".format(req_body['roll_num'],req_body['name'],req_body['class_name'])
        execute_sql_cmd(sql_cmd,True)

class SignUpData(Resource):
    def get(self):
        sql_cmd = 'select roll_num from student'
        students = execute_sql_cmd(sql_cmd,False)
        students = [i[0] for i in students]
        response = {'roll_nums':students}
        sql_cmd = 'SELECT department,class_name FROM class'
        departments = execute_sql_cmd(sql_cmd,False)
        response['departments'] = {}
        for i in departments:
            response['departments'][i[0]] = response['departments'][i[0]]+[i[1]] if i[0] in response['departments'] else [i[1]]
        return make_response(jsonify(response),200)

class Key(Resource):
    def get(self,roll_num):
        sql_cmd = f"select name,roll_num from student where roll_num={roll_num}"
        try:
            student = execute_sql_cmd(sql_cmd,False)
            encoded_str = encode_two_words(student[0][0],student[0][1])
            response = {'error':False,'key':encoded_str}
        except:
            response = {'error':True,'result':'Student not found'}
        return make_response(jsonify(response))
    
    def post(self):
        data = request.get_json()
        encoded_str = data['key']
        name,roll_num = decode_two_words(encoded_str)
        response = {"roll_num":roll_num,"name":name}
        sql_cmd = "select sheet from attendance where subject_name='{0}' and class_name='{1}' and date='{2}'".format(data['subject'],data['class'],data['date'])
        sheet = execute_sql_cmd(sql_cmd,False)
        sheet = eval(sheet[0][0])
        sheet["sheet"].append(response)
        sheet = str(sheet).replace("'",'"')
        sql_cmd = "update attendance set sheet='{3}' where subject_name='{0}' and class_name='{1}' and date='{2}'".format(data['subject'],data['class'],data['date'],sheet)
        execute_sql_cmd(sql_cmd,True)
        return make_response(jsonify(response))

class GenerateData(Resource):
    def get(self):
        sql_cmd = 'select * from subject'
        subjects = execute_sql_cmd(sql_cmd,False)
        response = {}
        for subject in subjects:
            response[subject[0]] = subject[1].split(',')
        return make_response(jsonify(response))

class QRimage(Resource):
    def get(self,date,class_name,subj_name):
        url = f'http://{config["ip"]}:{config["ports"]["web_app"]}/attendance/{date}'
        encoded_str = encode_two_words(class_name,subj_name)
        print(url+encoded_str)
        img = qrcode.make(f'{url}/{encoded_str}')
        img_io = io.BytesIO()
        img.save(img_io, 'JPEG', quality=70)
        img_io.seek(0)
        return send_file(img_io, mimetype='image/jpeg')
    
    def post(self,date,class_name,subj_name):
        class_name,subj_name = class_name.replace('-',' '),subj_name.replace('-',' ')
        sheet = '{"sheet":[]}'
        sql_cmd = f"insert into attendance values('{subj_name}','{class_name}','{date}','{sheet}')"
        execute_sql_cmd(sql_cmd,True)

class Attendance(Resource):
    def get(self,date,encoded_str):
        class_name,subj_name = decode_two_words(encoded_str)
        sql_cmd = f"select sheet from attendance where subject_name='{subj_name}' and class_name='{class_name}' and date='{date}'"
        sheet = execute_sql_cmd(sql_cmd,False)
        response = eval(sheet[0][0])
        response["subject"] = subj_name
        response["class"] = class_name
        response["date"] = date
        return make_response(jsonify(response))

api.add_resource(SignUpData,'/getSignUpData')
api.add_resource(Students,'/getStudents','/postStudent')
api.add_resource(Key,'/getKey/<int:roll_num>','/postKey')
api.add_resource(GenerateData,'/getGenerateData')
api.add_resource(QRimage,'/getQRimg/<string:date>/<string:class_name>/<string:subj_name>')
api.add_resource(Attendance,'/getAttendance/<string:date>/<string:encoded_str>')

if __name__ == '__main__':
   app.run(debug=True,host='0.0.0.0', port=config["ports"]["api"])