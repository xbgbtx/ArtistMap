class SPARQLQueryDispatcher {
	constructor( endpoint ) {
		this.endpoint = endpoint;
	}

	query( sparqlQuery ) {
		const fullUrl = this.endpoint + '?query=' + encodeURIComponent( sparqlQuery );
		const headers = { 'Accept': 'application/sparql-results+json' };

		return fetch( fullUrl, { headers } ).then( body => body.json() );
	}
}

const endpointUrl = 'https://query.wikidata.org/sparql';
const sparqlQuery = `SELECT ?name ?article WHERE {
    ?article schema:about wd:Q9920 ;
             schema:inLanguage ?lang ;
             schema:name ?name ;
              
             schema:isPartOf <https://en.wikipedia.org/>; .
  FILTER (!CONTAINS(?name, ':')) .
  FILTER(?lang in ('en') ).
}`;

const queryDispatcher = new SPARQLQueryDispatcher( endpointUrl );
queryDispatcher.query( sparqlQuery ).then( console.log );

