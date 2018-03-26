import numpy as np

from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func



##importing packages and dependencies
from flask import (Flask,jsonify,render_template,jsonify,request,redirect)
##initializing the app
app=Flask(__name__)

from flask_sqlalchemy import SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///project2_db_TEST.sqlite"
db=SQLAlchemy(app)

class usCities(db.Model):
	__tablename__='us_cities'

	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(25))
	pop = db.Column(db.Integer)
	lat=db.Column(db.Float)
	lon=db.Column(db.Float)

	 def __repr__(self):
        return '<City: %r>' % (self.name)

@app.before_first_request
def setup():
	db.create_all()
##creating routes
@app.route('/')
def home():
	return render_template('index.html')


@app.route('/la_county_crime')
def firstView():
	sqlquery=session.query(ACTUAL QUERY).statement
	dataframe=pd.read_sql_query(sqlquery,session.bind)
	return jsonify(dataframe[['Crime_Description','Lat','Long']])

if __name__ == "__main__":
    app.run(debug=True)
