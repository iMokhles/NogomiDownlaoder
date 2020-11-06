const request = require('request');
const cheerio = require('cheerio');

var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'NogomiDownloader',
    // App id
    id: 'com.imokhles.nogomidownloader',
    // theme
    theme: 'ios',
});

var $$ = Dom7;

var mainView = app.views.create('.view-main');

$$('#loadAlbumButton').on('click', function () {
    var albumUrl = $$('#albumUrl').val();
    if (albumUrl) {
        getPage( albumUrl, (html) => {
            let data = parsePage(html);
            if (data && data.length) {
                data.map((song) => (
                    $$('#resultsList').append(
                        "<ul class=\"margin-bottom\" style=\"border-radius: 0px; box-shadow: 0 10px 30px 0 rgba(0, 0, 0, 0.1);\">\n" +
                        "                        <li>\n" +
                        "                            <div class=\"item-content\" style=\"border-color: transparent;\">\n" +
                        "                                <div class=\"item-media\"><img src=\""+song.avatar+"\" width=\"44\"/></div>\n" +
                        "                                <div class=\"item-inner\">\n" +
                        "                                    <div class=\"item-title-row\">\n" +
                        "                                        <div class=\"item-title\">"+song.title+"</div>\n" +
                        "                                    </div>\n" +
                        "                                    <div class=\"item-subtitle\">"+song.artist+"</div>\n" +
                        "                                </div>\n" +
                        "<p class=\"row\">" +
                        "<a class=\"col button button-small button-fill color-green link external\" href=\""+song.url+"\" style=\"margin-right: 20px;\" id=\"downloadSong_"+song.id+"\">Download</a>" +
                        "</p>" +
                        "                            </div>\n" +
                        "                        </li>\n" +
                        "                    </ul>"
                    )
                ));
                $$('#downloadAll').css('opacity', 1)
            } else {
                $$('#downloadAll').css('opacity', 0)
            }


            console.log("DATA: "+JSON.stringify(data, null, 2))
            // savePage(data);
        });
    } else {
        $$('#albumUrl').val("https://nogomistars.com/36/asala/la-testaslem")
    }

});

const getPage = ( albumUrl, cb ) => {
    request(albumUrl, {
        timeout: 3000
    }, (error, response, body) => {
        if(!error) {
            cb(body);
        }
    });
};

const parsePage = ( data ) => {
    const $ = cheerio.load(data);
    let output = [];
    $('#tracks').find('.item.r').each( (i, elem ) => {

        let $itemInfo = $(elem).find('.item-info');
        let $itemTitle = $itemInfo.find( '.item-title' );
        let $a = $itemTitle.find('a');
        let title = $a.text()
        let url = $(elem).attr('data-src')
        let id = $(elem).attr('data-id')
        id = id.split('-')[1]
        if (title && url) {
            let datum = {
                id: id,
                avatar: 'https://nogomistars.com/albumlogo/assala-2020.jpg',
                title: title.replace(/(\r\n|\n|\r)/gm, ""),
                site: url.split('/').pop().split('-')[0].split('_')[0],
                artist: url.split('/').pop().split('-')[0].split('_')[1],
                fileName: url.split('/').pop().split('-')[1],
                url: url,
            };
            output.push(datum);
        }
    });
    return output;
};
