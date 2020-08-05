from flask import Flask, jsonify, request, session,jsonify
import json
from flask_pymongo import PyMongo ,MongoClient
from datetime import datetime 
from flask_bcrypt import Bcrypt 
from flask_cors import CORS
from flask_jwt_extended import JWTManager 
from flask_jwt_extended import create_access_token
import os
from werkzeug.utils import secure_filename
import fs
import gridfs
from flask_mail import Mail, Message
import spacy
import docx
from bson import json_util
from flask.json import JSONEncoder
import glob
from tika import parser
import re
import fnmatch
import os
import pandas as pd
import numpy as np
import base64


# define a custom encoder point to the json_util provided by pymongo (or its dependency bson)
class CustomJSONEncoder(JSONEncoder):
    def default(self, obj): return json_util.default(obj)
path=""
spacy.util.set_data_path('./')
nlp = spacy.load("en_core_web_lg")
UPLOAD_FOLDER = './'
app = Flask(__name__)
mail_settings = {
    "MAIL_SERVER": 'smtp.gmail.com',
    "MAIL_PORT": 465,
    "MAIL_USE_TLS": False,
    "MAIL_USE_SSL": True,
    "MAIL_USERNAME": 'azaz.vhora78@gmail.com',
    "MAIL_PASSWORD": 'Azazaksha42257'
}

app.config.update(mail_settings)


app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MONGO_DBNAME'] = 'pythonreact'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/pythonreact'
app.config['JWT_SECRET_KEY'] = 'secret'
app.json_encoder = CustomJSONEncoder
mail = Mail(app)
mongo = PyMongo(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

CORS(app)

def getpdfcontent(path):
    pdf_content = parser.from_file(path)
    text = re.sub(r"\n{2,}", "<131313>", pdf_content['content'])
    text = text.replace("\n", " ")
    text = text.replace("<131313>", "\n\n")
    paragraphs = extractparagraphs(text.splitlines())
    paragraphs=list(dict.fromkeys(paragraphs))
    paragraphs.remove(paragraphs[0])
    return paragraphs

def extractparagraphs(lines):
    current = ""
    paragraphs = []
    for line in lines:
        if not line.strip():
            if current.strip():
                paragraphs.append(current)
                current = ""
            continue
        current += line.strip()
    return paragraphs


def getText(filename):
    doc = docx.Document(filename)
    fullText = []
    for para in doc.paragraphs:
        fullText.append(para.text)
    return fullText


def data(filename):
    dic={"name": "", "date": "","pay": "0","award":"","score":""}
    score=0
    labels=[]
    text= []
    countPerson=0
    countDate=0
    text=[]
    ext=[]
    ext=filename.split(".")
    if ext[len(ext)-1]=="pdf":
        text= getpdfcontent(filename)
    elif ext[len(ext)-1]=="docx":
        text = getText(filename)
    for idx,data in enumerate(text):
        doc=nlp(str(data))
        for ent in doc.ents:
            if ent.label_=="PERSON" and countPerson==0 and idx<8:
                labels.append((ent.text))
                dic['name']=ent.text
                score+=25
                countPerson+=1
            elif ent.label_=="DATE" and idx<8:
                countDate+=1
                if countDate==2:
                    labels.append(ent.text)
                    dic['date']=ent.text
                    score+=25
            elif ent.label_=="MONEY":
                labels.append(ent.text)
                dic['pay']=ent.text          
    dic['score']=str(int(score))
    txtfiles=[]
    for file in os.listdir('./Data'):
        if fnmatch.fnmatch(file, '*.csv'):
            txtfiles.append(file)
    l=[]
    filenames=[]
    wage=0.0
    for data in txtfiles:
        l=str(data).split(" ")
        filenames.append((" ".join(l[1:(len(l)-2)])))
    for names in filenames:
        for para in text:
            if names in para:
                print(names)
                dic['award']=names
                score+=25
                dic['score']=str(int(score))
                for data in txtfiles:
                    if names in data:
                        print(data)
                        df=pd.read_csv('./Data/'+data,header=None)
                        mask=df.applymap(lambda x: 'week' in str(x))
                        a = np.where(mask.values == True)
                        print(a)
                        print(a[0][0])
                        if a[1][0]>0:
                            print(a[0][0],a[1][0])
                            print('----')
                            
                            lst = list(df.iloc[a[0][0]:,a[1][0]])
                            for var in lst:
                                try: 
                                    wage=float(var)
                                    print(wage)
                                    if float(dic['pay'])<wage:
                                        print("score is less")
                                        computation=(float(dic['pay'])/wage)
                                        computation=computation*25
                                        score+=computation
                                        dic['pay']= "-"+str(dic['pay'])
                                        dic['score']=str(int(score))
                                    elif float(dic['pay'])>=wage:
                                        print("score is Accurate")
                                        score+=25
                                        dic['score']=score
                                    return dic
                                except:
                                    pass
                            
                        
    return dic                                   
    

    
@app.route('/upload', methods=['POST'])
def fileUpload():
    global path
    target=os.path.join(UPLOAD_FOLDER,'test_docs')
    if not os.path.isdir(target):
        os.mkdir(target)
    file = request.files['file'] 
    print(file)
    filename = secure_filename(file.filename)
    print(filename)
    ext =str(filename).split(".")
    if ext[1]=="docx" or ext[1]=="pdf":
        destination="/".join([target, filename])
        file.save(destination)
        path=str(destination)
        print(path)
        print(destination)
    '''db=mongo.db.pythonreact
    mongo.save_file(filename,file)'''
    return "file saved"

@app.route('/data' , methods = ['POST','GET'])
def showFile():
    global path
    '''fi=mongo.db.fs.files.find({ 'filename':filename})d.count()'''
    print(path)
    l=data(path)
    print(l)
    '''
    db=mongo.db.users
    l=json.dumps(l,default=str)
    result=db.insert_one(l)
    '''
    return jsonify(l)
@app.route('/email', methods = ['POST'])
def get_query_from_react():
    data = request.get_json()
    db=mongo.db.users
    to_Db={}
    #https://www.tutorialspoint.com/cryptography_with_python/cryptography_with_python_base64_encoding_and_decoding.html
    to_Db['name'] = str(base64.b64encode(str(data['name']).encode())).replace('b','').replace("'","")
    to_Db['dob'] = str(base64.b64encode(str(data['dob']).encode())).replace('b','').replace("'","")
    to_Db['pay'] = str(base64.b64encode(str(data['pay']).encode())).replace('b','').replace("'","")
    to_Db['score'] = str(base64.b64encode(str(data['score']).encode())).replace('b','').replace("'","")
    to_Db['award'] = str(base64.b64encode(str(data['award']).encode())).replace('b','').replace("'","")
    to_Db['email']=data['email']
    print(to_Db)
    result=db.insert_one(to_Db)
    print(data['email'])
    with app.app_context():
        msg = Message(subject="Regarding your score report",
                      sender=app.config.get("MAIL_USERNAME"),
                      recipients=[data['email']], # replace with your email for testing
                      body="Your score report from Advancer: \nName: "+data['name'] +"\nDOB: "+data['dob']+"\nPay Rate: $"+str(data['pay'])+"\nScore: "+str(data['score'])+" %\nAward: "+str(data['award']))
        mail.send(msg)
    return data
if __name__ == '__main__':
    app.run(debug=True)
