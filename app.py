import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify, render_template

engine = create_engine("sqlite:///lacounty_pk.sqlite")

Base = automap_base()
Base.prepare(engine, reflect=True)

hvi = Base.classes.la_county_hvi
income = Base.classes.la_county_income
crime = Base.classes.la_county_crime

session = Session(engine)

app = Flask(__name__)

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/la_county_hvi<br/>"
        f"/api/la_county_income"
    )

@app.route("/crime")
def crime_html():
    return render_template('crime.html')

@app.route('/api/la_county_crime')
def crime_json():
  dataList = []

  for row in session.query(crime):
    data = row.__dict__
    del data['_sa_instance_state']
    dataList.append(data)

  return jsonify(dataList)

@app.route('/api/la_county_hvi')
def hvi_json():
  dataList = []

  for row in session.query(hvi):
    data = row.__dict__
    del data['_sa_instance_state']
    dataList.append(data)

  return jsonify(dataList)

@app.route('/api/la_county_income')
def income_json():
  dataList = []

  for row in session.query(income):
    data = row.__dict__
    del data['_sa_instance_state']
    dataList.append(data)

  return jsonify(dataList)


if __name__ == "__main__":
  app.run(debug=True)
