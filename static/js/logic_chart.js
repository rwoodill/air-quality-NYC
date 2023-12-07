//set chart element
const ctx = document.getElementById('myChart');

function get_chart_data(coordinates) {
    //let queryURL = buildAQURL("20050101", "20051231", API_KEY, EMAIL);
    d3.json(`/api/get_chart_data/${coordinates}`).then((data) => {
      let jsonData = JSON.stringify(data);
      return(jsonData, 'all_aq_data.json', 'application/json');
    });
  }

let chart_datasets = []
stations = [{'name':'1','coordinates': [-73.902, 40.816]},
            {'name':'2','coordinates': [-73.96661, 40.75912]},
            {'name':'3','coordinates': [-78.84984, 42.8273]},
            {'name':'4','coordinates': [-73.8589, 44.39308]},
            {'name':'5','coordinates': [-73.92769, 40.69454]},
            {'name':'6','coordinates': [-79.00106, 43.08218]},
            {'name':'7','coordinates': [-73.82153, 40.73614]},
            {'name':'8','coordinates': [-78.91859, 42.98844]},
            {'name':'9','coordinates': [-74.19832, 40.58027]},
            {'name':'10','coordinates': [-73.05754, 40.82799]},
            {'name':'11','coordinates': [-73.87809, 40.8679]},
            {'name':'12','coordinates': [-73.756511, 42.640931]},
            {'name':'13','coordinates': [-74.15178, 40.58056]},
            {'name':'14','coordinates': [-77.20978, 42.09142]},
            {'name':'15','coordinates': [-78.89926, 42.99813]},
            {'name':'16','coordinates': [-73.88083, 40.86585]},
            {'name':'17','coordinates': [-77.54817, 43.14618]},
            {'name':'18','coordinates': [-73.84757, 40.7842]},
            {'name':'19','coordinates': [-73.68909, 42.73194]},
            {'name':'20','coordinates': [-78.809526, 42.876907]}]
for (let i = 0; i < stations.length; i++) {
    var coor = get_chart_data(stations[i].coordinates)
    data_dict={
        type: 'line',
        label: stations[i].name,
        data: [50, 50, 50, 50],
    }
    chart_datasets.push(stations[i].coordinates)
}

const mixedChart = new Chart(ctx, {
    data: {
        datasets: chart_datasets,
        labels: chart_labels
    },
    options: {
        scales: {
            x: {
                type: 'time',
                time: {
                    displayFormats: {
                        quarter: 'MMM YYYY'
                    }
                }
            }
        }
    }
});
 