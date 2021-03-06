

function renderGraphChart(data,extendConfig = {}, elId = '#tree'){
    // 节点数据
    this.NodeList = {...extendConfig}
    // 关系数据
    this.edgeList = data;
    this.elId = elId;
    this.defaultStyle = 'fill: #f1ede4; stroke: #82b784; color: #222; margin: 5px';
    // 筛选不包含在extendConfig中的节点
    this.mregeEdgeNode()
    // 渲染节点
    this.renderNode()
    // 添加鼠标经过事件
    this.addMouseover()
}

// 储存关系数据中的node节点
renderGraphChart.prototype.mregeEdgeNode = function () {
    this.edgeList.forEach(item => {
        const { from, to} = item;
        !this.NodeList[from] && (this.NodeList[from] = {});
        !this.NodeList[to] && (this.NodeList[to] = {});
    })
}
// 渲染节点
renderGraphChart.prototype.renderNode = function () {

    this.g = new dagreD3.graphlib.Graph().setGraph({
        rankdir: 'LR', // 水平
        nodesep: 15,
        edgesep: 10,
        ranksep: 80,
        marginx: 20,
        marginy: 20
    });

    // 创建Node节点
    Object.keys(this.NodeList).forEach((key) =>  {
        var item = this.NodeList[key];
        const label = item.label || key;
        const style = item.style || this.defaultStyle;
        this.g.setNode(key, { label, rx:5,ry:5, style});
    });

    // 创建线条
    list.forEach(item => {
        const { from, to} = item;
        this.g.setEdge(from, to, { lineInterpolate: 'basis'});
    })

    // 渲染节点
    let render = new dagreD3.render();
    let svg = d3.select(this.elId).append('svg');
    this.inner = svg.append("g");
    render(this.inner, this.g);


    // 添加缩放
    const zoom = d3.behavior.zoom().scaleExtent([0.1, 100])
    .on('zoomstart', () => svg.style('cursor', 'move'))
    .on("zoom", () => this.inner.attr('transform',"translate(" + d3.event.translate + ")" + "scale(" + d3.event.scale + ")"))
    .on('zoomend', () => svg.style('cursor', 'default'));
    svg.call(zoom);

}

// 添加鼠标经过事件
renderGraphChart.prototype.addMouseover = function () {
    const { inner, NodeList } = this;
    const nodeEnter = inner.selectAll('g.node');
    nodeEnter.on('mouseover', (key) =>  {
            // 事件处理
            NodeList[key].info && this.tooltipOver(key)
            // 上下游颜色事件
            NodeList[key] && this.showRelated(key)
        })
        .on('mouseout', (key) => {
            // 上下游颜色事件
            NodeList[key] && this.hideRelated(key)
            this.timer = setTimeout(function() {
                d3.select('.chartTooltip').transition().duration(300).style('opacity', 0).style('display', 'none')
            }, 200)
        });
}

// 执行事件
renderGraphChart.prototype.tooltipOver = function(key){
    let { timer, NodeList  } = this
    timer && clearTimeout(timer);
    if (NodeList[key].info) {
        d3.select('.chartTooltip').transition().duration(300).style('opacity', 1).style('display', 'block');
        // 设置位置
        const node = this.g.node(key);
        const { width, height} = node.elem.getBBox();
        const xPosition = node.x + width/2 + 10;
        const yPosition = node.y- height/2;
        const chartTooltip = d3.select('.chartTooltip').style('left', xPosition + 'px').style('top', yPosition + 'px');

        chartTooltip.select('.chartTooltip-label').text(NodeList[key].info)
        d3.select('.chartTooltip').on('mouseover', () => {
            if (this.timer) clearTimeout(this.timer);
            d3.select('.chartTooltip').transition().duration(300).style('opacity', 1).style('display', 'block')
        }).on('mouseout', () => {
            this.timer = setTimeout(function() {
                d3.select('.chartTooltip').transition().duration(300).style('opacity', 0).style('display', 'none')
            }, 200)
        });
    }
}

renderGraphChart.prototype.showRelated = function(key){
    d3.select(this.g.node(key).elem).selectAll("rect").style({fill: '#FEF0F0'})
    const hoverStyle = {
            stroke: 'red'
          };
    const nodeList = this.g.predecessors(key).concat(this.g.successors(key))
    nodeList.forEach(item => {
        const node = this.g.node(item);
        d3.select(node.elem).selectAll("rect").style(hoverStyle)
    })
}

renderGraphChart.prototype.hideRelated = function(key){
    d3.select(this.g.node(key).elem).selectAll("rect").style({fill: '#f1ede4'})
    const defaultStyle = {
            stroke: '#82b784'
          };
    const nodeList = this.g.predecessors(key).concat(this.g.successors(key))
    nodeList.forEach(item => {
        const node = this.g.node(item);
        d3.select(node.elem).selectAll("rect").style(defaultStyle)
    })
}


const NodeInfo = {
    'begin':{
        style:'fill: red; stroke: red;',
        label:'开始',
        info:'11111'
    },
    'end':{
        label:'结束',
        info:'22222'
    },
};

const list = [
    {from:'begin',to:'analyze_insert_mid_zg_proxy_user'},
    {from:'begin',to:'analyze_insert_mid_zg_order'},
    {from:'begin',to:'analyze_insert_mid_zg_enquiry'},
    {from:'begin',to:'analyze_insert_mid_zg_allowance'},
    {from:'analyze_insert_mid_zg_proxy_user',to:'analyze_insert_app_zg_order_deposit'},
    {from:'analyze_insert_mid_zg_proxy_user',to:'analyze_insert_app_zg_enquiry'},
    {from:'analyze_insert_mid_zg_order',to:'analyze_insert_app_zg_order_deposit'},
    {from:'analyze_insert_mid_zg_order',to:'analyze_insert_app_zg_enquiry'},
    {from:'analyze_insert_mid_zg_enquiry',to:'analyze_insert_app_zg_order_deposit'},
    {from:'analyze_insert_mid_zg_enquiry',to:'analyze_insert_app_zg_enquiry'},
    {from:'analyze_insert_mid_zg_allowance',to:'analyze_insert_app_zg_allowance'},
    {from:'analyze_insert_app_zg_order_deposit',to:'end'},
    {from:'analyze_insert_app_zg_enquiry',to:'end'},
    {from:'analyze_insert_app_zg_allowance',to:'end'},
    {from:'end',to:'aaa'},
    {from:'aaa',to:'end'},
];



// 第二自定义样式、第三个参数DOM选择器  非必选
// new renderGraphChart(list)
new renderGraphChart(list,NodeInfo)
// new renderGraphChart(list,NodeInfo,'#tree')