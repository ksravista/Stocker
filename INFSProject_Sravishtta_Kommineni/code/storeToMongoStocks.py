import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
cred = credentials.Certificate("./serviceAccountKey.json")
firebase_admin.initialize_app(cred)

db = firestore.client()
import os

#http://oatsreportable.finra.org/OATSReportableSecurities-SOD.txt

f = open("stocksAndTicker.txt",'r')
x = 0
for line in f:

    if(x != 0):
        array = line.split('|')
        #do stuff here

        if len(array) > 2:
            doc_ref = db.collection("stocks").document(array[0])
            doc_ref.set({
                'symbol': array[0],
                'name': array[1]
            })



    x +=1







