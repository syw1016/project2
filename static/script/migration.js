/*window.onload
{
    var sampleNames = document.getElementById("selDataset");
    var na = ['Select filter', 'All', 'Top 10 (CA only)', 'Top 10 (CA Excluded)'];
    
    na.forEach(function(e, i){
        var option = document.createElement("option")
        if(i===0){
            option.defaultSelected=true
        }
        option.value = i - 2;
        option.label = e;
        sampleNames.append(option);
    });

}*/

function optionChanged(filter) {
    stmtId =  filter
    st = 'California'
    var url;
    /*if (stmtId === 0){
        //map.setView(new L.LatLng(36.967445614932274, -120.25879949331284), 6);
        lrmap = L.map('map').setView([36.96, -120.258], 6);
        migrationLayer.addTo(lrmap);
    }
    if (stmtId > 0 || stmtId < 0){
        //map.setView(new L.LatLng(36.680163428476966, -93.94777476787567), 5);
        lrmap = L.map('map').setView([36.68, -93.94], 5);
        migrationLayer.addTo(lrmap);
    }*/
    if (stmtId===2){

    }
    else if(stmtId!='-1'){
        url = '/migration/'+ stmtId +'/'+ st
    }
    else{
        url = '/migration/'+ stmtId
    }
    d3.queue()
        .defer(d3.request, url)
        .await(analyze);
}

function analyze(err, sqlResults){
    if(err) { console.log(err)};
    newData = JSON.parse(sqlResults.response)
    migrationLayer.setData(newData) 
    console.log(newData)
}