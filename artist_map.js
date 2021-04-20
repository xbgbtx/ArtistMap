async function page_loaded ()
{
    console.log ( "Artist Map starting..." );

    let map = create_map ();

    await add_locations ( map );
}

function create_map ()
{
    let map = L.map ("mapdiv").setView ( [51.505, -0.09], 2 );

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", 
    {
        maxZoom: 19,
        attribution: "&copy; <a href=\"https://openstreetmap.org/copyright\">"+
                     "OpenStreetMap contributors</a>"
    }).addTo(map);

    return map;
}

async function add_locations ( map )
{
    let response = await fetch("data/raw/test_output/locations.csv");
    let text = await response.text ();
    let lines = text.split ( "\r\n" );

    for ( const l of lines.slice(1,100) ) 
    {
        let fields = l.split ( "," );
        let loc, lon, lat, artist_count;

        [ loc, lat, lon, artist_count ] = fields;

        L.marker([lat,lon],
        {
            title : `${artist_count} artists`
        })
            .on ( "click", () => location_clicked ( loc ) ) 
            .addTo(map);
    }
}

function location_clicked ( loc_id )
{
    let info_div = document.getElementById ( "infodiv" );

    let data_url = `https://www.wikidata.org/wiki/${loc_id}`
    let data_anc = `<a href="${data_url}">${loc_id}</a>`

    info_div.innerHTML = `Loc: ${data_anc}`;
}
