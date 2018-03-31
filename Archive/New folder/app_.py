from flask import Flask, render_template, jsonify

app = Flask(__name__)

@app.route('/hvi')
def hvi():
  return render_template('hvi.html')

@app.route('/income')
def income():
  return render_template('income.html')

if __name__ == "__main__":
    app.run(debug=True)