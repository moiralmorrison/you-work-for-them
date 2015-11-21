$.get("constituencies.tsv", function (constituencyData) {
  var lines = constituencyData.split("\n")
  var constituencies = {}
  for (i in lines) {
    constituencies[lines[i].split("\t")[0]] = lines[i].split("\t")[1]
  }

  var constituencyLookup = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.whitespace,
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: Object.keys(constituencies)
  });

  // var mpLookup = new Bloodhound({
  //   datumTokenizer: Bloodhound.tokenizers.obj.whitespace('team'),
  //   queryTokenizer: Bloodhound.tokenizers.whitespace,
  //   prefetch: '../data/nhl.json'
  // });

  $('#constituency').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  },
  {
    name: 'constituency',
    source: constituencyLookup,
    templates: {
      header: '<h3 class="search-type">Constituencies</h3>'
    }
  }
  // ,
  // {
  //   name: 'mps',
  //   display: 'constituency',
  //   source: mpLookup,
  //   templates: {
  //     header: '<h3 class="search-type">MPs</h3>'
  //   }
  // }
  );

  $("#search").submit(function (event) {
    $('#constituency').typeahead('close');
    var search = $('#constituency').typeahead('val');
    var code = constituencies[search];
    window.location.hash = '#' + code;
    return false;
  });

});
