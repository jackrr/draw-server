var STROKE_COLOR = '#ffffff'

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

function Drawer(){
  var action, canvas, http, active

  var printEvent = function(e){
    console.log(e)
  }

  var touchStart = function(e){
    startAction(e.touches[0])
  }

  var startAction = function(e){
    active = true
    action = new DrawAction(http, canvas)
    action.initPath(e.pageX, e.pageY)
  }

  var touchMove = function(e){
    if (active) {
      moveAction(e.touches[0])
    }
  }

  var moveAction = function(e){
    if (active) {
      action.addToPath(e.pageX, e.pageY)
    }
  }

  var touchEnd = function(e){
    if (e.touches.length) {
      endAction(e.touches[0])
    } else {
      active = false
      action.send()
    }
  }

  var endAction = function(e){
    active = false
    action.addToPath(e.pageX, e.pageY)
    action.send()
  }

  this.watch = function(_http, element){
    http = _http
    canvas = element[0].getContext('2d')
    if (navigator.userAgent.match(/iphone|Android/ig)) {
      element[0].addEventListener('touchstart', touchStart)
      element[0].addEventListener('touchend', touchEnd)
      element[0].addEventListener('touchmove', touchMove)
    } else {
      element.mousedown(startAction)
      element.mousemove(moveAction)
      element.mouseup(endAction)
    }
  }

  return this
}

function DrawAction(http, canvas){
  var self = this
  this.color = STROKE_COLOR
  this.weight = 1
  this.user = 0


  this.addToPath = function(x,y){
    this.path.push([x,y])
    canvas.lineTo(x,y)
    canvas.stroke()
  }

  this.initPath = function(x,y){
    this.path = [[x,y]]
    canvas.beginPath()
    canvas.moveTo(x,y)
    canvas.lineWidth = this.weight
    canvas.strokeStyle = this.color
  }

  this.serialized = function(){
    return {
      color: this.color,
      weight: this.weight,
      user: this.user,
      path: this.path
    }
  }

  var afterSend = function(){
    // called after successful post to server
  }

  this.send = function(){
    http.post('draw-actions', this.serialized(), afterSend).fail(function(){
      alert('Something went wrong')
    })
  }

  return this
}


var init = function(){
  var $window = $(window)
  var body = $('body'),
      height = $window.height(),
      width = $window.width()
  
  if (width < 100 ||  height < 100) {
    console.log('too small', width, height)
    return setTimeout(init, 100)
  }

  body.width(width)
  body.height(height)
  
  var canvas = '<canvas id="canvas" width="'+body.width()+'" height="'+body.height()+'"></canvas>'
  body.html(canvas)

  http = new Http()
  drawer = new Drawer()
  drawer.watch(http, $('#canvas'))
}



$(document).ready(init)