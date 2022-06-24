    // returns true if the line from (a,b)->(c,d) intersects with (p,q)->(r,s) !!!! NOT FOR A LINE SEGMENT BUT FOR A LINE


function main(){
    
    var cy = cytoscape({
	  container: document.getElementById('cy'),
	    style: [
		{
		    selector: 'node',
		    style: {
			shape: 'circle',
			'background-color': 'blue',
			label: 'data(id)',
			
		    }
		}]      
	});
	const N=document.getElementById('N').value;
	const p = document.getElementById('prob').value;
	const seed = document.getElementById('seed').value;
	let random_type;
        const radioButtons = document.querySelectorAll('input[name="random_type"]');
        for (const radioButton of radioButtons) {
                if (radioButton.checked) {
                    random_type = radioButton.value;
                    break;
                }
            }
	let Nodes,Edges;
	Nodes,Edges=gen_graph(cy,N,p,seed,random_type)
	var edgetext=document.getElementById('edges');
	edgetext.textContent=String(Edges.length)+"and 3*V-6="+String(3*N-6);
	cy.layout({
		name: 'circle',
		animate:false,
		}).run();
	let drag_count=0
	var moves=document.getElementById('moves')
	moves.textContent=drag_count
	cy.on('dragfree', 'node', function(evt)
	{
		drag_count=drag_count+1
		var node = evt.target
		cy.ready(function () { // Wait for cytoscape to actually load and map eles	
		    var POINTS=[]
		    cy.nodes().forEach(function(ele) { // Your function call inside
			  POINTS.push(new Point(ele.position().x,ele.position().y))
		    	});
		    let lines=[]
		    for (var i = 0 ; i < N ; i++){
		    	for (var j = 0 ; j<N ; j++){
		    		if (i!=j)
		    		{
		    			if (Edges.includes(i+"--"+j))
		    			{
		    				if (POINTS[i].x<POINTS[j])
		    					lines.push([POINTS[i],POINTS[j],i,j])
						else		
							lines.push([POINTS[j],POINTS[i],j,i])
		    			}
		    		}
		    	}
		    }
			bubbleSort(lines);
			console.log(lines);
			let intersecting=[];
			for(var i=0;i<lines.length;i++)
			{
				for (var j=0;j<lines.length;j++)
				{
					if (i!=j)
					{
						if( lines[j].includes(lines[i][2]) || lines[j].includes(lines[i][3])){
							break;}
						if( lines[i].includes(lines[j][2]) || lines[i].includes(lines[j][3])){
							break;}	
						intersect=doIntersect(lines[i][0],lines[i][1], lines[j][0],lines[j][1])
						intersecting.push(intersect)
					}
				}
			}
			if (intersecting.includes(true)!=true){
				var res=document.getElementById('result')
				res.textContent="Solved"
				cy.style()
			  .clear() // start a fresh stylesheet without even the default stylesheet

			  // define all basic styles for node
			  .selector('node')
			    .style({
				'background-color':'green',
				label: 'data(id)'
				})
			    

			  // define all basic styles for edge
			  .selector('edge')
			      .style({
			      'width': 3,
			      'line-color': 'green'
			    })
			}
		});
		var moves=document.getElementById('moves')
		moves.textContent=drag_count
	});
	
	function bubbleSort(arr){
	    
	  var i, j;
	  var len = arr.length;
	 //   console.log(len)
	  var isSwapped = false;
	    
	  for(i =0; i < len; i++){
	      
	    isSwapped = false;
	      
	    for(j = 0; j < len-1; j++){
	   // 	console.log(j,arr[j+1][0].x,arr.length)
		if(arr[j][0].x > arr[j + 1][0].x){
		  var temp = arr[j]
		  arr[j] = arr[j+1];
		  arr[j+1] = temp;
		  isSwapped = true;
		}
	    }
	      
	    // IF no two elements were swapped by inner loop, then break 
	      
	    if(!isSwapped){
	      break;
	    }
	  }
	    
	  // Print the array
	 // console.log(arr)
	}
  
	
//	console.log(cy.getElementById('1').position().x)
	//var weight = cy.nodes().data("weight"
//	console.log(cy.nodes().positions())
	

	function intersects(a,b,c,d,p,q,r,s) {
	  var det, gamma, lambda;
	  det = (c - a) * (s - q) - (r - p) * (d - b);
	  if (det === 0) {
	    return false;
	  } else {
	    lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
	    gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
	    return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
	  }
	};	
}

	class Point
	{
	    constructor(x, y)
	    {
		this.x = x;
		    this.y = y;
	    }
	}
	 
	// Given three collinear points p, q, r, the function checks if
	// point q lies on line segment 'pr'
	function onSegment(p, q, r)
	{
	    if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
		q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y))
	    return true;
	   
	    return false;
	}
	 
	// To find orientation of ordered triplet (p, q, r).
	// The function returns following values
	// 0 --> p, q and r are collinear
	// 1 --> Clockwise
	// 2 --> Counterclockwise
	function orientation(p, q, r)
	{
	 
	    // See https://www.geeksforgeeks.org/orientation-3-ordered-points/
	    // for details of below formula.
	    let val = (q.y - p.y) * (r.x - q.x) -
		    (q.x - p.x) * (r.y - q.y);
	   
	    if (val == 0) return 0; // collinear
	   
	    return (val > 0)? 1: 2; // clock or counterclock wise
	}
	 
	// The main function that returns true if line segment 'p1q1'
	// and 'p2q2' intersect.
	function doIntersect(p1, q1, p2, q2)
	{
	 
	    // Find the four orientations needed for general and
	    // special cases
	    let o1 = orientation(p1, q1, p2);
	    let o2 = orientation(p1, q1, q2);
	    let o3 = orientation(p2, q2, p1);
	    let o4 = orientation(p2, q2, q1);
	   
	    // General case
	    if (o1 != o2 && o3 != o4)
		return true;
	   
	    // Special Cases
	    // p1, q1 and p2 are collinear and p2 lies on segment p1q1
	    if (o1 == 0 && onSegment(p1, p2, q1)) return true;
	   
	    // p1, q1 and q2 are collinear and q2 lies on segment p1q1
	    if (o2 == 0 && onSegment(p1, q2, q1)) return true;
	   
	    // p2, q2 and p1 are collinear and p1 lies on segment p2q2
	    if (o3 == 0 && onSegment(p2, p1, q2)) return true;
	   
	    // p2, q2 and q1 are collinear and q1 lies on segment p2q2
	    if (o4 == 0 && onSegment(p2, q1, q2)) return true;
	   
	    return false; // Doesn't fall in any of the above cases
	}
function gen_graph(cy,N,p,Seed,Random){
	if (Random<0)
	{
		var seed = cyrb128(Seed);
		var rand = mulberry32(seed[0]);
	}
	else
		var rand= Math.random;
	
	cy.removeData();
	let Nodes=[];
	let Edges=[];

	for (var i = 0; i < N; i++) {
	Nodes.push(i)
	cy.add({data: { id: String(i) },"group": "nodes" });}
	
	for (var i = 0; i < N; i++) {
		for (var j=0;j<N;j++){
		if (i!=j){
			if (rand()<p)
			{
			Edges.push(i+"--"+j);
				cy.add({
					data: {
						id: i+"--"+j,
						source: String(i),
						target: String(j),
						}
					});
				}
			}
		}	
	};
	return(Nodes,Edges)
}
function cyrb128(str) {
	//See https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
    let h1 = 1779033703, h2 = 3144134277,
        h3 = 1013904242, h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
        k = str.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    return [(h1^h2^h3^h4)>>>0, (h2^h1)>>>0, (h3^h1)>>>0, (h4^h1)>>>0];
}


function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}
