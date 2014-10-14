var queryInterval = 1000

function Http(){
  return {
    get: function(url, cb){
      return $.get(url, cb)
    },
    post: function(url, body, successCb){
      return $.post(url, body, successCb)
    }
  }
}

function Drawer(canvas){

  var drawPoint = function(point, index){
    var x = parseInt(point[0]), y = parseInt(point[1])
    if (index == 0) {
      canvas.moveTo(x,y)
    } else {
      canvas.lineTo(x,y)
      canvas.stroke()
    }
  }

  this.draw = function(action){
    if (!action || !action.path) return
    canvas.lineWidth = parseInt(action.weight)
    canvas.strokeStyle = action.color
    canvas.beginPath()

    action.path.forEach(drawPoint)
  }
  return this
}

function Loader(){
  var http = new Http()
  var lastQuery = 0

  var updateStamp = function(){
    lastQuery = new Date().valueOf()
  }

  this.watch = function(cb){
    setInterval(function(){
      http.get('draw-actions/after/'+lastQuery, function(res){
        updateStamp()
        cb(res)
      })
    }, queryInterval)
  }

  this.loadAll = function(cb){
    http.get('draw-actions', function(res){
      updateStamp()
      cb(res)
    })
  }

  return this
}

var init = function(){
  var $window = $(window)
  var content = $('#content'),
      height = $window.height(),
      width = $window.width()
  
  if (width < 100 ||  height < 100) {
    console.log('too small', width, height)
    return setTimeout(init, 100)
  }

  content.width(width)
  content.height(height)
  
  var canvas = '<canvas id="canvas" width="'+content.width()+'" height="'+content.height()+'"></canvas>'
  content.html(canvas)

  drawer = new Drawer($('#canvas')[0].getContext('2d'))
  loader = new Loader()

  var drawActions = function(actions){
    actions.forEach(function(action){
      drawer.draw(action)
    })
  }

  loader.loadAll(drawActions)
  loader.watch(drawActions)
}

$(document).ready(init)