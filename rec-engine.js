// Many of the big companies are using graph-theoretic data structures to keep you hooked. LinkedIn's "how you're connected"
//Facebook's people you may know
//Graphs are a way to model complex relationships between many objects
// A graph exists as a collection of nodes (also known as vertices) and edges.
// A node is merely an abstract data point — it could represent anything. A person, a computer, a building, an intersection… or whatever you’d like
// An edge connects two nodes and can optionally be directional

let joe = {type: 'node', properties: {name: 'joe'}, input: [], output: []};
let likes = {type: 'edge', properties: {name: 'likes'}, input: null, output: null};
let minecraft ={type: 'node', properties: {name: 'minecraft'}, input: [], output: []};

joe.output.push(likes);
likes.input = joe;
likes.output = minecraft;
minecraft.input.push(likes);

// Define base prototype for shared behaviour between Nodes and Edges
// We need this unit to be able to specify an entity (what classification the object is??? person or game or road)
// And have properties and methods related to setting and retrieving these properties

class Unit {

    //the constructor function is called automatically when an instance of the class is created
    constructor(entity, properties) {
        this.entity = entity + '';
        this.load(properties || {});
    }

    load(properties) {
        let p = Object.create(null);

        Object.keys(properties).forEach(function(v) {
            p[v] = properties[v];
        });

        this.properties = p;

        return this;
    }

    set(property, value) {
        return this.properties[property] = value;
    }

    unset(property) {
        return delete this.properties[property];
    }

    has(property) {
        return Object.prototype.hasOwnProperty.call(this.properties, property);
    }

    get(property) {
        return this.properties[property];
    }

    toString() {
        return [this.constructor.name, ' (', this.entity, ' ', JSON.stringify(this.properties)]
    }

}

class Node extends Unit {

    constructor(entity, properties) {

        super(entity, properties);
        this.edges = [];
        this.inputEdges = [];
        this.outputEdges = [];

    }

    //Node where we keep track of all edges, input edges, and output edges - for directionality
    //Unlink - remove all connected edges

    unlink() {

        let edges = this.edges;

        for(let i = 0, len = edges.length; i < len; i++) {
            edges[i].unlink();
        }

        return true;

    }
}

// In our edge we hold an inputNode and outputNode and whether or not the edge is a duplex link (bi-directional)
class Edge extends Unit {

    constructor(entity, properties) {

        super(entity, properties);

        this.inputNode = null;
        this.outputNode = null;
        this.duplex = false;

        this.distance = 1;

    }

    _linkTo(node, direction) {

        if ( direction <= 0 ) {
            node.inputEdges.push(this);
        }

        if (direction >= 0) {
            node.outputEdges.push(this);
        }

        node.edges.push(this);

        return true;
    }

    link(inputNode, outputNode, duplex) {

        this.unlink();

        this.inputNode = inputNode;
        this.outputNode = outputNode;
        this.duplex = !!duplex;

        if (duplex) {
            this._linkTo(inputNode, 0);
            this._linkTo(outputNode, 0);
            return this;
        }

        this._linkTo(inputNode, 1);
        this._linkTo(outputNode, -1);
        return this;

    }

    setDistance(v) {
        this.distance = Math.abs(parseFloat(v) || 0);
        return this;
    }

    setWeight(v) {
        this.distance = 1 / Math.abs(parseFloat(v) || 0);
        return this;
    }

    oppositeNode(node) {
        if (this.inputNode === node) {
            return this.outputNode;
        } else if (this.outputNode === node) {
            return this.inputNode;
        }

        return;
    }

    unlink() {
        let pos;
        let inode = this.inputNode;
        let onode = this.outputNode;

        if(!(inode && onode)) {
            return;
        }

        (pos = inode.edges.indexOf(this)) > -1 && inode.edges.splice(pos, 1);
        (pos = onode.edges.indexOf(this)) > -1 && onode.edges.splice(pos, 1);
        (pos = inode.outputEdges.indexOf(this)) > -1 && inode.outputEdges.splice(pos, 1);
        (pos = onode.inputEdges.indexOf(this)) > -1 && onode.inputEdges.splice(pos, 1);

        if (this.duplex) {

          (pos = inode.inputEdges.indexOf(this)) > -1 && inode.inputEdges.splice(pos, 1);
          (pos = onode.outputEdges.indexOf(this)) > -1 && onode.outputEdges.splice(pos, 1);

        }

        this.inputNode = null;
        this.outputNode = null;

        this.duplex = false;

        return true;

        }

    }
}
