// this graph is represented entirely in memory (RAM)

let users = getUsers();
let listings = getListings();
let views = getViews();
let favorites = getFavorites();
let requests = getRequests();

function getNodeById(nodes, id) {
    return nodes.filter(function(node) {
        return node.get('id') === id;
    })[0];
}

users = users.map(function(user) {
    return new Node('user', user);
});

listings = listings.map(function(listing) {
    return new Node('listing', listing);
});

views = views.map(function(view) {
    return new Edge('view')
        .link(getNodeById(users, view.user_id), getNodeById(listings, view.listing_id));
});

favorites = favorites.map(function(favorites) {
    return new Edge('favorite')
        .link(getNodeById(users, favorite.user_id), getNodeById(listings, favourite.listing_id));
});

requests = request.map(function(request) {
    return new Edge('request')
        .link(getNodeById(users, request.user_id), getNodeById(listings, request.listing_id));
});
