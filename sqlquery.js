function getQueryResults(stmtId, st, callback){
    const sqlite3 = require('sqlite3').verbose();
    let db = new sqlite3.Database('./project2/migration.sqlite', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
    });
    //
    var currRow = 0, results = [], sql;
    if(stmtId===0){
        // all going a particular state
        sql = `SELECT County_Name, State_Name,
                        Geo_Lng, Geo_Lat,
                        Color, Total
                    FROM migration
                    WHERE State_Name = ?
                    ORDER BY Total ASC`;
    }
    else if(stmtId===1){
        // variable limit query results for those leaving, excludes a particular state
        sql = `SELECT County_Name, State_Name,
                        Geo_Lng, Geo_Lat,
                        Color, Total
                    FROM migration
                    WHERE State_Name != ?
                    ORDER BY Total ASC
                    LIMIT ?`;
    }
    else if(stmtId===2){
        // variable limit query results for those going to a particular state
        sql = `SELECT County_Name, State_Name,
                        Geo_Lng, Geo_Lat,
                        Color, Total
                    FROM migration
                    WHERE State_Name = ?
                    ORDER BY Total DESC
                    LIMIT ?`;
    }        
    else if(stmtId===3){
        // variable limit query results for those coming from a particular state
        sql = `SELECT County_Name, State_Name,
                        Geo_Lng, Geo_Lat,
                        Color, Total
                    FROM migration
                    WHERE State_Name = ? AND Total > 0
                    ORDER BY Total DESC
                    LIMIT ?`;
    }
    
    db.each(sql, [st, 20], (err, row) => {
        if (err) {
            throw err;
        }
        var elem = {};
        if(currRow===0){
            elem['from'] = [-118.2705, 33.9984]; elem['to']= [row.Geo_Lng, row.Geo_Lat]; elem['labels']= ['Los Angeles', row.County_Name]; elem['color']= row.Color;
        }
        else{
            elem['from'] = [-118.2705, 33.9984]; elem['to']= [row.Geo_Lng, row.Geo_Lat]; elem['labels']= [null, row.County_Name]; elem['color']= row.Color;
        }
        results[currRow]=elem; currRow = currRow+1; //console.log(elem); 
    },
    (err, count)=>{
        console.log(count + ' records found.'); callback(results);
        // close the database connection
        db.close((err) => {
            if (err) {
            return console.error(err.message);
            }
            console.log('database connection closed.');
        });
    });
};

getQueryResults(1, "Alabama", function(results){
    var data = results;console.log(data);
});