﻿CKEDITOR.plugins.add( 'pdfViwer', {
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

                var lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam in suscipit purus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vivamus nec hendrerit felis. Morbi aliquam facilisis risus eu lacinia. Sed eu leo in turpis fringilla hendrerit. Ut nec accumsan nisl. Suspendisse rhoncus nisl posuere tortor tempus et dapibus elit porta. Cras leo neque, elementum a rhoncus ut, vestibulum non nibh. Phasellus pretium justo turpis. Etiam vulputate, odio vitae tincidunt ultricies, eros odio dapibus nisi, ut tincidunt lacus arcu eu elit. Aenean velit erat, vehicula eget lacinia ut, dignissim non tellus. Aliquam nec lacus mi, sed vestibulum nunc. Suspendisse potenti. Curabitur vitae sem turpis. Vestibulum sed neque eget dolor dapibus porttitor at sit amet sem. Fusce a turpis lorem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris at ante tellus. Vestibulum a metus lectus. Praesent tempor purus a lacus blandit eget gravida ante hendrerit. Cras et eros metus. Sed commodo malesuada eros, vitae interdum augue semper quis. Fusce id magna nunc. Curabitur sollicitudin placerat semper. Cras et mi neque, a dignissim risus. Nulla venenatis porta lacus, vel rhoncus lectus tempor vitae. Duis sagittis venenatis rutrum. Curabitur tempor massa…";


                $.getScript("/lorenzog/pgedigital/webroot/js/ckeditor/plugins/pdfViwer/dependencies/pdfkit.js", function() {

                    $.getScript("/lorenzog/pgedigital/webroot/js/ckeditor/plugins/pdfViwer/dependencies/blob-stream.js", function() {

                        var doc = new PDFDocument();
                        var stream = doc.pipe(blobStream());
                        
                        // draw some text
                        doc.fontSize(25).text('Here is some vector graphics...', 100, 80);
                        
                        // some vector graphics
                        doc
                        .save()
                        .moveTo(100, 150)
                        .lineTo(100, 250)
                        .lineTo(200, 250)
                        .fill('#FF3300');
                        
                        doc.circle(280, 200, 50).fill('#6600FF');
                        
                        // an SVG path
                        doc
                        .scale(0.6)
                        .translate(470, 130)
                        .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
                        .fill('red', 'even-odd')
                        .restore();
                        
                        // and some justified text wrapped into columns
                        doc
                        .text('And here is some wrapped text...', 100, 300)
                        .font('Times-Roman', 13)
                        .moveDown()
                        .text(lorem, {
                            width: 412,
                            align: 'justify',
                            indent: 30,
                            columns: 2,
                            height: 300,
                            ellipsis: true
                        });
                        
                        // end and display the document in the iframe to the right
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
            
                            var doc = visualizarWindow.document;
                            doc.open();
                            doc.write(divText);
                            doc.close();

                            iframe = doc.createElement("iframe");
                            iframe.src = stream.toBlobURL('application/pdf');
                            iframe.style.width = "100%";
                            iframe.style.height = "100%";

                            body = doc.getElementsByTagName("body")[0];
                            body.appendChild( iframe );

                        });

                    });

                });


            }
        });
	}

});
