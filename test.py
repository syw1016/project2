import sqlite3

sqlite_file='/Users/monaderakhshan/Git_Repo/Data_Analytics_Assignments/PROJECT 2/project2_db_TEST.sqlite'
conn = sqlite3.connect(sqlite_file)
c = conn.cursor()
c.execute('select * from us_cities')
results = c.fetchall()

cities_df=pd.read_sql_query('select * from us_cities',conn)
citiesUS = cities_df.iloc[1:]
