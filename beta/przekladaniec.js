/*
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
    readySteadyGo();
  }
  reader.onload = function(evt) {
     //alert('Plik załadowano.');
     callback(evt.target.result);
   }
  // Read file as text
  reader.readAsBinaryString(evt.target.files[0]);
}
$('#file').change(fileSelect);

//ready screen
function readySteadyGo(){
  $('#fileContainer').hide();
  $("#ready").show();
  //calling function that will work with sentences
  $("#ready").on("click", function(){
    $("#ready").hide();
    $("#score").slideDown();
    clock();
    furtherWorkSentences();
  })
}

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
*/

let sentenceSwap = {

  settings: {
    nodeSettings: $(".js-game-init ul.sentences li"),
    nodeField: $('.js-game-field'),

    //czy liczyc czas
    //czy oceniac na bierzaco
    //czy pozwalac na poprawe - sprawdzenie na przycisku ostatecznie
    //z podpowedziami

    score: 0,
    timeStart: false,
    totalSentenes: 0,
    resolvedSentences: 0,
    badAttempts: 0,
    sentences: {},
  },

  init: function() {
    this.getOptions();
    this.generateField();
    this.addEvents();
  },

  getOptions: function() {
    let self = this;
    self.settings.nodeSettings.each(function(i, e){
      let sentence = $(e).attr('data-sentence');
      if(sentence){
        sentence = sentence.replace(/ +(?= )/g,'');
        sentence = sentence.trim();
        let wordArray = sentence.split(' ');
        let wordArrayCopy = wordArray.slice();
        shuffle(wordArray);
        let maxTries = 5;
        while( compareArrays(wordArray, wordArrayCopy) && maxTries ){
          shuffle(wordArray);
          maxTries--;
        }
        self.settings.sentences[i] = {
          'sentence': sentence,
          'word_array': wordArray,
        };
        self.settings.totalSentenes++;
      }else{
        console.log('error in sentence number: ' + (i+1) );
      }
    });
    self.settings.nodeSettings.remove();
    //console.log(self.settings.sentences);
  },

  generateField: function(){
    let self = this;
    let target = self.settings.nodeField;
    let i = 0;
    while(self.settings.sentences[i]){
      let array = self.settings.sentences[i].word_array;
      let length = array.length;
      //console.log(array);

      let container = $('<div/>',{
        'class': 'js-task-sentence',
        'data-number': i,
      });
      let answerSection = $('<div/>',{
        'class': 'js-answer'
      });
      let answerContent = '';
      for(let i = 0; i < length; i++){
        answerContent = answerContent + '<span class="js-empty" ondragover="allowDrop(event)" ondrop="drop(event)"></span>';
      }
      answerSection.html(answerContent);
      answerSection.children('span').eq(0).addClass('active');
      let questionSection = $('<div/>',{
        'class': 'js-question'
      });
      for(let i = 0; i < length; i++){
        questionSection.append($('<span/>',{
          'text': array[i],
          'data-text': array[i],
          'draggable': 'true',
          'ondragstart': "drag(event)"
        }));
      }

      container.append(answerSection);
      container.append(questionSection);
      target.append(container);

      i++;
    }
  },

  addEvents: function(){
    let trueThis = this;

    $('.js-task-sentence .js-question > span').click(function(e){
      e.preventDefault();
      trueThis.pushWord(e.target);
    });

    $('.js-task-sentence .js-answer').on('click', 'span.js-filled', function(e){
      e.preventDefault();
      trueThis.popWord(e.target);
    });

    $('.js-task-sentence .js-answer').on('click', 'span.js-empty', function(e){
      e.preventDefault();
      trueThis.changeTarget(e.target);
    });
  },

  pushWord: function(target){
    let trueThis = this;
    let sentence = $(target).closest('.js-task-sentence');
    let self = $(target);
    let text = self.attr('data-text');
    self.addClass('js-used');
    sentence.find('.js-answer span.js-empty.active').text(text).attr('data-text', text).removeClass('js-empty').addClass('js-filled');
    let next = sentence.find('.js-answer span.active').next('.js-empty');
    sentence.find('.js-answer span.active').removeClass('active');
    next.addClass('active');
    if(next.length == 0){
      next = sentence.find('.js-empty').eq(0);
      if(next.length == 0){
        trueThis.checkSentence(sentence);
      }else{
        next.addClass('active');
      }
    }
  },

  popWord: function(target){
    let sentence = $(target).closest('.js-task-sentence');
    let self = $(target);
    let text = self.attr('data-text');
    self.text('').removeClass('js-filled').addClass('js-empty');
    sentence.find('.js-question span.js-used[data-text="' + text + '"]').removeClass('js-used');
    sentence.find('.js-answer span.active').removeClass('active');
    self.addClass('active');
  },

  changeTarget: function(target){
    let sentence = $(target).closest('.js-task-sentence');
    let self = $(target);
    sentence.find('.active').removeClass('active');
    self.addClass('active');
  },

  checkSentence: function(sentence){
    let self = this;
    let arrayAnswer = sentence.find('.js-answer span.js-filled');
    let answer = '';
    arrayAnswer.each(function(i, e){
      answer += $(e).attr('data-text') + ' ';
    });
    answer = answer.replace(/ +(?= )/g,'');
    answer = answer.trim();

    if(answer == self.settings.sentences[sentence.attr('data-number')].sentence){
      sentence.removeClass('bad-answer').addClass('good-answer');
      let mistakes = sentence.attr('data-mistakes');
      if(mistakes){
        let span = $('<span/>', {
          'text': 'liczba błędów: ' + mistakes,
        });
        sentence.find('.js-question').append(span);
      }else{
        let span = $('<span/>', {
          'text': 'liczba błędów: ' + 0,
        });
        sentence.find('.js-question').append(span);
      }
      self.settings.resolvedSentences++;
      if(self.settings.resolvedSentences == self.settings.totalSentenes){
        self.finishExam();
      }
    }else{
      sentence.addClass('bad-answer').removeClass('good-answer');
      self.settings.badAttempts++;
      let mistakes = sentence.attr('data-mistakes');
      if(mistakes){
        sentence.attr('data-mistakes', Number(mistakes) + 1);
      }else{
        sentence.attr('data-mistakes', 1);
      }
    }
  },

  finishExam: function(){
    alert('done');
  },

};

sentenceSwap.init();

function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

function compareArrays(a, b){
  let same = true;
  for(let i = 0; i < a.length; i++){
    if(a[i] != b[i]){
      same = false;
    }
  }
  return same;
}

//check for mobile support
let elementDragged = false;
function allowDrop(ev) {
  ev.preventDefault();
}
function drag(ev) {
  elementDragged = $(ev.target);
}
function drop(ev) {
  ev.preventDefault();
  console.log(elementDragged);
  console.log(ev.target);
  if( !elementDragged.hasClass('js-used') && $(ev.target).hasClass('js-empty') ){
    console.log('drag it');
    $(ev.target).click();
    elementDragged.click();
  }
}
