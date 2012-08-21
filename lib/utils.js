
module.exports = {
    // Merge two objects
    merge: function(obj1, obj2){
        var r = obj1||{};
        for(var key in obj2){
            r[key] = obj2[key];
        }
        return r;
    }
}