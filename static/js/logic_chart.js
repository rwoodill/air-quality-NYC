//const { config } = require("module");
// console.log('test')
function generateChartdata(chartid){
    var chart_dataset = []
    var line_label = []
    var chart_labels = []
    var url1 = `/api/get_chart_data/chart?geoid=1&chartid=${chartid}`
    d3.json(url1).then((data) => {
        for (let i = 1; i < Object.keys(data).length; i++){
            chart_labels.push(data[i].Time)
        }});

    for (let i =1; i<6; i++){
        var geoid = i 
        var data_temp = []
        var label_temp = []
        var url = `/api/get_chart_data/chart?geoid=${geoid}&chartid=${chartid}`
        d3.json(url).then((data) => {
            for (let i = 1; i < Object.keys(data).length; i++){
                data_temp.push(data[i].Value)
                line_label = data[i].Geography
            }
        var dataset = {
            type: 'line',
            label: line_label,
            data: data_temp
        }
        chart_dataset.push(dataset)
        data_temp = []
        });
    };

    let config = {
        data: {
            datasets: chart_dataset,
            labels: chart_labels
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: chartid
                }
            }
        }
    }
    return config
}
//set chart element
for (let j =1; j<4; j++){
    if (j === 1){
        chartid = 'asthma'
    } else if (j === 2){
        chartid = 'fineparticles'
    } else if (j === 3){
        chartid = 'nox'
    }

    const ctx = document.getElementById(`myChart${j}`);
    var config = generateChartdata(chartid)
    // console.log(ctx, config)
    const asthmaChart = new Chart(ctx, config);
}


