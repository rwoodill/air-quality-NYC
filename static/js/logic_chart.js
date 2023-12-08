//set chart element
const ctx = document.getElementById('myChart');
var chart_labels = []
var chart_data = []
var chartid_text = ''
function get_chart_data(geoid,chartid) {
    let chartid_text = chartid
    var url = `/api/get_chart_data/chart?geoid=${geoid}&chartid=${chartid}`
    //console.log(url)
    d3.json(`/api/get_chart_data/chart?geoid=${geoid}&chartid=${chartid}`).then((data) => {
        //console.log(data)
        let time = data.jsonarray.map(function(e) {
            chart_labels.push(e.time)
            return e.time;
        });
        console.log(chart_labels)
        let set = data.jsonarray.map(function(e) {
            chart_data.push(e.value)
            return e.value;
        });
        console.log(chart_data)
    });
}
for (let i =1; i<6; i++){
    var geoid = i 
    const chartid = 'asthma'
    let chart_config = {
        type:'line',
        labels : chart_labels,
        data: {
            datasets: chart_data,
            label: chartid_text
        },
    }
    console.log(chart_config)
}


var mixedChart = new Chart(ctx, chart_config);


 