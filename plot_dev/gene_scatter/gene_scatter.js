/**
 * @summary Creates interactive gene weight histograms for ModulomeVis
 * @author Kevin Rychel
 * requires Highcharts, Papa Parse
 */
 
 // edit function below
 // Write Highcharts plot to container (see gene_histogram.js for example)
 function generateGeneScatter(csvContent, container) {
    var data = Papa.parse(csvContent, {dynamicTyping: true}).data;
    
    // basics
    var thresh = data[1][1]
    
    // coordinates
    var coord_data = [];
    for (i = 2; i < data.length; i++) {
        coord_data.push({b_num: data[i][0],
                         name: data[i][1],
                         x: data[i][2], 
                         y: data[i][3],
                         cog: data[i][4],
                         color: data[i][5],
                         link: data[i][6]}); 
    }
    
    // set up the plot
    var chartOptions = {
        title: {
            text: ''
        },
        xAxis: {
            title: {
                text: 'Baseline Expression (log(TPM))'
            },
            crosshair: true,
            startOnTick: false,
            endOnTick: false,
        },
        yAxis: {
            title:{
                text: 'I-modulon Weight',
            },
            crosshair: true,
            startOnTick: false,
            endOnTick: false,
            plotLines: [{
                value: thresh,
                zIndex: 5,
                color: 'black'
            }, {
                value: -thresh,
                zIndex: 5,
                color: 'black'
            }],
        },
        series: [{
            name: 'Genes',
            type: 'scatter',
            data: coord_data,
            turboThreshold: 0, // should optimize better in future
            events: {
                click: function(e) {
                    var link = e.point.link
                    
                    // check if it exists
                    if (link != null) {
                        //sometimes the link is the last word
                        var link_str = link.split(" "); 
                        link = link_str[link_str.length -1]
                        
                        if (link[0] == 'h') {
                            window.location.href = link;
                        } else {
                            window.location.href = 'http://' + link
                        }
                    }
                }
            }
        }],
        tooltip: {
            formatter: function() {
                var tooltip = this.point.b_num + ": <b>"+this.point.name+"</b>";
                tooltip += "<br>Category: "+ this.point.cog;
                tooltip += "<br>Baseline Expression: "+this.point.x.toFixed(3);
                tooltip += "<br>I-modulon Weight: " + this.point.y.toFixed(3);
                return tooltip;
            }
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        exporting: {
            enabled: false
        }
    };

    // make the chart
    var chart = Highcharts.chart(container, chartOptions);
    return;
 };