//const { config } = require("module");

//set chart element
const ctx = document.getElementById('myChart');

var chart_labels = []
var chart_data = []

let config = {
    data: {
        datasets: [{
            type: 'bar',
            label: 'Bar Dataset',
            data: [10, 20, 30, 40]
        }, {
            type: 'line',
            label: 'Line Dataset',
            data: [50, 50, 50, 50],
        }],
        labels: ['January', 'February', 'March', 'April']
    },
}

for (let i =1; i<2; i++){
    var geoid = i 
    chartid = 'asthma'
    var url = `/api/get_chart_data/chart?geoid=${geoid}&chartid=${chartid}`
    d3.json(url).then((data) => {
        for (let i =1; i < Object.keys(data).length; i++){
            chart_labels.push(data[i].Time)
            chart_data.push(data[i].Value)
        }
    });
    console.log(chart_config)
};


chart_config.push(config)

const mixedChart = new Chart(ctx, config);

