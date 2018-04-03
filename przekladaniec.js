var totalSentences;

//click to change of focus in sentence
//not working on filled
$("body").on("click", ".riddle:not(.finished) .sentence div:not(.filled)", ( event )=>{
  $(event.target).siblings(".focused").removeClass("focused");
  $(event.target).addClass("focused");
});

//making move
$("body").on("click", ".words div", ( event )=>{
  var word, focused, nr;
  word = $(event.target).html();
  focused = $(event.target).parent().siblings(".sentence").children(".focused");
  nr = $(event.target).attr("nr");

  //adding word to focused
  focused.html(word).addClass("filled").removeClass("focused");
  //moving atribute nr with word
  focused.attr("nr", nr);
  //hiding selected word
  $(event.target).addClass("empty");

  //decrease number of words
  var count = parseInt($(event.target).siblings(".howMuch").html());
  count -= 1;
  $(event.target).siblings(".howMuch").html(count);

  //check if sentence is right after droping down to 0
  if(count==0){
    checkIfRight( focused );
  }

  //function that will focus next not filled
  focuseNext( focused );
});

//selects next not filled
function focuseNext( focused ){
  $(focused).siblings("div:not(.filled)").first().addClass("focused");
}

//checking sentence when howMuch == 0
function checkIfRight( focused ){
  var allDivs, parent, win = true;
  allDivs = $(focused).parent().children("div").length;
  parent = $(focused).parent();

  //if one piece is wrong win = false
  for(var i=0; i<allDivs;i++){
    if(parent.children("div:eq("+i+")").attr("nr")!=i){
      win = false;
    }
  }
  //action on win or loose
  if(win){
    parent.parent().removeClass("wrong");
    parent.parent().addClass("finished");
    //adding point to doneSentences
    var count = parseInt($("#doneSentences").html());
    count += 1;
    $("#doneSentences").html(count);

    //add function that will handle totalWin
    if(count == totalSentences){
      totalWin();
    }
  }else{
    parent.parent().addClass("wrong");
    //adding point to errors
    var count = parseInt($("#errors").html());
    count += 1;
    $("#errors").html(count);
  }
}

//deleting filled
$("body").on("click", ".riddle:not(.finished) .sentence .filled", ( event )=>{
  var word, emptyWord, nr;
  word = $(event.target).html();
  emptyWord = $(event.target).parent().siblings(".words").children(".empty").first();
  nr = $(event.target).attr("nr");

  $(event.target).html("&nbsp;").removeClass("filled");
  $(event.target).siblings(".focused").removeClass("focused");
  $(event.target).addClass("focused");
  emptyWord.html(word).removeClass("empty");

  //moving atribute nr with word
  emptyWord.attr("nr", nr);

  //increase number of words
  var count = parseInt($(event.target).parent().siblings(".words").children(".howMuch").html());
  count += 1;
  $(event.target).parent().siblings(".words").children(".howMuch").html(count);
});

//FILE
var reader, lines;

function fileSelect(evt) {

  reader = new FileReader();
  //error and succes info
  reader.onerror = function() {
    alert('Błąd ładowania.');
  }
  function callback(fileData) {
    //getting sentences to var
    lines = fileData.split(/\n/);
    //some actions when sentences are loaded
    $('#fileContainer').hide();
    $("#score").slideDown();
    clock();
    //calling function that will work with sentences
    furtherWorkSentences();
  }
  reader.onload = function(evt) {
     //alert('Plik załadowano.');
     callback(evt.target.result);
   }
  // Read file as text
  reader.readAsBinaryString(evt.target.files[0]);
}
$('#file').change(fileSelect);

//Further work with loaded sentences
var aRiddlePiece = '<section class="riddle workIP">' +
 '<div class="sentence">' +
 '</div>' +
 '<div class="words">' +
 '<span class="howMuch"></span>' +
 '</div>' +
 '</section>';

function furtherWorkSentences(){
  totalSentences = lines.length;
  $("#totalSentences").text(totalSentences);

  for(var i=0; i<lines.length; i++){
    var sentence = lines[i].split(" ");

    $("body").append(aRiddlePiece);
    $(".workIP").children(".words").children(".howMuch").html(sentence.length);
    for(var j=0; j<sentence.length; j++){
      $(".workIP").children(".sentence").append("<div>&nbsp;</div>");
      $(".workIP").children(".words").append("<div nr='"+j+"'>"+sentence[j]+"&nbsp;</div>");
    }
    //randomize order
    var list = $(".workIP").children(".words").children();
      for(var k = 0; k < list.length; k++){
        var target = Math.floor(Math.random() * list.length -1) + 1;
        var target2 = Math.floor(Math.random() * list.length -1) +1;
        list.eq(target).before(list.eq(target2));
      }
    //set first to focused and remove work status
    $(".workIP").children(".sentence").children().first().addClass("focused");
    $(".workIP").removeClass("workIP");
  }
}

//total win function
function totalWin(){
  clearTimeout(t);
  $("body").css("overflow", "hidden");
  $("#winMessageBcg").show();
  $("#errorsWin").html($("#errors").html());
  $("#timeWin").html($("#time").html());
}

//timer
var c=0, minutes= 0, t;

function clock(){
  if(c<10){
      c = "0"+c;
  }
  $('#time').html(minutes + 'm ' + c + 's');
  c=parseInt(c)+1;
  if (c%60==0){
    minutes+=1;
    c=0;
  }
  t=setTimeout("clock()",1000);
}
