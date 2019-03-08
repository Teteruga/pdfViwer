
//Regex

var RegexP = new RegExp(/(?<=(<\s*p\s*.*>)|(<\s*h\d\s*.*>)|(<\s*ol\s*.*>))(.*?)(?=(<\s*\/\s*p\s*>)|(<\s*\/\s*h\d\s*>)|(<\s*\/\s*ol\s*>))/mg);

var RegexStyle = new RegExp(/(?!style\s*=\s*)[\'\"\´\`][\s\S]*[\'\"\´\`]/);

var RegexCleanUp = new RegExp(/[\'\"\´\`;]/);

var RegexStyleElem =  new RegExp(/((<\s*ins\s*?>)|(<\s*em\s*?>)|(<\s*s\s*?>)|(<\s*strong\s*?>))(.*?)((<\s*\/\s*ins\s*?>)|(<\s*\/\s*em\s*?>)|(<\s*\/\s*s\s*?>)|(<\s*\/\s*strong\s*?>))/g);
//

const loadScript = (source, beforeEl, async = true, defer = true) => {
    return new Promise((resolve, reject) => {
      let script = document.createElement('script');
      const prior = beforeEl || document.getElementsByTagName('script')[0];
  
      script.async = async;
      script.defer = defer;
  
      function onloadHander(_, isAbort) {
        if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
          script.onload = null;
          script.onreadystatechange = null;
          script = undefined;
  
          if (isAbort) { reject(); } else { resolve(); }
        }
      }
  
      script.onload = onloadHander;
      script.onreadystatechange = onloadHander;
  
      script.src = source;
      prior.parentNode.insertBefore(script, prior);
    });
  }

CKEDITOR.plugins.add( 'pdfViwer', {
    icons: 'pdfViwer',
    availableLangs: {'pt-br':1, 'en':1},
    lang: 'pt-br, en',
	init: function( editor ) {

        if(editor.ui.addButton){

            editor.ui.addButton('pdfViwer', {
                command: 'pdf-viwer',
                toolbar: 'pdf-viwer',
            });
        }

        editor.addCommand("pdf-viwer", {
            exec: function(evt) {

                // editor.ui.addButton && editor.ui.addButton('pdfViwer',{
                //     label: editor.lang.pdfViwer.preview,
                //     command: 'pdfViwer',
                //     toolbar: 'insert'
                // } );

                var editorContent = editor.getData();

                loadScript("./ckeditor_4.11.2/ckeditor/plugins/pdfViwer/dependencies/pdfkit.js").then(() => {

                    loadScript("./ckeditor_4.11.2/ckeditor/plugins/pdfViwer/dependencies/blob-stream.js").then(() => {

                        var doc = new PDFDocument();
                        var stream = doc.pipe(blobStream());

                        while( (matches = RegexP.exec(editorContent)) !== null ) {
                        
                            var style = RegexStyle.exec(matches[0]);
                            
                            if(style !== null){

                                var styles = style[0].replace(RegexCleanUp, "");
                                styles = styles.replace("\"", "");

                                styles = styles.split(";");

                                var objStyle = {};

                                styles.forEach(function(value, key) {

                                    var propertyArr = value.split(":");

                                        //TO DO: transform px to point ratio of 1px -> 0.75points
                                        objStyle[propertyArr[0].trim()] = propertyArr[1].trim();

                                });

                                console.log(objStyle);

                                for (var propertyName in myObject) {

                                    if (myObject.hasOwnProperty(propertyName)) {
                                    
                                        switch(propertyName){
                                            case '':
                                                console.log('case');
                                            break;
                                            default:
                                                console.log('default');

                                        }

                                    }
                                }
                            } 

                            if(matches[0] === "&nbsp;"){
                                doc.moveDown();
                            }
                            else{

                                styleElem = RegexStyleElem.exec(matches[0]);

                                if(styleElem !== null){

                                    text = matches[0].slice(0, styleElem.index);

                                    doc.text(text);

                                    var docPosXAfterWrite = doc.x;
                                    var docPosYAfterWrite = doc.y;
                                    var widthString;
                                    var heightLine  

                                    styleElem = RegexStyleElem.exec(matches[0]);

                                    while(styleElem !== null){

                                        // doc.text(styleElem[0], docPosXAfterWrite, docPosYAfterWrite);

                                        // widthString = doc.widthOfString(styleElem[0]);
                                        // heightLine = doc.currentLineHeight();                                        

                                        // switch(styleElem[1]){
                                        //     case "<em>":
                                        //         doc.link(docPosXAfterWrite, docPosYAfterWrite, widthString, heightLine);
                                        //         break;
                                        //     case "<strong>":
                                        //         doc.highlight(docPosXAfterWrite, docPosYAfterWrite, widthString, heightLine);
                                        //         break;
                                        //     case "<ins>":
                                        //         doc.underline(docPosXAfterWrite, docPosYAfterWrite, widthString, heightLine);
                                        //         break;
                                        //     case "<s>":
                                        //         doc.strike(docPosXAfterWrite, docPosYAfterWrite, widthString, heightLine);
                                        //         break;
                                        //     default:
                                        // }

                                        styleElem = RegexStyleElem.exec(matches[0]);
                                        styleElem = null;
                                        // docPosXAfterWrite = doc.x;
                                        // docPosYAfterWrite = doc.y;                                        
                                    }
                                }
                                else{
                                    doc.text(matches[0]);
                                }
                            }

                            console.log(doc.x);
                            console.log(doc.y);

                        }

                        // lorem = matches[0];

                        // draw some text
                        // doc.fontSize(25).text('Here is some vector graphics...', 100, 80);
                        
                        // some vector graphics
                        // doc
                        // .save()
                        // .moveTo(100, 150)
                        // .lineTo(100, 250)
                        // .lineTo(200, 250)
                        // .fill('#FF3300');
                        
                        // doc.circle(280, 200, 50).fill('#6600FF');
                        
                        // an SVG path
                        // doc
                        // .scale(0.6)
                        // .translate(470, 130)
                        // .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
                        // .fill('red', 'even-odd')
                        // .restore();
                        
                        // and some justified text wrapped into columns
                        // doc
                        // .text('And here is some wrapped text...', 100, 300)
                        // .font('Times-Roman', 13)
                        // .moveDown()
                        // .text(lorem, {
                        //     width: 412,
                        //     align: 'justify',
                        //     indent: 30,
                        //     columns: 2,
                        //     height: 300,
                        //     ellipsis: true
                        // });
                        
                        doc.end();

                        stream.on('finish', function() {

                            const leftpos = screen.width / 2;
                            const toppos = 0;
            
                            var params  = 'width='+ (screen.width/2);
                            params += ', height='+ (screen.height/1.2);
                            params += ', top='+toppos+', left='+leftpos;
                            params += ', menubar=yes';
                            params += ', status=yes';
                            params += ', fullscreen=no';

                            var visualizarWindow = window.open('','navegador', params);
                            
                            var divText = '<html><head></head><body style="padding: 0px 5px;"></body></html>';
            
                            var docWindow = visualizarWindow.document;
                            docWindow.open();
                            docWindow.write(divText);
                            docWindow.close();

                            iframe = docWindow.createElement("iframe");
                            iframe.src = stream.toBlobURL('application/pdf');
                            iframe.style.width = "100%";
                            iframe.style.height = "100%";

                            body = docWindow.getElementsByTagName("body")[0];
                            body.appendChild( iframe );

                        });

      
                      }, () => {
                        console.log('fail to load script');
                      });

                  console.log('script loaded');

                }, () => {
                  console.log('fail to load script');
                });


                // $.getScript("../plugins/pdfViwer/dependencies/pdfkit.js", function() {

                //     $.getScript("../plugins/pdfViwer/dependencies/blob-stream.js", function() {

                //         var doc = new PDFDocument();
                //         var stream = doc.pipe(blobStream());

                //         RegexP = new RegExp(/(?:(<\s*p.*>)|(<\s*h\d.*>)|(<\s*ol.*>))[\s\S]*(?:(<\s*\/\s*p\s*>)|(<\s*\/\s*h\d\s*>)|(<\s*\/\s*ol\s*>))/);

                //         var matches = RegexP.exec(editorContent);

                //         var RegexStyle = new RegExp(/(?!style\s*=\s*)[\'\"\´\`][\s\S]*[\'\"\´\`]/);

                //         var style = RegexStyle.exec(matches[0]);
                        
                //         var RegexCleanUp = new RegExp(/[\'\"\´\`;]/);

                //         var styles = style[0].replace(RegexCleanUp, "");
                //         styles = styles.replace("\"", "");

                //         styles = styles.split(";");

                //         var objStyle = {};

                //         styles.forEach(function(value, key) {

                //             var propertyArr = value.split(":");

                //                 //TO DO: transform px to point ratio of 1px -> 0.75points
                //                 objStyle[propertyArr[0].trim()] = propertyArr[1].trim();

                //         });

                //         console.log(objStyle);

                //         for (var propertyName in myObject) {

                //             if (myObject.hasOwnProperty(propertyName)) {
                              
                //                 switch(propertyName){
                //                     case '':
                //                         console.log('case');
                //                     break;
                //                     default:
                //                         console.log('default');

                //                 }

                //             }
                //           }

                //         // <p style="text-indent:50px">
                //         //     <span dir="rtl">
                //         //         <u>ASDHaushdiuashdiua</u>
                //         //         shuidha
                //         //         <em>siudasuidh</em>
                //         //         IA
                //         //         <strong>UShdIUAS</strong>
                //         //         HDIUA
                //         //         <span style="font-family:Arial,Helvetica,sans-serif">
                //         //             HSIUDHA
                //         //         </span>
                //         //         SIDhasuidhasiudha
                //         //         <tt>
                //         //             <span class="marker">
                //         //                 siu
                //         //             </span>
                //         //         </tt>
                //         //         dhasiudh
                //         //         <span style="font-family:Courier New,Courier,monospace">
                //         //             iaushdiuashdaiushdui
                //         //         </span>
                //         //             ai
                //         //         <span style="font-size:14px">
                //         //             ouh
                //         //         </span>
                //         //         asiuhdiu
                //         //         <span style="font-family:Lucida Sans Unicode,Lucida Grande,sans-serif">
                //         //             ashd
                //         //         </span>
                //         //         iuasdiu
                //         //         <span style="font-family:Comic Sans MS,cursive">
                //         //             ashdui
                //         //         </span>
                //         //         ahsid
                //         //     </span>
                //         // </p>




                //         // draw some text
                //         doc.fontSize(25).text('Here is some vector graphics...', 100, 80);
                        
                //         // some vector graphics
                //         doc
                //         .save()
                //         .moveTo(100, 150)
                //         .lineTo(100, 250)
                //         .lineTo(200, 250)
                //         .fill('#FF3300');
                        
                //         doc.circle(280, 200, 50).fill('#6600FF');
                        
                //         // an SVG path
                //         doc
                //         .scale(0.6)
                //         .translate(470, 130)
                //         .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
                //         .fill('red', 'even-odd')
                //         .restore();
                        
                //         // and some justified text wrapped into columns
                //         doc
                //         .text('And here is some wrapped text...', 100, 300)
                //         .font('Times-Roman', 13)
                //         .moveDown()
                //         .text(lorem, {
                //             width: 412,
                //             align: 'justify',
                //             indent: 30,
                //             columns: 2,
                //             height: 300,
                //             ellipsis: true
                //         });
                        
                //         doc.end();

                //         stream.on('finish', function() {

                //             const leftpos = screen.width / 2;
                //             const toppos = 0;
            
                //             var params  = 'width='+ (screen.width/2);
                //             params += ', height='+ (screen.height/1.2);
                //             params += ', top='+toppos+', left='+leftpos;
                //             params += ', menubar=yes';
                //             params += ', status=yes';
                //             params += ', fullscreen=no';

                //             var visualizarWindow = window.open('','navegador', params);
                            
                //             var divText = '<html><head></head><body style="padding: 0px 5px;"></body></html>';
            
                //             var docWindow = visualizarWindow.document;
                //             docWindow.open();
                //             docWindow.write(divText);
                //             docWindow.close();

                //             iframe = docWindow.createElement("iframe");
                //             iframe.src = stream.toBlobURL('application/pdf');
                //             iframe.style.width = "100%";
                //             iframe.style.height = "100%";

                //             body = docWindow.getElementsByTagName("body")[0];
                //             body.appendChild( iframe );

                //         });

                //     });

                // });


            }
        });
	}

});
