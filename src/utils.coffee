
module.exports =

  # Merge two objects
  merge: (obj1, obj2) ->
    r = obj1 or {}
    for key of obj2
      r[key] = obj2[key]
    r
