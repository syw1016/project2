#using sample dataset to play around with plotly, d3, and flask shit

#first, create the outline for the flask app


##importing packages and dependencies
from flask import Flask,jsonify,render_template
##initializing the app
app=Flask(__name__)

##creating routes
@app.route('/')
def home():
	return render_template('index.html')


@app.route('/view1')
def firstView():
	return render_template('view1-test.html')

if __name__ == "__main__":
    app.run(debug=True)
