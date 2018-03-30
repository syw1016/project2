import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import pandas as pd
from pandas.io.json import json_normalize
import json

from flask import Flask, jsonify, render_template

engine = create_engine("sqlite:///lacounty_pk.sqlite")

Base = automap_base()
Base.prepare(engine, reflect=True)

hvi = Base.classes.la_county_hvi
income = Base.classes.la_county_income
crime=Base.classes.la_county_crime

session = Session(engine)

app = Flask(__name__)

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/la_county_hvi<br/>"
        f"/api/la_county_income<br>"
        f"/api/la_county_crime"
    )

@app.route("/crime")
def crime_html():
    """List all available api routes."""
    return render_template('crime.html')

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

@app.route('/api/la_county_crime')
def crime_json():
  dataList = []

  for row in session.query(crime):
    data = row.__dict__
    del data['_sa_instance_state']
    dataList.append(data)
  
  return jsonify(dataList)

#Monica's Routes::

@app.route('/migration')
def migrationHome():
  return render_template('migration.html')
  
@app.route('/migration/<stmtId>')
@app.route('/migration/<int:stmtId>/<st>')
def migration(stmtId, st=None):
  """stmtId: statement identifier
  st: state
  """
  lmt = 10
  if stmtId == '-1':
    # all migrating
    results = db.session.query(migration.c.County_Name,
                                migration.c.State_Name,
                                migration.c.Geo_Lng, 
                                migration.c.Geo_Lat,
                                migration.c.Color, 
                                migration.c.Total) \
                        .order_by(migration.c.Total).limit(50).all()
  elif stmtId == 0:
      # filter includes migration going to the selected state
      results = db.session.query(migration.c.County_Name,
                                  migration.c.State_Name,
                                  migration.c.Geo_Lng, 
                                  migration.c.Geo_Lat,
                                  migration.c.Color, 
                                  migration.c.Total) \
                          .filter(migration.c.State_Name == st).order_by(migration.c.Total).limit(lmt).all()
  elif stmtId == 1:
      # filter excludes migration going to the selected state
      #variable limit query results for those leaving, excludes a particular state
      results = db.session.query(migration.c.County_Name,
                                  migration.c.State_Name,
                                  migration.c.Geo_Lng, 
                                  migration.c.Geo_Lat,
                                  migration.c.Color, 
                                  migration.c.Total) \
                          .filter(migration.c.State_Name != st).order_by(migration.c.Total).limit(lmt).all()
  elif stmtId == 2:
    # black, Top 10
    pass
  elif stmtId == 3:
    # white Top 10
    pass
  elif stmtId == 4:
    # asian Top 10
    pass
  elif stmtId == 5:
    # hispanic Top 10
    pass
  elif stmtId == 6:
    # hispanic Top 10
    pass
  migration_routes = []
  for index, res in enumerate(results):
    destination_county = res[0]
    lng = res[2]
    lat = res[3]
    colour = res[4] 
    
    route = OrderedDict()
  
    if index == 0: 
        route = {'from':[-118.2705,33.9984],'to':[lng, lat],'labels':['Los Angeles', destination_county], 'color': "{}".format(colour)}
    else:
        route = {'from':[-118.2705,33.9984],'to':[lng, lat],'labels':['', destination_county], 'color': "{}".format(colour)}

    migration_routes.append(route)

  return make_response(json.dumps(migration_routes))





if __name__ == "__main__":
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///migration.sqlite"

    db = SQLAlchemy(app)

    db.metadata.reflect(db.engine)
    #create tables
    migration = db.metadata.tables['migration']

    #app.run(debug=True)
    app.run()
