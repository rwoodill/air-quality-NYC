//-------------------------------------------------------------------------------------------------
// function to render the jupyter notebook on dropdown select
//-------------------------------------------------------------------------------------------------

function renderJupyterNotebook(){
    d3.select("#example-content").appendHTML("data_analysis.html");
}
renderJupyterNotebook();