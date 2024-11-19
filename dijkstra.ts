class GraphNode {
	label: string;
	neighbours = new Map<GraphNode, number>();
	visited = false;
	previous?: GraphNode;
	bestDistance = Infinity;

	constructor(label: string) {
		this.label = label;
	}

	static addEdge(node1: GraphNode, node2: GraphNode, weight: number) {
		node1.neighbours.set(node2, weight);
		node2.neighbours.set(node1, weight);
	}
}

class Graph {
	nodes: GraphNode[];
	constructor(...nodes: GraphNode[]) {
		this.nodes = nodes;
	}

	dijkstra(source: GraphNode) {
		this.nodes.forEach((node) => {
			node.previous = undefined;
			node.visited = false;
			if (node === source) node.bestDistance = 0;
			else node.bestDistance = Infinity;
		});

		while (this.nodes.some(node => !node.visited)) {
			const unvisited = this.nodes.filter(node => !node.visited);
			const currentNode = unvisited.sort((a, b) => a.bestDistance - b.bestDistance)[0];
			currentNode.neighbours.forEach((weight, neighbour) => {
				if (currentNode.visited) return;
				const newDistance = currentNode.bestDistance + weight;
				if (newDistance < neighbour.bestDistance) {
					neighbour.bestDistance = newDistance;
					neighbour.previous = currentNode;
				}
			});
			currentNode.visited = true;
		}
		const result = new Map<string, number>();
		this.nodes.forEach(node => result.set(node.label, node.bestDistance));
		return result;
	}

	shortestPath(source: GraphNode, target: GraphNode) {
		this.dijkstra(source);
		const path: GraphNode[] = [target];
		let currentNode = target;
		while (currentNode.previous) {
			path.push(currentNode.previous);
			currentNode = currentNode.previous;
		};
		return { path: path.reverse(), distance: target.bestDistance };
	};
}

const A = new GraphNode('A');
const B = new GraphNode('B');
const C = new GraphNode('C');
const D = new GraphNode('D');
const E = new GraphNode('E');
const F = new GraphNode('F');
const G = new GraphNode('G');
const H = new GraphNode('H');

GraphNode.addEdge(A, B, 2);
GraphNode.addEdge(A, C, 10);
GraphNode.addEdge(B, D, 3);
GraphNode.addEdge(C, D, 6);
GraphNode.addEdge(B, E, 9);
GraphNode.addEdge(D, G, 11);
GraphNode.addEdge(E, F, 5);
GraphNode.addEdge(D, G, 7);
GraphNode.addEdge(C, G, 8);
GraphNode.addEdge(F, H, 6);
GraphNode.addEdge(G, H, 1);

const graph = new Graph(A, B, C, D, E, F, G, H);
const result = graph.shortestPath(A, H);
console.log(graph.dijkstra(A));
console.log(`${result.path.map(node => node.label).join(' -> ')}, distance: ${result.distance}`);
