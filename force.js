let width = document.getElementById("tree").offsetWidth;
let height = document.getElementById("tree").offsetHeight;


// Create a new directed graph
let g = new dagreD3.graphlib.Graph().setGraph({
    rankdir: 'LR', // 水平
    nodesep: 15, // 
    edgesep: 10,
    ranksep: 80,
    marginx: 20,
    marginy: 20
});


let states = {
    "begin": {
    //   style: "fill: #afa; stroke: #222"
    },
    "analyze_insert_mid_zg_proxy_user": {},
    "analyze_insert_mid_zg_order": {},
    "analyze_insert_mid_zg_enquiry": {},
    "analyze_insert_mid_zg_allowance": {},
    "analyze_insert_app_zg_order_deposit": {},
    "analyze_insert_app_zg_enquiry": {},
    "analyze_insert_app_zg_allowance": {},
    "end": {},
};





Object.keys(states).forEach(function(state) {
    var value = states[state];
    value.label = state;
    value.rx = value.ry = 5;
    value.style = "fill: #f1ede4; stroke: #82b784; color: #222; margin: 5px";
    g.setNode(state, value);
});


// Set up the edges
// g.setEdge("begin", "analyze_insert_mid_zg_proxy_user", {
//     label: "",
//     lineInterpolate: 'basis',
//     // style: "fill: none; stroke: #7f7f7f"
// });
// g.setEdge("begin", "analyze_insert_mid_zg_order", {
//     label: "",
//     lineInterpolate: 'basis'
// });
// g.setEdge("begin", "analyze_insert_mid_zg_enquiry", {
//     label: "",
//     lineInterpolate: 'basis'
// });
// g.setEdge("begin", "analyze_insert_mid_zg_allowance", {
//     label: "",
//     lineInterpolate: 'basis'
// });
// g.setEdge("analyze_insert_mid_zg_proxy_user", "analyze_insert_app_zg_order_deposit", {
//     label: "",
//     lineInterpolate: 'basis'
// });
// g.setEdge("analyze_insert_mid_zg_proxy_user", "analyze_insert_app_zg_enquiry", {
//     label: "",
//     lineInterpolate: 'basis'
// });
// g.setEdge("analyze_insert_mid_zg_order", "analyze_insert_app_zg_order_deposit", {
//     label: "",
//     lineInterpolate: 'basis'
// });
// g.setEdge("analyze_insert_mid_zg_order", "analyze_insert_app_zg_enquiry", {
//     label: "",
//     lineInterpolate: 'basis'
// });
// g.setEdge("analyze_insert_mid_zg_enquiry", "analyze_insert_app_zg_order_deposit", {
//     label: "",
//     lineInterpolate: 'basis'
// });
// g.setEdge("analyze_insert_mid_zg_enquiry", "analyze_insert_app_zg_enquiry", {
//     label: "",
//     lineInterpolate: 'basis'
// });
// g.setEdge("analyze_insert_mid_zg_allowance", "analyze_insert_app_zg_allowance", {
//     label: "",
//     lineInterpolate: 'basis'
// });
// g.setEdge("analyze_insert_app_zg_order_deposit", "end", {
//     label: "",
//     lineInterpolate: 'basis'
// });
// g.setEdge("analyze_insert_app_zg_enquiry", "end", {
//     label: "",
//     lineInterpolate: 'basis'
// });
// g.setEdge("analyze_insert_app_zg_allowance", "end", {
//   label: "",
//   lineInterpolate: 'basis'
// });


let render = new dagreD3.render();

// Set up an SVG group so that we can translate the final graph.
let svg = d3.select("#tree").append('svg');
let inner = svg.append("g");
render(inner, g);



// Set up zoom support
let zoom = d3.behavior.zoom().scaleExtent([0.1, 100])
    .on('zoomstart', () => {
        svg.style('cursor', 'move')
    })
    .on("zoom", function() {
        inner.attr('transform',
            "translate(" + d3.event.translate + ")" +
            "scale(" + d3.event.scale + ")"
        )
    }).on('zoomend', () => {
        svg.style('cursor', 'default')
    });
svg.call(zoom);

let timer;
const nodeEnter = inner.selectAll('g.node');



// 圆点添加 提示框
nodeEnter
    .on('mouseover', function(d) {
        tooltipOver(d)
        console.log(d)
    })
    .on('mouseout', () => {
        timer = setTimeout(function() {
            d3.select('.chartTooltip').transition().duration(300).style('opacity', 0).style('display', 'none')
        }, 200)
    });
// 偏移节点内文本内容
// nodeEnter.select('g.label').attr('transform', 'translate(0, 0)');
// 添加 tag 标签
// nodeEnter.append('text')
//     .text((d) => {
//         return d
//     });

function tooltipOver(d) {
    if (timer) clearTimeout(timer);
    d3.select('.chartTooltip').transition().duration(300).style('opacity', 1).style('display', 'block');
    const yPosition = d3.event.layerY + 20;
    const xPosition = d3.event.layerX + 20;
    const chartTooltip = d3.select('.chartTooltip')
        .style('left', xPosition + 'px')
        .style('top', yPosition + 'px');

    d3.select('.chartTooltip').on('mouseover', () => {
        if (timer) clearTimeout(timer);
        d3.select('.chartTooltip').transition().duration(300).style('opacity', 1).style('display', 'block')
    }).on('mouseout', () => {
        timer = setTimeout(function() {
            d3.select('.chartTooltip').transition().duration(300).style('opacity', 0).style('display', 'none')
        }, 200)
    });

    if (d) {
        chartTooltip.select('.chartTooltip-label').text('Task_id：' + d)
    } else {
        chartTooltip.select('.chartTooltip-label').text('label：' + d)
    }
    if (g.node(d).name) {
        chartTooltip.select('.chartTooltip-info').text('名字2：' + g.node(d).name)
    } else {
        chartTooltip.select('.chartTooltip-info').text('名字2：' + g.node(d).name)
    }
}