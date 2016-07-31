function pageIsLoaded() {
	uiInit();
	d3ProjectInit();
}

function uiInit() {

}

// project initialization function
function d3ProjectInit() {
    
    d3.csv("data/cpi2015.csv", function(error, nodes) {
    if (error) throw error;
        
    var nodeById = {};

    nodes.forEach(function(d) {
        nodeById[d.ID] = d;
        d.name = d.Expenditure_Category;
        delete d.Expenditure_Category;
        d.size = d.CPI_W;
        delete d.CPI_W;
        delete d.CPI_U;
    });

    nodes.forEach(function(d) {
        if (d.Parent != -1) {
        var parent = nodeById[d.Parent];
        if (parent.children) parent.children.push(d);
        else parent.children = [d];
        }
    });
    
    cpiFlare = nodes[0];
        
    sunburstChart = new D3WRAP.ZoomableSunburst("#chart1", cpiFlare, {});
        
    });
};